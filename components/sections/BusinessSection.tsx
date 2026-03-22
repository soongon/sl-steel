"use client";

import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import { scrollToContact } from "@/lib/scroll";

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-600">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function BusinessSection() {
  const { delivery, recovery } = SITE.business;

  return (
    <section id="business" className={ui.section}>
      <div className={ui.container}>
        <span className={ui.label}>Business</span>
        <h2 className={ui.title}>사업 영역</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          {/* 매입 카드 — 상단 accent 라인 */}
          <div className={`${ui.card} ${ui.cardPad} flex flex-col border-t-[3px] border-t-accent-600 transition-shadow hover:shadow-lift`}>
            <div className="flex-1">
              <span className="inline-flex h-7 items-center rounded-sm bg-accent-50 px-2.5 text-xs font-semibold text-accent-600">
                매입 · 주력
              </span>
              <h3 className="mt-3 text-xl font-semibold text-neutral-900">
                {recovery.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">{recovery.lead}</p>

              {/* 대상/제외 표 */}
              <div className="mt-5 overflow-hidden rounded-lg border border-neutral-200">
                <div className="flex text-sm">
                  <span className="w-16 shrink-0 bg-neutral-50 px-4 py-3 font-medium text-neutral-900">대상</span>
                  <span className="flex-1 border-l border-neutral-200 bg-white px-4 py-3 text-neutral-600">{recovery.table.target}</span>
                </div>
                <div className="flex border-t border-neutral-200 text-sm">
                  <span className="w-16 shrink-0 bg-neutral-50 px-4 py-3 font-medium text-neutral-900">제외</span>
                  <span className="flex-1 border-l border-neutral-200 bg-white px-4 py-3 text-neutral-600">{recovery.table.exclude}</span>
                </div>
              </div>

              <BulletList items={recovery.bullets} />

              <p className="mt-4 border-l-2 border-neutral-200 pl-3 text-xs text-neutral-400">
                {recovery.notice}
              </p>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(recovery.cta); }}
                className={`${ui.btn.base} ${ui.btn.primary} ${ui.btn.md} w-full`}
              >
                {recovery.cta}
              </a>
            </div>
          </div>

          {/* 납품 카드 — 상단 primary 라인 */}
          <div className={`${ui.card} ${ui.cardPad} flex flex-col border-t-[3px] border-t-primary-600 transition-shadow hover:shadow-lift`}>
            <div className="flex-1">
              <span className={ui.chip}>납품 · 보조</span>
              <h3 className="mt-3 text-xl font-semibold text-neutral-900">
                {delivery.title}
              </h3>
              <BulletList items={delivery.bullets} />
            </div>
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(delivery.cta); }}
                className={`${ui.btn.base} ${ui.btn.secondary} ${ui.btn.md} w-full`}
              >
                {delivery.cta}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}