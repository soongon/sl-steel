import Image from "next/image";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

const SYSTEM_IMAGES = [
  {
    src: "/images/warehouse-rebar.jpg",
    alt: "SL Steel 창고 내부 철근 재고",
  },
  {
    src: "/images/facility-yard.jpg",
    alt: "SL Steel 야적장 전경",
  },
  {
    src: "/images/facility-truck-wide.jpg",
    alt: "SL Steel 크레인 카고 트럭",
  },
];

export default function SystemSection() {
  return (
    <section id="system" className={ui.section}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Infrastructure</p>
        <h2 className={ui.h2Display}>자체 인프라</h2>
        <p className={ui.lead}>직접 운영하는 인프라가 즉시 수거와 안정 납품을 가능하게 합니다.</p>

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