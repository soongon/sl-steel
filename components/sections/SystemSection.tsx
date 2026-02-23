import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function SystemSection() {
  return (
    <section id="system" className={ui.section}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Infrastructure</p>
        <h2 className={ui.h2Display}>자체 인프라</h2>
        <p className={ui.lead}>필요한 자재를 필요한 때에. 직접 보유한 설비로 대응합니다.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITE.system.map((item) => (
            <div key={item.title} className={`${ui.card} overflow-hidden transition-shadow hover:shadow-lift`}>
              {/* 이미지 플레이스홀더 — 추후 <Image> 교체 예정 */}
              <div className="aspect-4/3 w-full border-b border-border bg-surface flex items-center justify-center">
                <span className="text-xs text-muted">{item.title}</span>
              </div>

              {/* 본문 */}
              <div className={ui.cardPad}>
                <h3 className="text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
                <p className="mt-3 text-sm font-medium text-accent">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}