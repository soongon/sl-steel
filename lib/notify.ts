/**
 * 새 문의 알림 — Gmail 로 대표 메일함에 즉시 발송. best-effort: 접수를 막지 않는다.
 * env: INQUIRY_EMAIL_TO (없으면 SHARE_EMAIL_TO), GMAIL_* (lib/gmail.ts), NEXT_PUBLIC_SITE_URL (관리자 딥링크 베이스).
 */
import { sendMail } from "./gmail";
import { buildNotifyText, type InquirySource } from "./inquiry-guard";

export const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sl-steel.co.kr").replace(/\/$/, "");

export function inquiryAdminUrl(id: string): string {
  return `${SITE_BASE}/admin/inquiries/${id}`;
}

/** 알림 메일을 보내고 성공 여부를 돌려준다(수신자 미설정·자격증명 없음·전송 실패면 false). */
export async function notifyNewInquiry(input: {
  id: string;
  inquiryType: string;
  name: string;
  phone: string;
  location: string;
  message: string;
  source: InquirySource;
}): Promise<boolean> {
  const to = process.env.INQUIRY_EMAIL_TO || process.env.SHARE_EMAIL_TO || "";
  if (!to) {
    console.warn("inquiry notification skipped: INQUIRY_EMAIL_TO / SHARE_EMAIL_TO not set");
    return false;
  }
  return sendMail({
    to,
    subject: `[신라철강] 홈페이지 ${input.inquiryType} — ${input.name}`,
    body: buildNotifyText({ ...input, adminUrl: inquiryAdminUrl(input.id) }),
  });
}
