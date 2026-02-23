import Image from "next/image";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

// badges 순서와 동일 (창고 / 야적장 / 트럭)
const SPEC_ICONS = [
  <svg key="warehouse" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
    <path d="M3 9.5V21h18V9.5" />
    <path d="M1 10l11-7 11 7" />
    <path d="M9 21V12h6v9" />
  </svg>,
  <svg key="yard" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18" />
  </svg>,
  <svg key="truck" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>,
];

export default function AboutSection() {
  const bodyLines = SITE.about.body.split("\n");

  return (
    <section id="about" className={ui.section}>
      <div className={ui.container}>
        <div className="grid gap-10 lg:grid-cols-[38fr_62fr] lg:items-center">

          {/* ── 좌측: 현장 이미지 ──────────────────────────────── */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80"
              alt="SL Steel 철강 유통 현장"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 38vw"
            />
          </div>

          {/* ── 우측: 텍스트 ────────────────────────────────────── */}
          <div>
            <p className={ui.eyebrow}>About</p>
            <h2 className={ui.h2Display}>{SITE.about.title}</h2>

            <p className="mt-4 text-base leading-relaxed text-muted break-keep">
              {bodyLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < bodyLines.length - 1 && <br />}
                </span>
              ))}
            </p>

            {/* 시설 스펙 리스트 — 배열 범위 초과 방어 */}
            <ul className="mt-6 grid gap-3">
              {SITE.hero.badges.map((badge, i) => (
                <li key={badge} className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent">
                    {SPEC_ICONS[i] ?? null}
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}