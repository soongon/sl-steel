"use client";

import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import { scrollToContact } from "@/lib/scroll";

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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
        <p className={ui.eyebrow}>Business</p>
        <h2 className={ui.h2Display}>사업 영역</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          {/* ── 매입 카드 (주) ─────────────────────────────────────── */}
          <div className={`${ui.card} ${ui.cardPad} flex flex-col transition-shadow hover:shadow-lift`}>
            <div className="flex-1">
              <span className={ui.chip}>매입 · 주력</span>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                {recovery.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{recovery.lead}</p>

              {/* 대상/제외 표 */}
              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                <div className="flex text-sm">
                  <span className="w-16 shrink-0 bg-surface px-4 py-3 font-medium text-foreground">
                    대상
                  </span>
                  <span className="flex-1 border-l border-border bg-card px-4 py-3 text-muted">
                    {recovery.table.target}
                  </span>
                </div>
                <div className="flex border-t border-border text-sm">
                  <span className="w-16 shrink-0 bg-surface px-4 py-3 font-medium text-foreground">
                    제외
                  </span>
                  <span className="flex-1 border-l border-border bg-card px-4 py-3 text-muted">
                    {recovery.table.exclude}
                  </span>
                </div>
              </div>

              <BulletList items={recovery.bullets} />

              <p className="mt-4 border-l-2 border-border pl-3 text-xs text-muted">
                {recovery.notice}
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(recovery.cta); }}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-white transition-all duration-200 hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgb(59_130_246/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {recovery.cta}
              </a>
            </div>
          </div>

          {/* ── 납품 카드 (보조) ───────────────────────────────────── */}
          <div className={`${ui.card} ${ui.cardPad} flex flex-col transition-shadow hover:shadow-lift`}>
            <div className="flex-1">
              <span className={ui.chip}>납품 · 보조</span>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                {delivery.title}
              </h3>
              <BulletList items={delivery.bullets} />
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToContact(delivery.cta); }}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-base font-semibold text-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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