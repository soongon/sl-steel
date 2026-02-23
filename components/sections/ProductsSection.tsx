import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function ProductsSection() {
  return (
    <section id="products" className={ui.sectionAlt}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Products</p>
        <h2 className={ui.h2Display}>취급 품목</h2>
        <p className={ui.lead}>KS 규격 기준 검증된 철강재를 안정적으로 공급합니다.</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SITE.products.map((product) => (
            <div key={product.name} className={`${ui.card} ${ui.cardPad}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-display font-bold text-foreground">
                  {product.name}
                </h3>
                <span className={ui.chip}>{product.spec}</span>
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
