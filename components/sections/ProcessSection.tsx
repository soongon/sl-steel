"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";
const descriptions = [
  ["철근 수량과 현장 위치를 알려주세요.", "규격과 길이, 철근 상태를 확인합니다.", "확인한 자재를 기준으로 매입가를 안내합니다.", "일정을 협의하고 현장에서 수거합니다.", "수거한 물량과 거래 내용을 확인해 정산합니다."],
  ["필요한 규격과 수량을 알려주세요.", "견적과 납품 가능 일정을 안내합니다.", "주문한 자재를 확인하고 출고합니다.", "협의한 일정에 맞춰 현장에 납품합니다.", "납품 후 확인 사항과 추가 문의를 안내합니다."],
];
export default function ProcessSection() {
  const [active, setActive] = useState<0 | 1>(0);
  const steps =
    active === 0 ? SITE.process.recovery.steps : SITE.process.delivery.steps;
  return (
    <section id="process" className="silla-section silla-process">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">HOW WE WORK</span>
            <h2>문의부터 현장까지, 명확하게.</h2>
          </div>
          <div className="silla-process-switch" role="group" aria-label="진행 절차 선택">
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
        <p className="silla-process-guide">{active === 0 ? "남은 철근의 매입, 이렇게 진행합니다." : "필요한 자재의 납품, 이렇게 진행합니다."}</p>
        <ol className="silla-process-steps" aria-live="polite" aria-label={SITE.process.tabs[active]}>
          {steps.map((step, i) => (
            <li key={step}>
              <span className="silla-step-number">0{i + 1}</span>
              <div><h3>{step}</h3><p>{descriptions[active][i]}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
