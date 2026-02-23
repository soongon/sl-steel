import Image from "next/image";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

const SYSTEM_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80",
    alt: "대형 산업용 창고 내부",
  },
  {
    src: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80",
    alt: "야외 자재 야적장",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "크레인 장착 트럭",
  },
];

export default function SystemSection() {
  return (
    <section id="system" className={ui.section}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Infrastructure</p>
        <h2 className={ui.h2Display}>자체 인프라</h2>
        <p className={ui.lead}>필요한 자재를 필요한 때에. 직접 보유한 설비로 대응합니다.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITE.system.map((item, i) => (
            <div key={item.title} className={`${ui.card} overflow-hidden transition-shadow hover:shadow-lift`}>
              {/* 현장 이미지 */}
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={SYSTEM_IMAGES[i].src}
                  alt={SYSTEM_IMAGES[i].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
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