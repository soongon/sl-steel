"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createSupabaseAdmin, createSupabaseServer } from "./supabase-server";
import { VALID_POST_STATUSES, type PostStatus } from "./types";
import { createShareDraft } from "./gmail";

// ── 타입 ──────────────────────────────────────────────────────────────

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  share_token: string | null;
  share_expires_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
}

interface PostData {
  title: string;
  slug: string;
  categories: string[];
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  status: PostStatus;
  published_at: string | null;
}

// ── 인증 헬퍼 ─────────────────────────────────────────────────────────

async function requireAuth() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  return user;
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
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
  }
}

/** FormData → PostData 검증 및 변환 */
function parsePostData(formData: FormData): PostData {
  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");
  validateSlug(slug);
  const categories = parseCategories(formData);
  const excerpt = requireString(formData, "excerpt");
  const content = requireString(formData, "content");
  const thumbnailUrl = optionalString(formData, "thumbnail_url") || null;
  const status = requireString(formData, "status");
  if (!VALID_POST_STATUSES.includes(status as PostStatus)) {
    throw new Error("상태값은 draft 또는 published만 가능합니다.");
  }
  const publishedAt = status === "published"
    ? optionalString(formData, "published_at") || new Date().toISOString()
    : null;

  return { title, slug, categories, excerpt, content, thumbnail_url: thumbnailUrl, status: status as PostStatus, published_at: publishedAt };
}

const POST_COLUMNS = "id, slug, title, categories, excerpt, content, thumbnail_url, status, published_at, created_at, share_token, share_expires_at";

// ── 조회 ──────────────────────────────────────────────────────────────

export async function getAdminPosts(): Promise<AdminPost[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("posts")
    .select(POST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("categories")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data;
}

// ── 생성 ──────────────────────────────────────────────────────────────

export async function createPost(formData: FormData): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const admin = createSupabaseAdmin();
    const data = parsePostData(formData);

    // slug 중복 확인
    const { data: existing } = await admin
      .from("posts")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();

    if (existing) {
      return { error: `슬러그 "${data.slug}"가 이미 존재합니다.` };
    }

    const { error } = await admin.from("posts").insert(data);
    if (error) {
      console.error("Post creation error:", error.message);
      return { error: "글 저장에 실패했습니다. 다시 시도해 주세요." };
    }

    revalidatePath("/blog");
    revalidatePath("/admin");
    return {};
  } catch (err) {
    console.error("createPost error:", err);
    return { error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." };
  }
}

// ── 수정 ──────────────────────────────────────────────────────────────

export async function updatePost(id: string, formData: FormData): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const admin = createSupabaseAdmin();
    const data = parsePostData(formData);

    // slug 중복 확인 (자기 자신 제외)
    const { data: existing } = await admin
      .from("posts")
      .select("id")
      .eq("slug", data.slug)
      .neq("id", id)
      .maybeSingle();

    if (existing) {
      return { error: `슬러그 "${data.slug}"가 이미 존재합니다.` };
    }

    const { error } = await admin.from("posts").update(data).eq("id", id);
    if (error) {
      console.error("Post update error:", error.message);
      return { error: "글 수정에 실패했습니다. 다시 시도해 주세요." };
    }

    revalidatePath("/blog");
    revalidatePath("/admin");
    return {};
  } catch (err) {
    console.error("updatePost error:", err);
    return { error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." };
  }
}

// ── 삭제 ──────────────────────────────────────────────────────────────

export async function deletePost(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const admin = createSupabaseAdmin();
    const { error } = await admin.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Post deletion error:", error.message);
      return { error: "글 삭제에 실패했습니다. 다시 시도해 주세요." };
    }

    revalidatePath("/blog");
    revalidatePath("/admin");
    return {};
  } catch (err) {
    console.error("deletePost error:", err);
    return { error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." };
  }
}

// ── 공유 링크 ─────────────────────────────────────────────────────────

async function getShareUrl(token: string): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}/share/${token}`;
}

async function createDraftForPost(postId: string, shareUrl: string): Promise<boolean> {
  const admin = createSupabaseAdmin();
  const { data: post } = await admin
    .from("posts")
    .select("title")
    .eq("id", postId)
    .single();

  if (!post?.title) return false;

  try {
    const draftId = await createShareDraft({ title: post.title, shareUrl });
    return !!draftId;
  } catch (err) {
    console.error("Gmail draft creation failed:", err);
    return false;
  }
}

export async function generateShareToken(postId: string): Promise<{ token: string; expiresAt: string; draftCreated: boolean }> {
  await requireAuth();
  const admin = createSupabaseAdmin();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await admin
    .from("posts")
    .update({ share_token: token, share_expires_at: expiresAt })
    .eq("id", postId);

  if (error) {
    console.error("Share token generation error:", error.message);
    throw new Error("공유 링크 생성에 실패했습니다.");
  }

  const shareUrl = await getShareUrl(token);
  const draftCreated = await createDraftForPost(postId, shareUrl);

  revalidatePath("/admin");
  return { token, expiresAt, draftCreated };
}

export async function sendShareDraft(postId: string, shareUrl: string): Promise<{ draftCreated: boolean }> {
  try {
    await requireAuth();
    const draftCreated = await createDraftForPost(postId, shareUrl);
    return { draftCreated };
  } catch {
    return { draftCreated: false };
  }
}
