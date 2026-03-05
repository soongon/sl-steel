import { SITE } from "@/lib/site";
import SLSteelLogo from "@/components/logo/SLSteelLogo";

const NAV_LINKS = [
  { label: "회사소개", href: "#about"    },
  { label: "사업영역", href: "#business" },
  { label: "진행절차", href: "#process"  },
  { label: "블로그",   href: "/blog"     },
  { label: "문의",     href: "#contact"  },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-navy border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 grid h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-6">

        {/* ── 브랜드 ─────────────────────────────────────────────── */}
        <a
          href="#top"
          aria-label="SL Steel 홈으로"
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
        >
          <SLSteelLogo size={38} fill="#3B82F6" gap="#0F172A" />
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-[1.55rem] font-black leading-none text-white">
              <span className="font-condensed text-accent text-[1.1em] tracking-[0.06em] mr-[3px]">SL</span>
              <span className="tracking-[-0.01em]">철강</span>
            </span>
            <span className="hidden font-sans text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/25 sm:block">
              {SITE.brand.en}
            </span>
          </div>
        </a>

        {/* ── 중앙 내비게이션 (데스크톱만) ────────────────────────── */}
        <nav
          aria-label="주요 메뉴"
          className="hidden items-center justify-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-brand-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── 우측 CTA ─────────────────────────────────────────────── */}
        <a
          href="#contact"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white transition-all duration-200 hover:bg-accent-dark hover:shadow-[0_4px_16px_rgb(59_130_246/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
        >
          매입 문의
        </a>

      </div>
    </header>
  );
}
