import type { Metadata } from "next";
import Image from "next/image";
import { LogoSymbol } from "@/components/logo/Logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "신라철강 QR 문의 | 철근 납품·잔여 철근 수거",
  description:
    "철근·H빔 납품부터 현장에 남은 철근 매입·수거까지. 신라철강 QR 전용 빠른 문의 페이지입니다.",
  robots: { index: false, follow: false },
};

type QRSource = "card" | "truck" | "flyer" | "site" | "qr";

interface QRPageProps {
  searchParams: Promise<{ src?: string | string[] }>;
}

const QR_SOURCE_LABELS: Record<QRSource, string> = {
  card: "명함",
  truck: "차량",
  flyer: "전단",
  site: "현장 안내",
  qr: "QR",
};

const deliveryItems = ["철근", "H빔", "현장 필요 자재"];
const pickupItems = ["녹슨 철근", "4m 이상 절단 철근", "공사 후 남은 철근"];
const unavailableItems = ["휘어진 철근", "3.5m 이하", "일반 고철"];

const stats = [
  { value: "2009년~", label: "철강 업력" },
  { value: "5톤·25톤", label: "크레인 카고" },
  { value: "창고·야적장", label: "자체 인프라" },
  { value: "중부·남부권", label: "현장 대응" },
] as const;

const processSteps = [
  "사진·전화 문의",
  "재고·상태 확인",
  "단가·일정 상담",
  "납품 또는 수거",
] as const;

function normalizeSource(raw?: string | string[]): QRSource {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "card" || value === "truck" || value === "flyer" || value === "site") {
    return value;
  }
  return "qr";
}

