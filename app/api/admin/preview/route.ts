import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { source } = await request.json();

    if (!source || typeof source !== "string") {
      return NextResponse.json({ mdxSource: null });
    }

    const mdxSource = await serialize(source);
    return NextResponse.json({ mdxSource });
  } catch {
    return NextResponse.json(
      { error: "MDX 렌더링 오류" },
      { status: 400 }
    );
  }
}
