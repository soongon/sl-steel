import Image from "next/image";
import { Fragment } from "react";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function AboutSection() {
  const bodyLines = SITE.about.body.split("\n");
  const { steps } = SITE.about;

  return (
    <section id="about" className={ui.section}>
      <div className={ui.container}>
        <div className="grid gap-10 lg:grid-cols-[38fr_62fr] lg:items-center">

          {/* ── 좌측: 현장 이미지 ──────────────────────────────── */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/workers-on-site.jpg"
              alt="SL Steel 현장 작업 모습"
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

            {/* 고객 여정 3단계 */}
            <div className="mt-8 flex items-stretch gap-2">
              {steps.map(({ label, sub }, i) => (
                <Fragment key={label}>
                  <div className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-4 text-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm font-bold text-foreground leading-snug">{label}</p>
                    <p className="text-xs text-muted">{sub}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex items-center self-center text-steel/40 text-lg select-none">
                      →
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}