function Icon({ type }: { type: "phone" | "message" | "truck" | "check" | "x" }) {
  if (type === "phone") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.93.33 1.83.63 2.69a2 2 0 0 1-.45 2.11L8 9.82a16 16 0 0 0 6.18 6.18l1.3-1.29a2 2 0 0 1 2.11-.45c.86.3 1.76.51 2.69.63A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }

  if (type === "message") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }

  if (type === "truck") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.22-.62l-3.5-4.4A1 1 0 0 0 17.5 8H14" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ActionButton({
  href,
  label,
  sub,
  type,
  variant,
}: {
  href: string;
  label: string;
  sub: string;
  type: "phone" | "message";
  variant: "primary" | "secondary";
}) {
  const variantClass =
    variant === "primary"
      ? "bg-accent-600 text-white shadow-[0_14px_32px_rgb(212_112_14/0.28)]"
      : "bg-white text-primary-900 ring-1 ring-white/40";

  return (
    <a
      href={href}
      className={`${variantClass} flex min-h-[3.75rem] items-center justify-center gap-3 rounded-lg px-4 py-3 text-left transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-black/10">
        <Icon type={type} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-extrabold leading-tight">{label}</span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-tight opacity-70">{sub}</span>
      </span>
    </a>
  );
}

function SectionTitle({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <p className="text-[11px] font-extrabold uppercase text-primary-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 break-keep text-[22px] font-extrabold leading-tight text-neutral-900">
        {children}
      </h2>
    </div>
  );
}

function ServiceCard({
  title,
  desc,
  image,
  items,
  tone,
}: {
  title: string;
  desc: string;
  image: string;
  items: string[];
  tone: "delivery" | "pickup";
}) {
  const toneClass =
    tone === "delivery"
      ? "bg-primary-600 text-white"
      : "bg-accent-600 text-white";

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card">
      <div className="relative h-36">
        <Image src={image} alt="" fill className="object-cover" sizes="430px" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/72 to-transparent p-4 pt-12">
          <h3 className="text-lg font-extrabold leading-tight text-white">{title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="break-keep text-sm leading-relaxed text-neutral-600">{desc}</p>
        <ul className="mt-4 grid gap-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${toneClass}`}>
                <Icon type="check" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default async function QRLandingPage({ searchParams }: QRPageProps) {
  const { src } = await searchParams;
  const source = normalizeSource(src);
  const sourceLabel = QR_SOURCE_LABELS[source];
  const phone = SITE.footer.regions[0].phone;
  const phoneNumber = phone.replace(/-/g, "");
  const smsBody = `신라철강 문의드립니다. (${sourceLabel} QR)`;
  const smsHref = `sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`;

  return (
    <main className="min-h-screen bg-primary-900 text-neutral-900 sm:bg-neutral-100">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-[0_28px_80px_rgb(15_38_64/0.24)]">
        <section className="relative overflow-hidden bg-primary-900 px-5 pb-6 pt-5 text-white">
          <Image
            src="/images/facility-truck-wide.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="430px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary-900 via-primary-900/90 to-primary-900/60" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <LogoSymbol className="h-[34px] w-auto" white />
                <div className="leading-none">
                  <p className="text-[15px] font-black">신라철강</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Silla Steel</p>
                </div>
              </div>
              <a
                href={`tel:${phoneNumber}`}
                className="rounded-md bg-white/10 px-3 py-2 text-xs font-extrabold text-white ring-1 ring-white/20"
              >
                {phone}
              </a>
            </div>

            <div className="pt-12">
              <h1 className="break-keep text-[34px] font-black leading-[1.12] text-white">
                철근 납품부터
                <br />
                잔여 철근 수거까지.
              </h1>
              <p className="mt-4 break-keep text-[16px] font-medium leading-relaxed text-white/75">
                필요한 철근은 현장 일정에 맞춰 납품하고,
                남은 철근은 직접 방문해 매입·수거합니다.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <ActionButton
                href={`tel:${phoneNumber}`}
                label="납품 문의"
                sub="전화 바로 연결"
                type="phone"
                variant="primary"
              />
              <ActionButton
                href={smsHref}
                label="수거 문의"
                sub="사진 문자 보내기"
                type="message"
                variant="secondary"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/10 p-3">
                  <p className="text-[18px] font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-bold text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-8">
          <SectionTitle eyebrow="What we do">현장에서 필요한 두 가지를 같이 합니다</SectionTitle>
          <div className="mt-5 grid gap-4">
            <ServiceCard
              title="철근·H빔 납품"
              desc="재고와 일정을 확인해 현장에 필요한 철강 자재를 빠르게 안내합니다."
              image="/images/warehouse-hbeam.jpg"
              items={deliveryItems}
              tone="delivery"
            />
            <ServiceCard
              title="잔여 철근 매입·수거"
              desc="공사 후 남은 철근을 사진으로 확인하고, 조건에 맞으면 현장으로 직접 방문합니다."
              image="/images/warehouse-rebar.jpg"
              items={pickupItems}
              tone="pickup"
            />
          </div>
        </section>

        <section className="bg-neutral-50 px-5 py-8">
          <SectionTitle eyebrow="Pickup criteria">수거 가능 여부를 먼저 확인하세요</SectionTitle>
          <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
            <p className="text-sm font-extrabold text-neutral-900">매입·수거 가능</p>
            <ul className="mt-3 grid gap-2">
              {pickupItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-bold text-neutral-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-success text-white">
                    <Icon type="check" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="my-5 border-t border-neutral-200" />
            <p className="text-sm font-extrabold text-neutral-900">매입 불가</p>
            <ul className="mt-3 grid gap-2">
              {unavailableItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-bold text-neutral-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-neutral-200 text-neutral-600">
                    <Icon type="x" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-5 py-8">
          <SectionTitle eyebrow="Process">문의 후 진행은 간단합니다</SectionTitle>
          <ol className="mt-5 grid gap-3">
            {processSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-card">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-900 text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="text-[15px] font-extrabold text-neutral-900">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-primary-900 px-5 py-8 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-400/15 text-primary-400">
              <Icon type="truck" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase text-primary-400">Infrastructure</p>
              <h2 className="mt-1 break-keep text-[22px] font-extrabold leading-tight">직접 보유한 장비와 공간으로 대응합니다</h2>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["대형 창고", "야적장", "크레인 카고"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/10 px-2 py-4 text-center">
                <p className="text-xs font-extrabold leading-tight text-white">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 break-keep text-sm leading-relaxed text-white/70">
            납품과 수거를 함께 운영해 현장 일정, 상하차, 보관 부담을 줄이는 방향으로 상담합니다.
          </p>
        </section>

        <section className="px-5 pb-28 pt-8">
          <div className="rounded-xl border border-accent-600/20 bg-accent-50 p-5">
            <p className="break-keep text-lg font-black leading-tight text-neutral-900">
              지금 현장 사진이 있다면,
              <br />
              문자로 먼저 보내주세요.
            </p>
            <p className="mt-2 break-keep text-sm leading-relaxed text-neutral-600">
              수량, 길이, 지역을 함께 알려주시면 납품·수거 가능 여부를 더 빠르게 확인할 수 있습니다.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex h-12 items-center justify-center rounded-md bg-primary-600 text-sm font-extrabold text-white"
              >
                전화 문의
              </a>
              <a
                href={smsHref}
                className="flex h-12 items-center justify-center rounded-md bg-accent-600 text-sm font-extrabold text-white"
              >
                사진 문자
              </a>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-10px_28px_rgb(15_38_64/0.12)] backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${phoneNumber}`}
              className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary-600 text-sm font-extrabold text-white"
            >
              <Icon type="phone" />
              납품 문의
            </a>
            <a
              href={smsHref}
              className="flex h-12 items-center justify-center gap-2 rounded-md bg-accent-600 text-sm font-extrabold text-white"
            >
              <Icon type="message" />
              수거 문의
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
