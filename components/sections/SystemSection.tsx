import Image from "next/image";
import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

const SYSTEM_IMAGES = [
  { src: "/images/warehouse-rebar.jpg", alt: "SL Steel 창고 내부 철근 재고" },
  { src: "/images/facility-yard.jpg", alt: "SL Steel 야적장 전경" },
  { src: "/images/facility-truck-wide.jpg", alt: "SL Steel 크레인 카고 트럭" },
];

export default function SystemSection() {
  return (
    <section id="system" className={ui.section}>
      <div className={ui.container}>
        <span className={ui.label}>Infrastructure</span>
        <h2 className={ui.title}>자체 인프라</h2>
        <p className={ui.desc}>직접 운영하는 인프라가 즉시 수거와 안정 납품을 가능하게 합니다.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITE.system.map((item, i) => (
            <div key={item.title} className={`${ui.card} overflow-hidden group transition-shadow hover:shadow-lift`}>
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src={SYSTEM_IMAGES[i].src}
                  alt={SYSTEM_IMAGES[i].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* 하단 그라데이션 오버레이 */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/40 to-transparent" />
              </div>

              <div className={ui.cardPad}>
                <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
                <p className="mt-3 text-sm font-medium text-primary-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}