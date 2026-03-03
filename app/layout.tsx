import type { Metadata } from "next";
import { Noto_Serif_KR, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { SITE } from "@/lib/site";

// 헤딩 전용 디스플레이 세리프
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
});

// 산업용 압축 볼드 — 로고 "SL" 전용
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: SITE.seo.title,
  description: SITE.seo.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSerifKR.variable} ${bebasNeue.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}