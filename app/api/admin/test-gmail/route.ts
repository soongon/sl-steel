import { NextResponse } from "next/server";
import { createShareDraft } from "@/lib/gmail";

export async function GET() {
  const envCheck = {
    GMAIL_CLIENT_ID: !!process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: !!process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: !!process.env.GMAIL_REFRESH_TOKEN,
    SHARE_EMAIL_TO: process.env.SHARE_EMAIL_TO || "(not set)",
  };

  console.log("Gmail env check:", envCheck);

  try {
    const draftId = await createShareDraft({
      title: "테스트 포스트",
      shareUrl: "https://example.com/share/test-token",
    });

    return NextResponse.json({ status: "ok", draftId, envCheck });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Gmail test failed:", message);
    return NextResponse.json({ status: "error", error: message, envCheck }, { status: 500 });
  }
}
