import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

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

export function getPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: (data.title as string) ?? "",
        category: (data.category as string) ?? "기타",
        excerpt: (data.excerpt as string) ?? "",
        date: (data.date as string) ?? "",
        thumbnail: data.thumbnail as string | undefined,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const filepath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!filepath) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title as string) ?? "",
    category: (data.category as string) ?? "기타",
    excerpt: (data.excerpt as string) ?? "",
    date: (data.date as string) ?? "",
    thumbnail: data.thumbnail as string | undefined,
    content,
  };
}

export function getCategoryCounts(
  posts: PostMeta[]
): { name: string; count: number }[] {
  const counts = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] ?? 0) + 1;
    return acc;
  }, {});

  return BLOG_CATEGORIES.map((name) => ({
    name,
    count: name === "전체" ? posts.length : (counts[name] ?? 0),
  }));
}
