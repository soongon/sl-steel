"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";
export default function ProcessSection() {
  const [active, setActive] = useState<0 | 1>(0);
  const process = active === 0 ? SITE.process.recovery : SITE.process.delivery;
  return (
    <section id="process" className="silla-section silla-process">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">HOW WE WORK</span>
            <h2>문의부터 현장까지, 명확하게.</h2>
          </div>
          <div
            className="silla-process-switch"
            role="group"
            aria-label="진행 절차 선택"
          >
            {SITE.process.tabs.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(i as 0 | 1)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="silla-process-guide">{process.guide}</p>
        <ol
          className="silla-process-steps"
          aria-live="polite"
          aria-label={SITE.process.tabs[active]}
        >
          {process.steps.map((step, i) => (
            <li key={step.title}>
              <span className="silla-step-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
