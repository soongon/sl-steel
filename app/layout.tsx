import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { SITE } from "@/lib/site";

// 헤딩 전용 디스플레이 폰트 — 본문(Pretendard)과 분리해 신뢰감·임팩트 부여
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false, // 한국어 폰트 용량이 크므로 preload 비활성화
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
      <body className={notoSerifKR.variable}>
        <Header />
        {/* pt-16: 고정 헤더 높이 보정 — 헤더 높이 변경 시 함께 조정 */}
        {children}
        <Footer />
      </body>
    </html>
  );
}