/**
 * 문의 폼 가드·유입 캡처 — 순수 함수만(테스트 tests/inquiry-guard.test.mjs).
 * 서버 액션(lib/inquiries.ts)이 쓴다. DB·네트워크 접근 없음.
 */
import { createHash } from "node:crypto";

/** 폼 로드 → 제출까지 이보다 짧으면 봇으로 본다. */
export const MIN_FILL_MS = 3_000;
/** 같은 번호·같은 구분 재제출을 한 건으로 합치는 창. */
export const DEDUPE_WINDOW_MS = 10 * 60_000;
/** IP 해시당 분당 허용 제출 수. */
export const RATE_LIMIT_PER_MIN = 3;
export const RATE_WINDOW_MS = 60_000;

/** 원본 IP 는 저장하지 않는다 — sha256 앞 32자(레이트리밋·중복 판정용). */
export function hashIp(ip: string | null | undefined): string | null {
  const v = (ip ?? "").split(",")[0]?.trim();
  if (!v) return null;
  return createHash("sha256").update(v).digest("hex").slice(0, 32);
}

/** honeypot(company_website)에 값이 있으면 봇. 사람은 그 칸을 볼 수 없다. */
export function isHoneypotFilled(value: FormDataEntryValue | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** 폼이 그려진 시각(form_ts, ms) 기준으로 너무 빨리 제출됐는지. 값이 없거나 이상하면 사람으로 본다(막지 않음). */
export function isTooFast(formTs: FormDataEntryValue | null, now: number, minMs = MIN_FILL_MS): boolean {
  if (typeof formTs !== "string") return false;
  const ts = Number(formTs);
  if (!Number.isFinite(ts) || ts <= 0) return false;
  const elapsed = now - ts;
  if (elapsed < 0) return false; // 클라이언트 시계가 앞서면 판단 보류
  return elapsed < minMs;
}

/** 직전 같은 번호·같은 구분 문의가 창 안이면 중복(새 행 대신 합친다). */
export function isWithinDedupeWindow(prevCreatedAt: string | Date, now: number, windowMs = DEDUPE_WINDOW_MS): boolean {
  const t = new Date(prevCreatedAt).getTime();
  if (!Number.isFinite(t)) return false;
  return now - t < windowMs;
}

/** 중복 제출의 내용 합치기 — 같은 문장이면 그대로, 다르면 줄 바꿈으로 덧붙인다(빈 값은 무시). */
export function mergeMessage(prev: string, next: string): string {
  const a = prev.trim();
  const b = next.trim();
  if (!b || a === b) return a;
  if (!a) return b;
  if (a.includes(b)) return a;
  return `${a}\n— 재제출 —\n${b}`;
}

/** 폼 hidden 으로 오는 유입 정보. 화이트리스트 키만, 각 200자 상한. */
export type InquirySource = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string; // 호스트만(경로·쿼리 없음)
  landing_path?: string;
  qr_src?: string; // /q?src= 값(card|truck|flyer|site|qr)
  page_type?: string; // 폼에서 고른 구분(매입/납품)
};
const SOURCE_KEYS: (keyof InquirySource)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
  "landing_path",
  "qr_src",
  "page_type",
];
const SOURCE_MAX = 200;

export function readSource(get: (key: string) => FormDataEntryValue | null): InquirySource {
  const out: InquirySource = {};
  for (const k of SOURCE_KEYS) {
    const v = get(`src_${k}`);
    if (typeof v !== "string") continue;
    const s = v.trim().slice(0, SOURCE_MAX);
    if (s) out[k] = s;
  }
  return out;
}

/**
 * 어드민(bk-steel-admin) lead_source 값으로 추정 — homepage/blog/naver_place/ad/other.
 * 알림 문구와 관리자 상세에 쓰고, P2 전달 때 그대로 보낸다.
 */
export type LeadGuess = "homepage" | "blog" | "naver_place" | "ad" | "other";
export function guessLeadSource(src: InquirySource): LeadGuess {
  const ref = (src.referrer ?? "").toLowerCase();
  const medium = (src.utm_medium ?? "").toLowerCase();
  const utmSource = (src.utm_source ?? "").toLowerCase();
  if (medium === "cpc" || medium === "paid" || utmSource.includes("powerlink")) return "ad";
  if (src.qr_src) return "other";
  if (ref.includes("blog.naver.com") || utmSource === "blog") return "blog";
  if (ref.includes("place.naver.com") || ref.includes("map.naver.com") || utmSource === "place") return "naver_place";
  return "homepage";
}

export const LEAD_LABEL: Record<LeadGuess, string> = {
  homepage: "홈페이지",
  blog: "네이버 블로그",
  naver_place: "네이버 플레이스",
  ad: "광고",
  other: "기타(QR 등)",
};

/** 유입을 사람이 읽는 한 줄로 — "네이버 블로그 (blog.naver.com)" / "기타 · 명함 QR". */
export function describeSource(src: InquirySource): string {
  const lead = guessLeadSource(src);
  const parts: string[] = [LEAD_LABEL[lead]];
  if (src.qr_src) parts.push(`QR:${src.qr_src}`);
  if (src.referrer && lead !== "homepage") parts.push(src.referrer);
  if (src.utm_campaign) parts.push(src.utm_campaign);
  return parts.join(" · ");
}

/** 카카오워크·메일 알림 본문. 전화는 숫자만 저장되므로 하이픈을 넣어 보여 준다. */
export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return digits;
}

export function buildNotifyText(input: {
  inquiryType: string;
  name: string;
  phone: string;
  location: string;
  message: string;
  source: InquirySource;
  adminUrl: string;
}): string {
  const msg = input.message.replace(/\s+/g, " ").trim();
  const lines = [
    `📩 홈페이지 ${input.inquiryType} · ${input.name}`,
    `☎ ${formatPhoneDisplay(input.phone)}${input.location ? ` · ${input.location}` : ""}`,
    msg ? `“${msg.length > 120 ? msg.slice(0, 120) + "…" : msg}”` : "(내용 없음)",
    `유입: ${describeSource(input.source)}`,
    input.adminUrl,
  ];
  return lines.join("\n");
}
