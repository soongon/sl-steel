import { createSupabaseAdmin } from "./supabase-server";

export interface SharePost {
  id: string;
  title: string;
  content: string;
  share_token: string;
  share_expires_at: string;
}

export async function getShareData(token: string): Promise<
  | { status: "valid"; post: SharePost }
  | { status: "expired" }
  | { status: "not_found" }
> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("posts")
    .select("id, title, content, share_token, share_expires_at")
    .eq("share_token", token)
    .maybeSingle();

  if (error || !data) return { status: "not_found" };

  if (new Date(data.share_expires_at) < new Date()) {
    return { status: "expired" };
  }

  return { status: "valid", post: data };
}
