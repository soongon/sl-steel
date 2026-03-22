"use client";

import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import { scrollToContact } from "@/lib/scroll";
import HeroCarousel from "./HeroCarousel";

const POINT_ICONS = [
  // 매입 (가격 태그)
  <svg key="tag" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>,
  // 가치 회수
  <svg key="recycle" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>,
  // 자체 물류
  <svg key="truck" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>,
];

export default function HeroSection() {
  const subLines = SITE.hero.subcopy.split("\n");

  return (
    <section id="hero" className="bg-brand-navy pt-20 pb-24 sm:pt-24 sm:pb-32">
      <div className={ui.container}>

        {/* ── 메인 2열 그리드 ─────────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-[65fr_35fr] lg:items-stretch">

          {/* 좌측: 텍스트 */}
          <div>
            {/* 시설 배지 */}
            <div className={ui.badgeRow}>
              {SITE.hero.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-sm font-medium text-accent/80"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* H1 */}
            <h1 className={`mt-6 ${ui.h1Hero}`}>
              {SITE.hero.h1}
            </h1>

            {/* 서브카피 */}
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              {subLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < subLines.length - 1 && <br />}
                </span>
              ))}
            </p>

            {/* CTA 버튼 */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(SITE.hero.cta.primary); }}
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition-all duration-200 hover:bg-accent-dark hover:-translate-y-1 hover:shadow-[0_8px_32px_rgb(59_130_246/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {SITE.hero.cta.primary}
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(SITE.hero.cta.secondary); }}
                className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-white/30 text-base font-bold text-white transition-all duration-200 hover:bg-white/20 hover:border-white/60 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgb(255_255_255/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              >
                {SITE.hero.cta.secondary}
              </a>
            </div>
          </div>

          {/* 우측: 캐로셀 */}
          <HeroCarousel />

        </div>

        {/* ── 핵심 강점 스트립 ─────────────────────────────────────── */}
        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {SITE.points.map((point, i) => (
            <div key={point.title} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                {POINT_ICONS[i] ?? null}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}