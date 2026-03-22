"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

type TabIndex = 0 | 1;

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
        <span className={ui.label}>Process</span>
        <h2 className={ui.title}>진행 절차</h2>

        {/* 탭 버튼 */}
        <div className="mt-8 inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-1">
          {SITE.process.tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i as TabIndex)}
              className={[
                "rounded-md px-6 py-2.5 text-sm font-semibold transition-colors",
                active === i
                  ? "bg-primary-900 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-900",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 스텝 카드 */}
        <div className={`${ui.card} mt-6 p-8`}>

          {/* PC: 가로 타임라인 */}
          <div className="relative hidden sm:block">
            <div className="absolute top-5 left-[calc(10%)] right-[calc(10%)] h-px bg-neutral-200" />
            <div className="relative grid grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-900 text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <span className="mt-4 text-base font-bold text-primary-900 leading-snug">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 모바일: 세로 타임라인 */}
          <div className="relative sm:hidden">
            <div className="absolute left-[18px] top-5 bottom-5 w-px bg-neutral-200" />
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step} className="relative flex items-center gap-5 pl-1">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-900 text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <span className="text-base font-bold text-primary-900">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}