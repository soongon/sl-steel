import { getPost, getPosts, getCategoryCounts, getSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/blog/Sidebar";
import { SITE, SITE_URL } from "@/lib/site";
import { mdxComponents } from "@/lib/mdx-components";
import { isPurchasePost } from "@/lib/purchase-post";
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
  const url = `${SITE_URL}/blog/${slug}`;
  // openGraph·twitter 는 루트 객체를 통째로 대체한다 — 홈 제목·이미지가 새지 않도록 글 값으로 모두 채운다.
  // 썸네일이 없을 때만 사이트 대표 이미지로 대신한다(현재 공개 글은 전부 썸네일 보유).
  const images = post.thumbnail
    ? [{ url: post.thumbnail, alt: post.title }]
    : [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE.brand.ko }];
  return {
    title: `${post.title} | 신라철강 블로그`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.brand.ko,
      locale: "ko_KR",
      title: post.title,
      description: post.excerpt,
      images,
      publishedTime: post.publishedAt,
      ...(post.categories.length ? { tags: post.categories } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: images.map((i) => i.url),
    },
  };
}

/** BlogPosting 구조화 데이터 — 화면에 보이는 글 데이터만 쓴다. 저자 필드가 없어 작성 주체(신라철강)를 저자로 둔다. */
function articleJsonLd(post: NonNullable<Awaited<ReturnType<typeof getPost>>>) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const org = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`, // 루트 LocalBusiness 와 같은 엔티티
    name: SITE.brand.ko,
    url: SITE_URL,
  };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    // dateModified 는 넣지 않는다 — posts.updated_at 이 공유 토큰 갱신 등 비콘텐츠 변경에도 바뀜(sitemap.ts lastmod 와 같은 정책)
    ...(post.thumbnail ? { image: [post.thumbnail] } : {}),
    author: org,
    publisher: {
      ...org,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/profile-512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "ko-KR",
    ...(post.categories.length ? { articleSection: post.categories[0] } : {}),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // 제목·요약에 </script> 가 들어가도 태그가 깨지지 않도록 < 를 이스케이프
          __html: JSON.stringify(articleJsonLd(post)).replace(/</g, "\\u003c"),
        }}
      />
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
                <span
                  key={cat}
                  className="inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent"
                >
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
            {/* 매입 관련 글(카테고리 + 납품 신호 판정)에만 매입 안내 페이지 링크 — 본문·DB 는 건드리지 않는다 */}
            {isPurchasePost(post) && (
              <p className="mt-4 text-sm text-steel">
                <Link
                  href="/used-rebar"
                  className="font-semibold text-accent underline underline-offset-4 hover:text-accent-dark"
                >
                  중고철근·잉여철근 매입 기준과 사례 보기{"\u00a0"}→
                </Link>
              </p>
            )}
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
