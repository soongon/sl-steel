import { supabase } from "./supabase";

export interface PostMeta {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  thumbnail?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export const BLOG_CATEGORIES = [
  "전체",
  "매입 기준",
  "현장 실무",
  "업계 정보",
  "시설·인프라",
  "수거 사례",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const POSTS_PER_PAGE = 5;

function formatDate(raw: string | null): string {
  if (!raw) return "";
  return raw.slice(0, 10);
}

export async function getPosts(): Promise<PostMeta[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, category, excerpt, published_at, thumbnail_url")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    date: formatDate(row.published_at),
    thumbnail: row.thumbnail_url ?? undefined,
  }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, category, excerpt, content, published_at, thumbnail_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    excerpt: data.excerpt,
    date: formatDate(data.published_at),
    thumbnail: data.thumbnail_url ?? undefined,
    content: data.content,
  };
}

export async function getCategoryCounts(
  posts: PostMeta[]
): Promise<{ name: string; count: number }[]> {
  const counts = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] ?? 0) + 1;
    return acc;
  }, {});

  return BLOG_CATEGORIES.map((name) => ({
    name,
    count: name === "전체" ? posts.length : (counts[name] ?? 0),
  }));
}

export async function getSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error || !data) return [];
  return data.map((row) => row.slug);
}
