"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

type TabIndex = 0 | 1;

// tabs[0] = 매입 프로세스, tabs[1] = 납품 프로세스
const STEPS = [
  SITE.process.recovery.steps,
  SITE.process.delivery.steps,
] as const;

export default function ProcessSection() {
  const [active, setActive] = useState<TabIndex>(0);
  const steps = STEPS[active];

  return (
    <section id="process" className={ui.sectionAlt}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Process</p>
        <h2 className={ui.h2Display}>진행 절차</h2>

        {/* ── 탭 버튼 ──────────────────────────────────────────────── */}
        <div className="mt-8 inline-flex rounded-xl border border-border bg-surface p-1">
          {SITE.process.tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i as TabIndex)}
              className={[
                "rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
                active === i
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── 스텝 카드 ─────────────────────────────────────────────── */}
        <div className={`${ui.card} mt-6 p-8`}>

          {/* PC: 가로 타임라인 */}
          <div className="relative hidden sm:block">
            {/* 연결선 — 첫 번째·마지막 circle 중심을 잇도록 left/right를 circle 반폭만큼 안으로 */}
            <div className="absolute top-5 left-[calc(10%)] right-[calc(10%)] h-px bg-border" />

            <div className="relative grid grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <div key={step} className="flex flex-col items-center text-center">
                  {/* 번호 원 — ring으로 라인 위에 떠보이는 효과 */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white ring-4 ring-card">
                    {i + 1}
                  </span>
                  <span className="mt-4 text-base font-bold text-brand-navy leading-snug">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 모바일: 세로 타임라인 */}
          <div className="relative sm:hidden">
            {/* 세로 연결선 */}
            <div className="absolute left-[18px] top-5 bottom-5 w-px bg-border" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step} className="relative flex items-center gap-5 pl-1">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white ring-4 ring-card">
                    {i + 1}
                  </span>
                  <span className="text-base font-bold text-brand-navy">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}