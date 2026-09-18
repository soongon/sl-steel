// ─── 디자인 시스템 색상 상수 (SVG prop 등 Tailwind class 외 용도) ──────────────
// ⚠️ globals.css @theme 블록과 동기화 필요 — Tailwind class에서는 CSS 변수 사용할 것
// (v3 랜딩 리디자인 이후 구 `ui` Tailwind 토큰 객체는 제거됨 — 랜딩 스타일은 app/(landing)/landing.css)
export const COLOR = {
  primary400: "#5A8AB8",
  primary600: "#2C5F8A",
  primary900: "#0F2640",
  accent600:  "#D4700E",
  neutral50:  "#F7F6F3",
  white:      "#FFFFFF",
  // 신라철강 브랜드 (로고 전용)
  brandSteel700: "#1B3A5C",
  brandSteel900: "#0F1B29",
  brandGold:     "#C9A227",
} as const;
