import { getShareData } from "@/lib/share";
import { parseContentForShare } from "@/lib/share-utils";
import SharePageClient from "./SharePageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "공유 콘텐츠 | SL Steel",
  robots: { index: false, follow: false },
};

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const result = await getShareData(token);

  if (result.status === "not_found") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">유효하지 않은 링크</h1>
          <p className="mt-2 text-sm text-muted">
            이 공유 링크는 존재하지 않습니다.<br />
            관리자에게 새 링크를 요청해 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">만료된 링크</h1>
          <p className="mt-2 text-sm text-muted">
            이 공유 링크는 만료되었습니다.<br />
            관리자에게 새 링크를 요청해 주세요.
          </p>
        </div>
      </div>
    );
  }

  const { post } = result;
  const parsed = parseContentForShare(post.content);

  return <SharePageClient title={post.title} parsed={parsed} />;
}
