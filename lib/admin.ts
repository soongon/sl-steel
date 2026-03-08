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

  const status = formData.get("status") as string;
  const publishedAt = status === "published"
    ? (formData.get("published_at") as string) || new Date().toISOString()
    : null;

  const { error } = await admin.from("posts").insert({
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    categories: JSON.parse(formData.get("categories") as string),
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    status,
    published_at: publishedAt,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin");
}

// ── 수정 ──────────────────────────────────────────────────────────────

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createSupabaseAdmin();

  const status = formData.get("status") as string;
  const publishedAt = status === "published"
    ? (formData.get("published_at") as string) || new Date().toISOString()
    : null;

  const { error } = await admin
    .from("posts")
    .update({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      categories: JSON.parse(formData.get("categories") as string),
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

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

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin");
}
