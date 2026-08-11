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

export const metadata: Metadata = {
  metadataBase: new URL("https://sl-steel.co.kr"),
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
      </head>
      <body className={notoSerifKR.variable}>
        {children}
      </body>
    </html>
  );
}