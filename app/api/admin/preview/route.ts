import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";

export async function POST(request: NextRequest) {
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
