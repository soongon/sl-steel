"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import SLSteelLogo from "@/components/logo/SLSteelLogo";

interface Props {
  newInquiryCount?: number;
}

export default function AdminNav({ newInquiryCount = 0 }: Props) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <SLSteelLogo size={28} fill="#3B82F6" gap="#ffffff" />
            <span className="font-semibold text-foreground">SL Steel</span>
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-steel transition-colors hover:bg-surface hover:text-foreground"
          >
            블로그 관리
          </Link>
          <Link
            href="/admin/inquiries"
            className="relative rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-steel transition-colors hover:bg-surface hover:text-foreground"
          >
            문의 관리
            {newInquiryCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {newInquiryCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/quick-post"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            빠른 등록
          </Link>
          <Link
            href="/blog"
            className="hidden text-sm text-steel transition-colors hover:text-foreground sm:block"
          >
            블로그 →
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-steel transition-colors hover:bg-surface hover:text-foreground"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
