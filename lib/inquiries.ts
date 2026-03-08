"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { createSupabaseAdmin, createSupabaseServer } from "./supabase-server";

export interface Inquiry {
  id: string;
  inquiry_type: string;
  name: string;
  phone: string;
  location: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ── 공개: 문의 제출 ─────────────────────────────────────────────────

export async function submitInquiry(formData: FormData) {
  const inquiry_type = formData.get("inquiry_type") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const location = (formData.get("location") as string) || "";
  const message = (formData.get("message") as string) || "";

  if (!inquiry_type || !name || !phone) {
    throw new Error("필수 항목을 입력해 주세요.");
  }

  const { error } = await supabase.from("inquiries").insert({
    inquiry_type,
    name,
    phone,
    location,
    message,
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
  const serverSupabase = await createSupabaseServer();
  const { data: { user } } = await serverSupabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

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
