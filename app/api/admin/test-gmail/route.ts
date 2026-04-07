import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const envCheck = {
    GMAIL_CLIENT_ID: !!process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: !!process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: !!process.env.GMAIL_REFRESH_TOKEN,
    SHARE_EMAIL_TO: process.env.SHARE_EMAIL_TO || "(not set)",
  };

  try {
    const oauth2 = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET
    );
    oauth2.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

    const gmail = google.gmail({ version: "v1", auth: oauth2 });

    const subject = "[SL Steel] 테스트";
    const message = [
      `To: ${process.env.SHARE_EMAIL_TO}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      `Gmail API 연동 테스트입니다.`,
    ].join("\r\n");

    const raw = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: { message: { raw } },
    });

    return NextResponse.json({ status: "ok", draftId: res.data.id, envCheck });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    const details = (err as { response?: { data?: unknown } })?.response?.data;
    return NextResponse.json({ status: "error", error, details, envCheck }, { status: 500 });
  }
}
