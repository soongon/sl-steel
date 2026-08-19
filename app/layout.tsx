import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

// 헤딩 전용 디스플레이 세리프
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
});

const BASE_URL = "https://sl-steel.co.kr";

// 검색엔진용 구조화 데이터 (LocalBusiness)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.brand.ko,
  alternateName: SITE.brand.en,
  description: SITE.seo.description,
  url: BASE_URL,
  logo: `${BASE_URL}/brand/logo-symbol.svg`,
  image: `${BASE_URL}/og-image.png`,
  telephone: SITE.footer.regions[0].phone.replace(/^0/, "+82-"),
  email: SITE.footer.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.footer.address.street,
    addressLocality: SITE.footer.address.locality,
    addressRegion: SITE.footer.address.region,
    addressCountry: "KR",
  },
  areaServed: ["경상권", "전라권", "경기·강원", "충청권"],
  sameAs: [SITE.footer.naverPlace],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE.seo.title,
  description: SITE.seo.description,
  openGraph: {
    siteName: SITE.brand.ko,
    title: SITE.seo.title,
    description: SITE.seo.description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "신라철강 — 철근·H빔 납품, 잔여 철근 매입·수거" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seo.title,
    description: SITE.seo.description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={notoSerifKR.variable}>
        {children}
      </body>
    </html>
  );
}