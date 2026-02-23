import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function ProductsSection() {
  return (
    <section id="products" className={ui.sectionAlt}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Buyout Criteria</p>
        <h2 className={ui.h2Display}>매입 가능 품목</h2>
        <p className={ui.lead}>어떤 철근을 매입하는지, 명확한 기준을 먼저 확인하세요.</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SITE.products.map((product) => {
            const isAvailable = product.available;
            return (
              <div
                key={product.name}
                className={[
                  ui.card,
                  ui.cardPad,
                  isAvailable ? "" : "opacity-75",
                ].join(" ")}
              >
                {/* 가능/불가 뱃지 */}
                <span
                  className={[
                    "inline-flex h-6 items-center rounded-md px-2.5 text-xs font-semibold",
                    isAvailable
                      ? "bg-accent/10 text-accent"
                      : "bg-muted/10 text-muted",
                  ].join(" ")}
                >
                  {isAvailable ? "✓ 매입 가능" : "✗ 매입 불가"}
                </span>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-display font-bold text-foreground">
                    {product.name}
                  </h3>
                  <span className={ui.chip}>{product.spec}</span>
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed">{product.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
