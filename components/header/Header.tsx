import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

const NAV_LINKS = [
  { label: "회사소개", href: "#about"    },
  { label: "사업영역", href: "#business" },
  { label: "진행절차", href: "#process"  },
  { label: "문의",     href: "#contact"  },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/85 backdrop-blur-md transition-colors">
      <div className={`${ui.container} grid h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-6`}>

        {/* ── 브랜드 ─────────────────────────────────────────────── */}
        {/* 추후 로고 이미지로 교체: 심볼 div → <Image> */}
        <a
          href="#top"
          aria-label="SL Steel 홈으로"
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 focus-visible:ring-offset-2"
        >
          {/* 심볼 placeholder */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-sm font-bold text-brand-navy">
            S
          </div>
          {/* 회사명 가로 배열 — 베이스라인 정렬 */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-brand-navy">
              <span className="text-accent">SL</span>
              {" 철강"}
            </span>
            <span className="hidden text-[0.65rem] font-light tracking-[0.2em] text-steel/50 sm:block">
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
              className="rounded-xl px-4 py-2 text-base font-medium text-foreground/75 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 focus-visible:ring-offset-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── 우측 CTA ─────────────────────────────────────────────── */}
        <a
          href="#contact"
          className={`${ui.btn.primary} h-11 px-5`}
        >
          문의하기
        </a>

      </div>
    </header>
  );
}