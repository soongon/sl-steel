// 사용 예시:
// import { ui } from "@/lib/ui"
// <section className={`${ui.section.base} ${ui.section.light}`}>
//   <div className={ui.container}>...</div>
// </section>
// <button className={`${ui.btn.base} ${ui.btn.primary} ${ui.btn.md}`}>매입 문의</button>

// ─── 포커스 ring (접근성 공통) ─────────────────────────────────────────────────
const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30 focus-visible:ring-offset-2";

// ─── 버튼 공통 베이스 ─────────────────────────────────────────────────────────
const btnBase =
  `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-250 active:scale-[0.98] ${ring}`;

// ─── 메인 UI 상수 ─────────────────────────────────────────────────────────────

export const ui = {
  // ── 레이아웃 ──────────────────────────────────────────────────────────────
  container: "mx-auto max-w-[1200px] px-5 md:px-10",

  // ── 섹션 래퍼 (v2) ──────────────────────────────────────────────────────────
  section: "py-16 md:py-24",
  sectionAlt: "py-16 md:py-24 bg-neutral-50",
  sectionDark: "py-16 md:py-24 bg-primary-900 text-white",

  // ── 섹션 라벨 (영문 작은 라벨 + 좌측 액센트 라인) ─────────────────────────
  label:
    'inline-flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3 before:content-[""] before:w-5 before:h-0.5 before:bg-accent-600 before:rounded-full',
  labelDark:
    'inline-flex items-center gap-2 text-xs font-semibold text-primary-400 uppercase tracking-widest mb-3 before:content-[""] before:w-5 before:h-0.5 before:bg-accent-400 before:rounded-full',

  // ── 섹션 타이틀 ───────────────────────────────────────────────────────────
  title: "text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight leading-tight mb-4",
  titleDark: "text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-4",

  // ── 섹션 설명 ─────────────────────────────────────────────────────────────
  desc: "text-[15px] text-neutral-600 leading-relaxed max-w-xl",
  descDark: "text-[15px] text-white/60 leading-relaxed max-w-xl",

  // ── 레거시 호환 (Phase 2에서 label/title/desc로 전환 예정) ──────────────────
  eyebrow:   "text-xs font-semibold uppercase tracking-widest text-primary-600",
  h2:        "mt-2 text-2xl md:text-3xl font-bold tracking-tight text-neutral-900",
  h2Display: "mt-2 text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 break-keep",
  lead:      "mt-4 max-w-2xl text-base text-neutral-600 leading-relaxed",

  // ── 히어로 H1 전용 ────────────────────────────────────────────────────────
  h1Hero:
    "font-display text-[clamp(1.75rem,5.5vw,3.5rem)] font-bold leading-tight tracking-normal text-white break-keep",

  // ── 카드 ──────────────────────────────────────────────────────────────────
  card:     "rounded-xl border border-neutral-200 bg-white shadow-card",
  cardPad:  "p-7 sm:p-8",

  // ── 배지/태그 ─────────────────────────────────────────────────────────────
  badgeRow: "mt-6 flex flex-wrap gap-2",

  badge:
    "inline-flex items-center gap-1.5 rounded-sm border border-neutral-200 bg-white px-3.5 py-1 text-sm font-medium text-neutral-600",

  chip:
    "inline-flex h-7 items-center rounded-sm bg-primary-50 px-2.5 text-xs font-semibold text-primary-600",

  // ── 고지 문구 배너 ─────────────────────────────────────────────────────────
  notice:
    "inline-flex items-center gap-2 rounded-md bg-notice-bg px-4 py-2.5 text-sm font-semibold text-notice",

  // ── 버튼 ──────────────────────────────────────────────────────────────────
  btn: {
    base: btnBase,
    /** 매입 문의 CTA — Industrial Orange */
    primary:   "bg-accent-600 text-white hover:bg-accent-400",
    /** 납품 문의, 전화 — Steel Blue */
    secondary: "bg-primary-600 text-white hover:bg-primary-400",
    /** 히어로 보조 CTA — 투명 */
    outline:   "bg-transparent text-white border-[1.5px] border-white/40 hover:border-white hover:bg-white/8",
    /** 텍스트 링크형 */
    ghost:     "bg-transparent text-primary-600 hover:bg-primary-50",
    // sizes
    sm: "h-9 px-4 text-sm rounded-md",
    md: "h-11 px-6 text-[15px] rounded-md",
    lg: "h-14 px-9 text-base rounded-md",
  },

  // ── 링크 ──────────────────────────────────────────────────────────────────
  link:
    `rounded text-sm font-medium text-primary-600 transition-opacity hover:opacity-70 ${ring}`,

  // ── 그리드 ────────────────────────────────────────────────────────────────
  grid2: "grid grid-cols-1 gap-6 sm:grid-cols-2",
  grid3: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",

  // ── 프로세스 스텝 ─────────────────────────────────────────────────────────
  stepDot:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-900 text-sm font-bold text-white",
  stepLine:
    "absolute left-4 top-8 h-full w-px bg-neutral-200",

  // ── 구분선 ────────────────────────────────────────────────────────────────
  divider: "border-t border-neutral-200",

  // ── 아이콘 컨테이너 ───────────────────────────────────────────────────────
  iconBox:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600",
} as const;

// ─── 디자인 시스템 색상 상수 (SVG prop 등 Tailwind class 외 용도) ──────────────
export const COLOR = {
  primary400: "#5A8AB8",
  primary600: "#2C5F8A",
  primary900: "#0F2640",
  accent600:  "#D4700E",
  neutral50:  "#F7F6F3",
  white:      "#FFFFFF",
} as const;