import type { Metadata } from "next";
import MobilePostForm from "@/components/admin/MobilePostForm";

export const metadata: Metadata = {
  title: "모바일 포스팅 | 신라철강 관리자",
  robots: { index: false },
};

// Claude API 호출(사진 분석 + 글 생성)이 수십 초 걸리므로 함수 실행 한도를 늘린다
export const maxDuration = 60;

export default function MobilePostPage() {
  return (
    <div className="mx-auto max-w-[430px] px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-foreground">모바일 포스팅</h1>
      <p className="mb-5 text-sm text-steel">사진 올리고 현장명만 넣으면 글이 자동 발행됩니다</p>
      <MobilePostForm />
    </div>
  );
}
