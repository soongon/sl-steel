"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { createSupabaseAdmin, createSupabaseServer } from "./supabase-server";
import { VALID_INQUIRY_STATUSES, type InquiryStatus } from "./types";

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
}

// ── 공개: 문의 제출 ─────────────────────────────────────────────────

const PHONE_PATTERN = /^[\d]{2,4}-[\d]{3,4}-[\d]{4}$/;

export async function submitInquiry(formData: FormData) {
  const inquiry_type = formData.get("inquiry_type");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const location = formData.get("location");
  const message = formData.get("message");

  if (typeof inquiry_type !== "string" || !inquiry_type.trim()
    || typeof name !== "string" || !name.trim()
    || typeof phone !== "string" || !phone.trim()) {
    throw new Error("필수 항목을 입력해 주세요.");
  }

  if (!PHONE_PATTERN.test(phone.trim())) {
    throw new Error("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
  }

  const safeLocation = typeof location === "string" ? location.trim() : "";
  const safeMessage = typeof message === "string" ? message.trim() : "";

  const { error } = await supabase.from("inquiries").insert({
    inquiry_type: inquiry_type.trim(),
    name: name.trim(),
    phone: phone.trim(),
    location: safeLocation,
    message: safeMessage,
  });

  if (error) throw new Error("문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");

  revalidatePath("/admin/inquiries");
}

// ── 관리자: 문의 목록 ───────────────────────────────────────────────

export async function getInquiries(): Promise<Inquiry[]> {
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

  const serverSupabase = await createSupabaseServer();
  const { data: { user } } = await serverSupabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

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
  const admin = createSupabaseAdmin();
  const { count, error } = await admin
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  if (error) return 0;
  return count ?? 0;
}
