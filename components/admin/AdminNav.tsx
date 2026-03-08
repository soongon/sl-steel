"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import SLSteelLogo from "@/components/logo/SLSteelLogo";

export default function AdminNav() {
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
        <Link href="/admin" className="flex items-center gap-2.5">
          <SLSteelLogo size={28} fill="#3B82F6" gap="#ffffff" />
          <span className="font-semibold text-foreground">SL Steel</span>
          <span className="text-border">·</span>
          <span className="text-sm text-steel">관리자</span>
        </Link>

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
