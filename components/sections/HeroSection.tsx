import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import HeroCarousel from "./HeroCarousel";

const POINT_ICONS = [
  // 안정적 공급
  <svg key="supply" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M2 7.5L12 3l10 4.5v9L12 21 2 16.5v-9Z" />
    <path d="M12 3v18M2 7.5l10 4.5 10-4.5" />
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
    <section id="hero" className="bg-brand-navy py-24 sm:py-32">
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
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-sm font-medium text-white/80"
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
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact?type=납품" className={ui.btn.accent}>
                {SITE.hero.cta.primary}
              </a>
              <a
                href="#contact?type=매입"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/80">
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