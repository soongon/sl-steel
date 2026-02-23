import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function StatsSection() {
  return (
    <section className="bg-[#0D1117] py-14 sm:py-16">
      <div className={ui.container}>
        <div className="grid grid-cols-2 gap-px bg-white/10 overflow-hidden rounded-2xl lg:grid-cols-4">
          {SITE.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "flex flex-col items-center justify-center gap-2 bg-[#0D1117] px-6 py-10 text-center",
                i < SITE.stats.length - 1 ? "lg:border-r lg:border-white/10" : "",
              ].join(" ")}
            >
              <span className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-display font-bold leading-none text-amber-400 whitespace-nowrap">
                {stat.value}
              </span>
              <span className="text-sm text-white/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
