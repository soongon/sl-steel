import Link from "next/link";
import SLSteelLogo from "@/components/logo/SLSteelLogo";
import { SITE } from "@/lib/site";

export default function BlogNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <SLSteelLogo size={28} fill="#3B82F6" gap="#ffffff" />
          <span className="font-semibold text-foreground">{SITE.brand.en}</span>
          <span className="text-border">·</span>
          <span className="text-sm text-steel">블로그</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm text-steel transition-colors hover:text-foreground sm:block"
          >
            홈페이지 →
          </Link>
          <Link
            href="/#contact"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            매입 문의
          </Link>
        </div>
      </div>
    </nav>
  );
}
