"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { headers } from "next/headers";
import { createSupabaseAdmin, requireAuth } from "./supabase-server";
import { VALID_INQUIRY_STATUSES, type InquiryStatus } from "./types";
import {
  RATE_LIMIT_PER_MIN,
  RATE_WINDOW_MS,
  hashIp,
  isHoneypotFilled,
  isTooFast,
  isWithinDedupeWindow,
  mergeMessage,
  readSource,
  type InquirySource,
} from "./inquiry-guard";
import { notifyNewInquiry } from "./notify";

export interface Inquiry {
  id: string;
  inquiry_type: string;
  name: string;
  phone: string;
  location: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
  /** 007 이후 — 유입 캡처·중복 횟수·알림 시각. 마이그레이션 전 DB 에서는 undefined. */
  source?: InquirySource | null;
  submit_count?: number | null;
  notified_at?: string | null;
}

// ── 공개: 문의 제출 ─────────────────────────────────────────────────

const PHONE_PATTERN = /^\d{9,12}$/;

export async function submitInquiry(formData: FormData) {
  const inquiry_type = formData.get("inquiry_type");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const location = formData.get("location");
  const message = formData.get("message");

  if (
    typeof inquiry_type !== "string" ||
    !inquiry_type.trim() ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim()
  ) {
    throw new Error("필수 항목을 입력해 주세요.");
  }

  const normalizedPhone = phone.trim().replace(/[-\s]/g, "");
  if (!PHONE_PATTERN.test(normalizedPhone)) {
    throw new Error(
      "전화번호 형식이 올바르지 않습니다. (예: 01012345678 또는 010-1234-5678)",
    );
  }

  const safeLocation = typeof location === "string" ? location.trim() : "";
  const safeMessage = typeof message === "string" ? message.trim() : "";
  const safeType = inquiry_type.trim();
  const safeName = name.trim();

  // ── 봇 가드: honeypot 에 값이 있거나 3초 안에 제출이면 저장·알림 없이 조용히 성공 처리 ──
  const now = Date.now();
  if (isHoneypotFilled(formData.get("company_website")) || isTooFast(formData.get("form_ts"), now)) {
    console.warn("inquiry dropped as bot", { honeypot: isHoneypotFilled(formData.get("company_website")) });
    return;
  }

  const h = await headers();
  const ipHash = hashIp(h.get("x-forwarded-for") ?? h.get("x-real-ip"));
  const ua = (h.get("user-agent") ?? "").slice(0, 300);
  const source = readSource((k) => formData.get(k));

  // 서비스 롤 — anon INSERT 정책은 007 에서 제거(직접 insert 로 가드 우회 방지).
  const admin = createSupabaseAdmin();

  // ── 레이트리밋: 같은 IP 해시 분당 3회 (컬럼이 아직 없으면 건너뜀) ──
  if (ipHash) {
    const since = new Date(now - RATE_WINDOW_MS).toISOString();
    const { count, error: rlErr } = await admin
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (!rlErr && (count ?? 0) >= RATE_LIMIT_PER_MIN) {
      throw new Error("문의가 너무 자주 접수되고 있습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  // ── 중복: 같은 번호·같은 구분으로 10분 안 재제출이면 새 행 대신 합친다 ──
  const { data: prev } = await admin
    .from("inquiries")
    .select("*") // 007 전 DB 에도 돌아가게 컬럼을 지정하지 않는다
    .eq("phone", normalizedPhone)
    .eq("inquiry_type", safeType)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (prev && isWithinDedupeWindow(prev.created_at, now)) {
    const merged: Record<string, unknown> = {
      message: mergeMessage(prev.message ?? "", safeMessage),
      location: prev.location || safeLocation,
      updated_at: new Date(now).toISOString(),
    };
    if (typeof prev.submit_count === "number") merged.submit_count = prev.submit_count + 1;
    const { error: upErr } = await admin.from("inquiries").update(merged).eq("id", prev.id);
    if (upErr) console.error("inquiry dedupe update failed:", upErr.message);
    revalidatePath("/admin/inquiries");
    return; // 알림은 첫 제출 때 이미 나갔다
  }

  // ── 저장: 007 컬럼 포함 → 컬럼이 아직 없으면 기본 컬럼만으로 재시도 ──
  const base = {
    inquiry_type: safeType,
    name: safeName,
    phone: normalizedPhone,
    location: safeLocation,
    message: safeMessage,
  };
  let inserted = await admin
    .from("inquiries")
    .insert({ ...base, source, ip_hash: ipHash, ua })
    .select("id")
    .single();
  if (inserted.error && /column|schema cache/i.test(inserted.error.message)) {
    console.warn("inquiries: 007 columns missing, inserting base columns only");
    inserted = await admin.from("inquiries").insert(base).select("id").single();
  }
  if (inserted.error || !inserted.data) {
    console.error("inquiry insert failed:", inserted.error?.message);
    throw new Error("문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
  const id = inserted.data.id as string;

  // ── 알림: 응답을 보낸 뒤 실행(사용자는 기다리지 않는다) ──
  after(async () => {
    const channel = await notifyNewInquiry({
      id,
      inquiryType: safeType,
      name: safeName,
      phone: normalizedPhone,
      location: safeLocation,
      message: safeMessage,
      source,
    });
    if (channel) {
      console.log("inquiry notified:", id, "via", channel);
      const { error } = await admin.from("inquiries").update({ notified_at: new Date().toISOString() }).eq("id", id);
      if (error && !/column|schema cache/i.test(error.message)) console.warn("notified_at update failed:", error.message);
    } else {
      console.warn("inquiry notification not sent (no channel configured or all failed):", id);
    }
  });

  revalidatePath("/admin/inquiries");
}

// ── 관리자: 문의 목록 ───────────────────────────────────────────────

export async function getInquiries(): Promise<Inquiry[]> {
  await requireAuth();

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

// ── 관리자: 문의 단건 ───────────────────────────────────────────────

export async function getInquiry(id: string): Promise<Inquiry | null> {
  await requireAuth();

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

// ── 관리자: 상태 변경 ───────────────────────────────────────────────

export async function updateInquiryStatus(id: string, status: string) {
  if (!VALID_INQUIRY_STATUSES.includes(status as InquiryStatus)) {
    throw new Error("잘못된 상태값입니다.");
  }

  await requireAuth();

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Inquiry status update error:", error.message);
    throw new Error("상태 변경에 실패했습니다. 다시 시도해 주세요.");
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

// ── 관리자: 새 문의 개수 ────────────────────────────────────────────

export async function getNewInquiryCount(): Promise<number> {
  await requireAuth();

  const admin = createSupabaseAdmin();
  const { count, error } = await admin
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  if (error) return 0;
  return count ?? 0;
}
