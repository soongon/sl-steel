"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { ui, COLOR } from "@/lib/ui";
import { scrollToContact } from "@/lib/scroll";
import SLSteelLogo from "@/components/logo/SLSteelLogo";

const NAV_LINKS = [
  { label: "회사소개", href: "#about" },
  { label: "사업영역", href: "#business" },
  { label: "진행절차", href: "#process" },
  { label: "블로그", href: "/blog" },
  { label: "문의", href: "#contact" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className={`${ui.container} grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-6`}>

          {/* ── 로고 ── */}
          <a
            href="#top"
            aria-label="SL Steel 홈으로"
            className="flex shrink-0 items-center gap-3"
          >
            <SLSteelLogo
              size={36}
              fill={scrolled ? COLOR.primary600 : COLOR.primary400}
              gap={scrolled ? COLOR.white : COLOR.primary900}
            />
            <span className={`text-[1.4rem] font-black leading-none transition-colors ${scrolled ? "text-neutral-900" : "text-white"}`}>
              <span className={`font-condensed text-[1.1em] tracking-[0.06em] mr-[3px] ${scrolled ? "text-primary-600" : "text-primary-400"}`}>
                SL
              </span>
              <span className="tracking-[-0.01em]">철강</span>
            </span>
          </a>

          {/* ── 데스크톱 네비게이션 ── */}
          <nav aria-label="주요 메뉴" className="hidden items-center justify-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={[
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── 우측: CTA + 햄버거 ── */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToContact("매입 문의"); }}
              className={`${ui.btn.base} ${ui.btn.primary} ${ui.btn.sm} hidden md:inline-flex`}
            >
              매입 문의
            </a>

            {/* 햄버거 (모바일) */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
              className={`md:hidden p-2 rounded-md transition-colors ${scrolled ? "text-neutral-900" : "text-white"}`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="4" y1="4" x2="20" y2="20" />
                    <line x1="20" y1="4" x2="4" y2="20" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* ── 모바일 풀스크린 오버레이 ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-primary-900 flex flex-col md:hidden">
          {/* 상단 바 */}
          <div className="flex h-[72px] items-center justify-between px-5">
            <a href="#top" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <SLSteelLogo size={36} fill={COLOR.primary400} gap={COLOR.primary900} />
              <span className="text-[1.4rem] font-black leading-none text-white">
                <span className="font-condensed text-primary-400 text-[1.1em] tracking-[0.06em] mr-[3px]">SL</span>
                <span className="tracking-[-0.01em]">철강</span>
              </span>
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="메뉴 닫기"
              className="p-2 text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
          </div>

          {/* 메뉴 항목 */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-semibold text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 하단 CTA */}
          <div className="px-5 pb-8">
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${SITE.footer.regions[0].phone}`}
                className={`${ui.btn.base} ${ui.btn.secondary} ${ui.btn.md} w-full`}
              >
                전화 문의
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToContact("매입 문의"); }}
                className={`${ui.btn.base} ${ui.btn.primary} ${ui.btn.md} w-full`}
              >
                매입 문의
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}