import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function ProductsSection() {
  return (
    <section id="products" className={ui.sectionAlt}>
      <div className={ui.container}>
        <span className={ui.label}>Buyout Criteria</span>
        <h2 className={ui.title}>매입 가능 품목</h2>
        <p className={ui.desc}>어떤 철근을 매입하는지, 명확한 기준을 먼저 확인하세요.</p>

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
                <span
                  className={[
                    "inline-flex h-6 items-center rounded-sm px-2.5 text-xs font-semibold",
                    isAvailable
                      ? "bg-green-50 text-success"
                      : "bg-red-50 text-danger",
                  ].join(" ")}
                >
                  {isAvailable ? "✓ 매입 가능" : "✗ 매입 불가"}
                </span>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-neutral-900">{product.name}</h3>
                  <span className={ui.chip}>{product.spec}</span>
                </div>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{product.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}