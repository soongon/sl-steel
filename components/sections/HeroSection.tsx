"use client";

import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import { scrollToContact } from "@/lib/scroll";
import HeroCarousel from "./HeroCarousel";

export default function HeroSection() {
  const subLines = SITE.hero.subcopy.split("\n");

  return (
    <section id="hero" className="relative bg-primary-900 pt-20 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className={`${ui.container} relative`}>
        <div className="grid gap-10 lg:grid-cols-[60fr_40fr] lg:items-stretch">

          {/* 좌측: 텍스트 */}
          <div>
            {/* 배지 */}
            <div className="flex flex-wrap gap-2">
              {SITE.hero.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-primary-400/30 bg-primary-400/10 px-3.5 py-1 text-sm font-medium text-primary-200"
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
            <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
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
                className={`${ui.btn.base} ${ui.btn.primary} ${ui.btn.lg} w-full`}
              >
                {SITE.hero.cta.primary}
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(SITE.hero.cta.secondary); }}
                className={`${ui.btn.base} ${ui.btn.outline} ${ui.btn.lg} w-full`}
              >
                {SITE.hero.cta.secondary}
              </a>
            </div>
          </div>

          {/* 우측: 캐로셀 */}
          <HeroCarousel />
        </div>

        {/* 핵심 강점 스트립 */}
        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {SITE.points.map((point) => (
            <div key={point.title} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary-400/20 bg-primary-400/10 text-primary-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="m9 12 2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-white">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}