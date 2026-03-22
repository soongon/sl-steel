"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin, createSupabaseServer } from "./supabase-server";

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
}

// ── 유효성 검사 헬퍼 ─────────────────────────────────────────────────

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`필수 항목이 누락되었습니다: ${key}`);
  }
  return value.trim();
}

function optionalString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim();
}

function parseCategories(formData: FormData): string[] {
  const raw = formData.get("categories");
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("카테고리를 선택해 주세요.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("카테고리 형식이 올바르지 않습니다.");
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("카테고리를 하나 이상 선택해 주세요.");
  }
  return parsed as string[];
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateSlug(slug: string): void {
  if (!slug) {
    throw new Error("슬러그를 입력해 주세요.");
  }
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
  }
}

// ── 조회 ──────────────────────────────────────────────────────────────

export async function getAdminPosts(): Promise<AdminPost[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, categories, excerpt, content, thumbnail_url, status, published_at, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, categories, excerpt, content, thumbnail_url, status, published_at, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data;
}

// ── 생성 ──────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createSupabaseAdmin();

  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");
  validateSlug(slug);
  const categories = parseCategories(formData);
  const excerpt = requireString(formData, "excerpt");
  const content = requireString(formData, "content");
  const thumbnailUrl = optionalString(formData, "thumbnail_url") || null;
  const status = requireString(formData, "status");
  const publishedAt = status === "published"
    ? optionalString(formData, "published_at") || new Date().toISOString()
    : null;

  // slug 중복 확인
  const { data: existing } = await admin
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    throw new Error(`슬러그 "${slug}"가 이미 존재합니다.`);
  }

  const { error } = await admin.from("posts").insert({
    title,
    slug,
    categories,
    excerpt,
    content,
    thumbnail_url: thumbnailUrl,
    status,
    published_at: publishedAt,
  });

  if (error) {
    console.error("Post creation error:", error.message);
    throw new Error("글 저장에 실패했습니다. 다시 시도해 주세요.");
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
}

// ── 수정 ──────────────────────────────────────────────────────────────

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createSupabaseAdmin();

  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");
  validateSlug(slug);
  const categories = parseCategories(formData);
  const excerpt = requireString(formData, "excerpt");
  const content = requireString(formData, "content");
  const thumbnailUrl = optionalString(formData, "thumbnail_url") || null;
  const status = requireString(formData, "status");
  const publishedAt = status === "published"
    ? optionalString(formData, "published_at") || new Date().toISOString()
    : null;

  // slug 중복 확인 (자기 자신 제외)
  const { data: existing } = await admin
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    throw new Error(`슬러그 "${slug}"가 이미 존재합니다.`);
  }

  const { error } = await admin
    .from("posts")
    .update({
      title,
      slug,
      categories,
      excerpt,
      content,
      thumbnail_url: thumbnailUrl,
      status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("Post update error:", error.message);
    throw new Error("글 수정에 실패했습니다. 다시 시도해 주세요.");
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
}

// ── 삭제 ──────────────────────────────────────────────────────────────

export async function deletePost(id: string) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Post deletion error:", error.message);
    throw new Error("글 삭제에 실패했습니다. 다시 시도해 주세요.");
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
}
