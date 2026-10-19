// ── 공유 타입 & 상수 ──────────────────────────────────────────────────────

export type PostStatus = "draft" | "published";
export const VALID_POST_STATUSES: readonly PostStatus[] = [
  "draft",
  "published",
];

export type InquiryStatus = "new" | "read" | "resolved";
export const VALID_INQUIRY_STATUSES: readonly InquiryStatus[] = [
  "new",
  "read",
  "resolved",
];

// ── 유틸 함수 ─────────────────────────────────────────────────────────────

// 날짜·시각은 항상 한국 시간으로 찍는다. 서버(Vercel)는 UTC 라 Date 의 로컬 getter·toISOString 을 쓰면
// 9시간 늦게(오전 9시 전 값은 전날로) 나온다. 브라우저에서 돌아도 같은 값이 나와 SSR·하이드레이션도 어긋나지 않는다.
const KST = "Asia/Seoul";

function parseInstant(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 시각 → 한국 시간 'YYYY-MM-DD HH:mm' (값이 없거나 잘못되면 ""). */
export function formatDate(raw: string | null | undefined): string {
  const d = parseInstant(raw);
  if (!d) return "";
  return d
    .toLocaleString("sv-SE", { timeZone: KST, hourCycle: "h23" })
    .slice(0, 16);
}

/** 시각 → 한국 날짜 'YYYY-MM-DD'. 발행일처럼 날짜만 고른 값(UTC 자정으로 저장)도 고른 날짜 그대로 나온다. */
export function formatKstDate(raw: string | null | undefined): string {
  const d = parseInstant(raw);
  if (!d) return "";
  return d.toLocaleDateString("sv-SE", { timeZone: KST });
}

/** 오늘 날짜(한국) 'YYYY-MM-DD' — 날짜 입력 기본값. */
export function kstToday(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: KST });
}

/** Cloudinary 동영상 URL 판별 */
export function isVideoUrl(url: string): boolean {
  return (
    /\/video\/upload\//.test(url) || /\.(mp4|mov|webm|avi)([?#]|$)/i.test(url)
  );
}

/** Cloudinary URL에서 파일명 추출 (확장자 포함) */
export function extractFilename(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/");
    return segments[segments.length - 1];
  } catch {
    return url;
  }
}
