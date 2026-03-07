import { getPosts, getCategoryCounts, POSTS_PER_PAGE } from "@/lib/blog";
import BlogHeader from "@/components/blog/BlogHeader";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import Pagination from "@/components/blog/Pagination";
import Link from "next/link";
import { SITE } from "@/lib/site";

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category = "전체", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr) || 1);

  const allPosts = await getPosts();
  const categories = await getCategoryCounts(allPosts);

  const filtered =
    category === "전체"
      ? allPosts
      : allPosts.filter((p) => p.category === category);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const pagePosts = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
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
            {featured && (
              <PostCard post={featured} featured={showFeatured} />
            )}
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
