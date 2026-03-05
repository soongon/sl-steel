import type { Metadata } from "next";
import BlogNav from "@/components/blog/BlogNav";

export const metadata: Metadata = {
  title: "SL Steel 블로그 | 철근 매입·납품 실무 정보",
  description:
    "건설 현장 철근 매입·납품 실무 정보. 매입 기준, 현장 준비사항, 시세 정보를 정리합니다.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <BlogNav />
      {children}
      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} SL Steel. All rights reserved.
      </footer>
    </div>
  );
}
