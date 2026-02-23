import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

const ICONS = [
  // 안정적 공급 — 창고/박스 스택
  <svg key="supply" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M2 7.5L12 3l10 4.5v9L12 21 2 16.5v-9Z" />
    <path d="M12 3v18M2 7.5l10 4.5 10-4.5" />
  </svg>,

  // 가치 회수 — 순환 화살표
  <svg key="recycle" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>,

  // 자체 물류 — 트럭
  <svg key="truck" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>,
];

export default function KeyPointsSection() {
  return (
    <section id="points" className={ui.sectionAlt}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Core Value</p>
        <h2 className={ui.h2Display}>SL Steel의 핵심 강점</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITE.points.map((point, i) => (
            <div
              key={point.title}
              className={`${ui.card} ${ui.cardPad} transition-shadow hover:shadow-lift`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-accent">
                  {ICONS[i] ?? null}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {point.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}