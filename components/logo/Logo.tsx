import { COLOR } from "@/lib/ui";

/**
 * 신라철강 로고 컴포넌트 — B-1 크라운 + T-2 타이포
 * 웹 네비바/푸터용: 워드마크는 실제 텍스트(Pretendard 700 / tracking +0.12em)로 렌더 (선명도·접근성·SEO)
 * 인쇄·소셜·외부 지면용은 public/brand/logo-*.svg (아웃라인) 파일 사용
 */
export function LogoSymbol({ className = "h-8 w-auto", white = false }: { className?: string; white?: boolean }) {
  const main = white ? COLOR.white : COLOR.brandSteel700;
  return (
    <svg viewBox="0 0 100 112" className={className} role="img" aria-label="신라철강 심볼">
      <g fill={main}>
        <rect x="45.5" y="20" width="9" height="62" rx="2" />
        <rect x="26" y="42" width="9" height="40" rx="2" />
        <rect x="65" y="42" width="9" height="40" rx="2" />
        <rect x="19" y="88" width="62" height="6.5" rx="2" />
      </g>
      <circle cx="50" cy="10.5" r="4.5" fill={COLOR.brandGold} />
    </svg>
  );
}

const LOGO_SIZES = {
  md: { symbol: "h-[30px]", text: "text-[17px]", en: "mt-1 text-[9px]" },
  lg: { symbol: "h-[38px]", text: "text-[21px]", en: "mt-1.5 text-[11px]" },
} as const;

export function Logo({
  white = false,
  withEn = false,
  size = "md",
}: {
  white?: boolean;
  withEn?: boolean;
  size?: keyof typeof LOGO_SIZES;
}) {
  const s = LOGO_SIZES[size];
  return (
    <span className={`inline-flex items-center ${size === "lg" ? "gap-3" : "gap-2.5"}`}>
      <LogoSymbol className={`${s.symbol} w-auto`} white={white} />
      <span className="flex flex-col leading-none">
        <span
          className={`${s.text} font-bold tracking-[0.12em] ${white ? "text-white" : "text-brand-steel-900"}`}
        >
          신라철강
        </span>
        {withEn && (
          <span className={`${s.en} font-semibold tracking-[0.46em] ${white ? "text-[#9FB0C2]" : "text-[#66707C]"}`}>
            SILLA STEEL
          </span>
        )}
      </span>
    </span>
  );
}

export default Logo;
