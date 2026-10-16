/**
 * 유입 캡처(클라이언트) — 첫 방문 때 utm·referrer·랜딩 경로·QR src 를 sessionStorage 에 한 번 저장하고,
 * 문의 폼이 hidden 필드(src_*)로 같이 보낸다. 세션(탭)이 끝나면 사라진다. 개인정보 없음.
 */
export const SOURCE_STORAGE_KEY = "silla_src_v1";

export type CapturedSource = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_path?: string;
  qr_src?: string;
};

const QR_SRC = new Set(["card", "truck", "flyer", "site", "qr"]);

/** 현재 URL·referrer 에서 유입 정보를 뽑는다(순수 — 테스트 가능). */
export function extractSource(
  url: string,
  referrer: string,
  prev: CapturedSource | null,
): CapturedSource {
  const out: CapturedSource = { ...(prev ?? {}) };
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return out;
  }
  const p = u.searchParams;
  // utm 은 나중 방문이 더 구체적일 수 있어 있으면 덮어쓴다.
  for (const k of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const v = p.get(k)?.trim();
    if (v) out[k] = v.slice(0, 200);
  }
  if (u.pathname === "/q") {
    const src = p.get("src")?.trim().toLowerCase();
    out.qr_src = src && QR_SRC.has(src) ? src : "qr";
  }
  // referrer·랜딩은 첫 방문 값만(내부 이동으로 덮이지 않게).
  if (!out.landing_path) out.landing_path = (u.pathname + u.search).slice(0, 200);
  if (!out.referrer && referrer) {
    try {
      const rh = new URL(referrer).hostname;
      if (rh && rh !== u.hostname) out.referrer = rh.slice(0, 200);
    } catch {
      /* 잘못된 referrer 는 무시 */
    }
  }
  return out;
}

export function readCapturedSource(): CapturedSource {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(SOURCE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CapturedSource) : {};
  } catch {
    return {};
  }
}

export function captureSourceNow(): void {
  if (typeof window === "undefined") return;
  try {
    const prev = readCapturedSource();
    const next = extractSource(window.location.href, document.referrer, prev);
    window.sessionStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 사생활 모드 등 저장 불가 — 유입 없이 접수된다 */
  }
}
