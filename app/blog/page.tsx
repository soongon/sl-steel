import type { Metadata } from "next";
import {
  getPosts,
  getCategoryCounts,
  POSTS_PER_PAGE,
  BLOG_CATEGORIES,
  type BlogCategory,
  type PostMeta,
} from "@/lib/blog";
import { blogListPath } from "@/lib/blog-url";
import BlogHeader from "@/components/blog/BlogHeader";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import Pagination from "@/components/blog/Pagination";
import Link from "next/link";
import { SITE } from "@/lib/site";

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}

/** searchParams 정규화 — 모르는 카테고리는 "전체", 페이지는 1 이상 정수. generateMetadata 와 본문이 같은 값을 쓴다. */
function parseBlogParams(raw: { category?: string; page?: string }) {
  const page = Math.max(1, parseInt(raw.page ?? "1") || 1);
  const category: BlogCategory =
    raw.category && isBlogCategory(raw.category) ? raw.category : "전체";
  return { category, page };
}

function filterByCategory(posts: PostMeta[], category: BlogCategory) {
  return category === "전체"
    ? posts
    : posts.filter((p) => p.categories.includes(category));
}

/** 카테고리·페이지별 제목과 canonical — 기본값(전체·1페이지)은 /blog 로 정규화해 중복 URL 을 막는다. */
export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { category, page } = parseBlogParams(await searchParams);

  const filtered = filterByCategory(await getPosts(), category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));

  if (page > totalPages) {
    // 범위를 벗어난 페이지(빈 목록) — 색인하지 않고 canonical 은 해당 목록 1페이지로
    return {
      robots: { index: false, follow: true },
      alternates: { canonical: blogListPath(category, 1) },
    };
  }

  const titleParts = [
    category !== "전체" ? category : null,
    page > 1 ? `${page}페이지` : null,
  ].filter(Boolean);

  return {
    // 기본 목록은 layout 의 title 을 그대로 쓰도록 키를 아예 넣지 않는다.
    ...(titleParts.length
      ? { title: `${titleParts.join(" · ")} | 신라철강 블로그` }
      : {}),
    alternates: { canonical: blogListPath(category, page) },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // generateMetadata 와 같은 정규화 — canonical 이 가리키는 목록과 실제 본문이 항상 일치
  const { category, page } = parseBlogParams(await searchParams);

  const allPosts = await getPosts();
  const categories = await getCategoryCounts(allPosts);

  const filtered = filterByCategory(allPosts, category);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const pagePosts = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );
  const recentPosts = allPosts.slice(0, 4);

  const [featured, ...rest] = pagePosts;
  const showFeatured = page === 1 && category === "전체";

  return (
    <>
      <BlogHeader categories={categories} activeCategory={category} />

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Post list */}
          <div className="flex flex-col gap-3">
            {featured && <PostCard post={featured} featured={showFeatured} />}
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}

            {filtered.length === 0 && (
              <div className="rounded-xl border border-border bg-card py-16 text-center text-sm text-muted">
                포스트가 없습니다.
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              category={category}
            />
          </div>

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Sidebar
                categories={categories}
                recentPosts={recentPosts}
                activeCategory={category}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="border-t border-border bg-card px-6 py-6 lg:hidden">
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
          <p className="text-sm font-bold text-foreground">
            현장에 남은 철근, 바로 문의하세요
          </p>
          <a
            href={`tel:${SITE.footer.regions[0].phone.replace(/-/g, "")}`}
            className="mt-2 block text-lg font-extrabold tracking-tight text-accent"
          >
            {SITE.footer.regions[0].phone}
          </a>
          <Link
            href="/#contact"
            className="mt-3 inline-block rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            매입 문의하기
          </Link>
        </div>
      </div>
    </>
  );
}
