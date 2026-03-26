// ── 공유 타입 & 상수 ──────────────────────────────────────────────────────

export type PostStatus = "draft" | "published";
export const VALID_POST_STATUSES: readonly PostStatus[] = ["draft", "published"];

export type InquiryStatus = "new" | "read" | "resolved";
export const VALID_INQUIRY_STATUSES: readonly InquiryStatus[] = ["new", "read", "resolved"];

// ── 유틸 함수 ─────────────────────────────────────────────────────────────

export function formatDate(raw: string): string {
  const d = new Date(raw);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
