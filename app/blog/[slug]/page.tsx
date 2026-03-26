import { getPost, getPosts, getCategoryCounts, getSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/blog/Sidebar";
import { SITE } from "@/lib/site";
import { mdxComponents } from "@/lib/mdx-components";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | SL Steel 블로그`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const allPosts = await getPosts();
  const categories = await getCategoryCounts(allPosts);
  const recentPosts = allPosts.slice(0, 4);
  const mainPhone = SITE.footer.regions[0].phone;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Article */}
        <article className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="relative h-64 w-full">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 780px"
                priority
              />
            </div>
          )}

          {/* Header */}
          <div className="border-b border-border px-8 py-6">
            <Link
              href="/blog"
              className="mb-3 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
            >
              ← 블로그 목록
            </Link>
            <div className="flex flex-wrap gap-1.5">
              {post.categories.map((cat) => (
                <span key={cat} className="inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="mt-2 text-xl font-bold leading-snug text-foreground sm:text-2xl">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-muted">{post.date}</p>
          </div>

          {/* Body */}
          <div className="blog-content px-8 py-6">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Post footer CTA */}
          <div className="mx-8 mb-8 rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
            <p className="text-sm font-bold text-foreground">
              궁금하신 점은 바로 문의해 주세요
            </p>
            <a
              href={`tel:${mainPhone.replace(/-/g, "")}`}
              className="mt-2 block text-lg font-extrabold tracking-tight text-accent"
            >
              {mainPhone}
            </a>
            <Link
              href="/#contact"
              className="mt-3 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              매입 문의하기
            </Link>
          </div>
        </article>

        {/* Sidebar — desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <Sidebar
              categories={categories}
              recentPosts={recentPosts}
              activeCategory={post.categories[0] ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
