import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  // Bearer 토큰 인증
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, slug, categories, excerpt, content, thumbnail_url, status } = body as {
    title?: string;
    slug?: string;
    categories?: string[];
    excerpt?: string;
    content?: string;
    thumbnail_url?: string;
    status?: string;
  };

  // 필수 필드 검사
  const missing = [];
  if (!title) missing.push("title");
  if (!slug) missing.push("slug");
  if (!categories || !Array.isArray(categories) || categories.length === 0) missing.push("categories");
  if (!excerpt) missing.push("excerpt");
  if (!content) missing.push("content");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();

  // 카테고리 존재 확인
  const { data: validCats } = await supabase
    .from("categories")
    .select("name")
    .in("name", categories!);

  const validNames = new Set((validCats ?? []).map((c) => c.name));
  const invalid = categories!.filter((c) => !validNames.has(c));
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `Invalid categories: ${invalid.join(", ")}` },
      { status: 400 }
    );
  }

  // slug 중복 확인
  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: `Slug "${slug}" already exists` },
      { status: 400 }
    );
  }

  // 포스트 생성
  const postStatus = status === "published" ? "published" : "draft";
  const publishedAt = postStatus === "published" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      categories,
      excerpt,
      content,
      thumbnail_url: thumbnail_url || null,
      status: postStatus,
      published_at: publishedAt,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/blog");
  revalidatePath("/admin");

  return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 });
}
