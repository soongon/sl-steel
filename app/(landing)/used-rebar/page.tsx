import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import {
  UsedRebarHero,
  PurchaseTargets,
  PurchaseCriteria,
  PurchaseProcess,
  PurchaseCases,
  UsedRebarFaq,
} from "@/components/sections/UsedRebarSections";
import { getPosts } from "@/lib/blog";
import { SITE, SITE_URL } from "@/lib/site";
import { USED_REBAR } from "@/lib/used-rebar";

const PAGE_URL = `${SITE_URL}${USED_REBAR.path}`;

export const metadata: Metadata = {
  title: USED_REBAR.seo.title,
  description: USED_REBAR.seo.description,
  alternates: { canonical: USED_REBAR.path },
  openGraph: {
    title: USED_REBAR.seo.title,
    description: USED_REBAR.seo.description,
    url: PAGE_URL,
    type: "website",
    siteName: SITE.brand.ko,
    // 페이지에서 openGraph/twitter 를 정의하면 루트의 객체를 통째로 대체하므로 이미지도 다시 넣는다
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "신라철강 — 중고철근·잉여철근 매입",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: USED_REBAR.seo.title,
    description: USED_REBAR.seo.description,
    images: ["/og-image.png"],
  },
};

// FAQ 섹션에 보이는 질문·답변과 1:1 — 화면에 없는 내용은 넣지 않는다.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: USED_REBAR.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default async function UsedRebarPage() {
  // 매입 사례는 블로그 DB 에서 읽기만 한다 — 비공개 글은 자동으로 빠진다.
  const allPosts = await getPosts();
  const order = USED_REBAR.cases.slugs as readonly string[];
  const cases = order
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <UsedRebarHero />
      <PurchaseTargets />
      <PurchaseCriteria />
      <PurchaseProcess />
      <PurchaseCases posts={cases} />
      <UsedRebarFaq />
      <ContactSection />
    </main>
  );
}
