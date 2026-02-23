import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 shrink-0 text-accent"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function WhySection() {
  return (
    <section id="why" className={ui.sectionAlt}>
      <div className={ui.container}>
        <p className={ui.eyebrow}>Why SL Steel</p>
        <h2 className={ui.h2Display}>SL Steel이 선택받는 이유</h2>
        <p className={ui.lead}>납품과 회수를 함께 운영하는 구조가 현장의 흐름을 끊지 않습니다.</p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SITE.why.checklist.map((item) => (
            <li key={item} className={`${ui.card} flex items-start gap-4 p-5 transition-shadow hover:shadow-lift`}>
              <CheckIcon />
              <span className="text-base font-medium leading-relaxed text-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}