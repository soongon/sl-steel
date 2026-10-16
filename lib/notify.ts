/**
 * 새 문의 알림 — 카카오워크 Incoming Webhook(1순위) → Gmail(폴백). best-effort: 접수를 막지 않는다.
 * env: KAKAOWORK_WEBHOOK_URL (bk-steel-admin 과 같은 운영방 웹훅을 그대로 등록),
 *      INQUIRY_EMAIL_TO (없으면 SHARE_EMAIL_TO), NEXT_PUBLIC_SITE_URL (관리자 딥링크 베이스).
 */
import { sendMail } from "./gmail";
import { buildNotifyText, type InquirySource } from "./inquiry-guard";

export const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sl-steel.co.kr").replace(/\/$/, "");

export function inquiryAdminUrl(id: string): string {
  return `${SITE_BASE}/admin/inquiries/${id}`;
}

async function sendKakaoWork(text: string): Promise<boolean> {
  const url = process.env.KAKAOWORK_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) console.warn("KakaoWork webhook failed:", res.status);
    return res.ok;
  } catch (err) {
    console.warn("KakaoWork webhook error:", err);
    return false;
  }
}

export type NotifyChannel = "kakaowork" | "email" | null;

/** 알림을 보내고 어느 채널로 나갔는지 돌려준다(둘 다 실패·미설정이면 null). */
export async function notifyNewInquiry(input: {
  id: string;
  inquiryType: string;
  name: string;
  phone: string;
  location: string;
  message: string;
  source: InquirySource;
}): Promise<NotifyChannel> {
  const adminUrl = inquiryAdminUrl(input.id);
  const text = buildNotifyText({ ...input, adminUrl });

  if (await sendKakaoWork(text)) return "kakaowork";

  const to = process.env.INQUIRY_EMAIL_TO || process.env.SHARE_EMAIL_TO || "";
  if (!to) return null;
  const ok = await sendMail({
    to,
    subject: `[신라철강] 홈페이지 ${input.inquiryType} — ${input.name}`,
    body: text,
  });
  return ok ? "email" : null;
}
