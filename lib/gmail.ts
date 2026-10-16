import { google } from "googleapis";

// ── 수신자 설정 (변경 시 여기만 수정) ─────────────────────────────────────
const DEFAULT_RECIPIENT = process.env.SHARE_EMAIL_TO || "";

// ── Gmail OAuth2 클라이언트 ───────────────────────────────────────────────
function getGmailClient() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("Gmail credentials missing:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRefreshToken: !!refreshToken,
    });
    return null;
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });

  return google.gmail({ version: "v1", auth: oauth2 });
}

// ── RFC 2822 raw 메시지 (한글 제목 base64) ───────────────────────────────
function buildRaw(to: string, subject: string, body: string): string {
  const message = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    body,
  ].join("\r\n");
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ── 메일 즉시 발송 (문의 알림 폴백) ──────────────────────────────────────
// gmail.compose 스코프면 send 도 된다. 자격증명이 없거나 실패하면 false — 호출 쪽은 막지 않는다.
export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<boolean> {
  const gmail = getGmailClient();
  if (!gmail || !to) return false;
  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: buildRaw(to, subject, body) },
    });
    return true;
  } catch (err) {
    console.error("Gmail send failed:", err);
    return false;
  }
}

// ── 공유 링크 임시보관함 생성 ─────────────────────────────────────────────
export async function createShareDraft({
  title,
  shareUrl,
  recipient = DEFAULT_RECIPIENT,
}: {
  title: string;
  shareUrl: string;
  recipient?: string;
}) {
  const gmail = getGmailClient();
  if (!gmail) {
    console.warn("Gmail client not available");
    return null;
  }
  if (!recipient) {
    console.warn("No recipient configured (SHARE_EMAIL_TO)");
    return null;
  }

  const subject = `[신라철강 블로그] ${title}`;
  const body = [
    `블로그 포스트가 공유되었습니다.`,
    ``,
    `제목: ${title}`,
    `공유 링크: ${shareUrl}`,
    ``,
    `※ 이 링크는 7일 후 만료됩니다.`,
  ].join("\n");

  // RFC 2822 형식 이메일
  const message = [
    `To: ${recipient}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    body,
  ].join("\r\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: { raw: encodedMessage },
      },
    });

    console.log("Gmail draft created:", res.data.id);
    return res.data.id;
  } catch (err) {
    console.error("Gmail draft creation failed:", err);
    return null;
  }
}
