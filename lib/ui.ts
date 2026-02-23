// 사용 예시:
// import { ui } from "@/lib/ui"
// <section className={ui.section}><div className={ui.container}>...</div></section>
// <button className={ui.btn.primary}>납품 문의</button>

// ─── 포커스 ring (접근성 공통) ─────────────────────────────────────────────────
const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 focus-visible:ring-offset-2";

// ─── 버튼 공통 베이스 ─────────────────────────────────────────────────────────
const btnBase =
  `inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors ${ring}`;

// ─── 메인 UI 상수 ─────────────────────────────────────────────────────────────

export const ui = {
  // ── 레이아웃 ──────────────────────────────────────────────────────────────
  container:  "mx-auto max-w-6xl px-6",
  section:    "py-20 sm:py-24",
  sectionAlt: "py-20 sm:py-24 bg-surface",

  // ── 섹션 헤더 (eyebrow + h2 + lead 묶음) ──────────────────────────────────
  eyebrow:  "text-xs font-bold uppercase tracking-[0.15em] text-accent",
  h2:       "mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground",
  /** About 등 섹션 타이틀에 Noto Serif KR 적용 — 히어로와 폰트 통일 */
  h2Display: "mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground break-keep",
  lead:     "mt-4 max-w-2xl text-base sm:text-lg text-muted leading-relaxed",

  // ── 히어로 H1 전용 (Noto Serif KR, 디스플레이 사이즈) ──────────────────────
  // font-display → --font-display → var(--font-noto-serif)
  h1Hero:
    "font-display text-[clamp(1.1rem,5vw,2.875rem)] font-bold leading-tight tracking-normal text-white break-keep",

  // ── 카드 ──────────────────────────────────────────────────────────────────
  card:     "rounded-2xl border border-border bg-card shadow-sm",
  cardPad:  "p-7 sm:p-8",

  // ── 배지/태그 ─────────────────────────────────────────────────────────────
  badgeRow: "mt-6 flex flex-wrap gap-2",

  /** 시설 배지 (대형 창고, 야적장, …) */
  badge:
    "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-sm font-medium text-steel",

  /** 카드 상단 컬러 칩 (사업 구분, 포인트 번호 등) */
  chip:
    "inline-flex h-7 items-center rounded-md bg-accent/10 px-2.5 text-xs font-semibold text-accent",

  // ── 고지 문구 배너 ─────────────────────────────────────────────────────────
  notice:
    "inline-flex items-center gap-2 rounded-lg bg-notice-bg px-4 py-2.5 text-sm font-semibold text-notice",

  // ── 버튼 ──────────────────────────────────────────────────────────────────
  btn: {
    /** 주요 CTA — 납품 문의 */
    primary:
      `${btnBase} bg-brand-navy text-white hover:opacity-95`,

    /** 보조 CTA — 매입 문의 */
    secondary:
      `${btnBase} border border-border bg-card text-foreground hover:bg-surface`,

    /** 고스트 (헤더 메뉴, 탭 등) */
    ghost:
      `${btnBase} px-4 text-muted hover:bg-surface hover:text-foreground`,

    /** 액센트 — 인라인 강조 링크형 버튼 */
    accent:
      `${btnBase} bg-accent text-white hover:opacity-95`,
  },

  // ── 링크 ──────────────────────────────────────────────────────────────────
  link:
    `rounded text-sm font-medium text-accent transition-opacity hover:opacity-70 ${ring}`,

  // ── 그리드 ────────────────────────────────────────────────────────────────
  grid2: "grid grid-cols-1 gap-6 sm:grid-cols-2",
  grid3: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",

  // ── 프로세스 스텝 ─────────────────────────────────────────────────────────
  stepDot:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white",
  stepLine:
    "absolute left-4 top-8 h-full w-px bg-border",

  // ── 구분선 ────────────────────────────────────────────────────────────────
  divider: "border-t border-border",

  // ── 아이콘 컨테이너 ───────────────────────────────────────────────────────
  iconBox:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent",
} as const;