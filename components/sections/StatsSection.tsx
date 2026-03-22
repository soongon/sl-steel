import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function StatsSection() {
  return (
    <section className="relative -mt-8 z-10 pb-8">
      <div className={ui.container}>
        <div className="rounded-xl bg-white shadow-lift border border-neutral-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-100">
            {SITE.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2 px-6 py-8 text-center"
              >
                <span className="text-[clamp(1.5rem,3.5vw,2rem)] font-bold leading-none text-primary-600 whitespace-nowrap">
                  {stat.value}
                </span>
                <span className="text-sm text-neutral-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}