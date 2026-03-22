import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

export default function WhySection() {
  return (
    <section id="why" className={`${ui.sectionDark}`}>
      <div className={ui.container}>
        <span className={ui.labelDark}>Why SL Steel</span>
        <h2 className={ui.titleDark}>SL Steel이 선택받는 이유</h2>
        <p className={ui.descDark}>
          납품과 회수를 함께 운영하는 구조가 현장의 흐름을 끊지 않습니다.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SITE.why.checklist.map((item) => (
            <li key={item} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 shrink-0 text-accent-400"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-base font-medium leading-relaxed text-white/90">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}