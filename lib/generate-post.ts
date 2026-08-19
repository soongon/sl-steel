"use server";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { revalidatePath } from "next/cache";
import { createSupabaseAdmin, requireAuth } from "./supabase-server";
import { isVideoUrl } from "./types";
import { BLOG_CATEGORIES } from "./blog";
import { replaceMediaMarkers } from "./media-markers";
import { BLOG_SYSTEM_PROMPT, buildUserText } from "./blog-prompt";

// ── 결과 타입 ─────────────────────────────────────────────────────────

export interface GenerateResult {
  error?: string;
  slug?: string;
  postId?: string;
  title?: string;
}

// 사이트 카테고리 (BLOG_CATEGORIES에서 "전체" 제외)
const POST_CATEGORIES = BLOG_CATEGORIES.filter((c) => c !== "전체") as [string, ...string[]];

const PostSchema = z.object({
  title: z.string().describe("'{현장명} {작업내용} — {부제목}' 형식"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .describe("영문 소문자와 하이픈"),
  categories: z.array(z.enum(POST_CATEGORIES)).min(2).max(3),
  excerpt: z.string().describe("1~2문장 요약, 회사명 미포함"),
  content: z.string().describe("마크다운 본문, [사진N] 마커 포함"),
});

const MODEL = process.env.BLOG_AI_MODEL || "claude-opus-5";

function requireApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("환경변수 ANTHROPIC_API_KEY가 설정되지 않았습니다. Vercel/로컬 env에 추가해 주세요.");
  }
  return key;
}

// ── 헬퍼 ─────────────────────────────────────────────────────────────

/** slug 중복 시 -2, -3… 을 붙여 고유 slug 확보 */
async function ensureUniqueSlug(slug: string): Promise<string> {
  const admin = createSupabaseAdmin();
  let candidate = slug;
  for (let i = 2; i <= 20; i++) {
    const { data } = await admin.from("posts").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${slug}-${i}`;
  }
  throw new Error(`슬러그 "${slug}" 중복을 해소하지 못했습니다.`);
}

/** 빠진 이미지 마커를 본문 끝(마무리 섹션 앞)에 보충해 사진 유실을 막는다 */
function ensureImageMarkers(content: string, mediaUrls: string[]): string {
  const missing: string[] = [];
  mediaUrls.forEach((url, i) => {
    if (!isVideoUrl(url) && !content.includes(`[사진${i + 1}]`)) {
      missing.push(`[사진${i + 1}]`);
    }
  });
  if (missing.length === 0) return content;

  const extra = `\n\n${missing.join("\n\n")}\n`;
  // 마무리(매입 안내) 섹션 앞에 삽입, 못 찾으면 끝에 추가
  const closingIdx = content.lastIndexOf("\n## 공사 후 남은 철근");
  if (closingIdx > 0) {
    return content.slice(0, closingIdx) + extra + content.slice(closingIdx);
  }
  return content + extra;
}

// ── 메인 서버 액션 ────────────────────────────────────────────────────

export async function generateAndPublishPost(formData: FormData): Promise<GenerateResult> {
  try {
    await requireAuth();

    // 1. 입력 파싱
    const siteName = String(formData.get("siteName") ?? "").trim();
    const workType = String(formData.get("workType") ?? "").trim() || "납품";
    const memo = String(formData.get("memo") ?? "").trim();
    const status = formData.get("status") === "draft" ? "draft" : "published";
    let materials: string[] = [];
    let mediaUrls: string[] = [];
    try {
      materials = JSON.parse(String(formData.get("materials") ?? "[]"));
      mediaUrls = JSON.parse(String(formData.get("mediaUrls") ?? "[]"));
    } catch {
      return { error: "입력 형식이 올바르지 않습니다." };
    }

    if (!siteName) return { error: "현장명을 입력해 주세요." };
    const imageUrls = mediaUrls.filter((u) => !isVideoUrl(u));
    if (imageUrls.length === 0) return { error: "사진을 1장 이상 올려 주세요." };

    // 2. Claude API 호출 — 사진 분석 + 블로그 JSON 생성
    const client = new Anthropic({ apiKey: requireApiKey() });

    const content: Anthropic.ContentBlockParam[] = [];
    mediaUrls.forEach((url, i) => {
      if (isVideoUrl(url)) return; // 동영상은 분석 대상 아님 (텍스트로만 안내)
      content.push({ type: "text", text: `[사진${i + 1}]` });
      content.push({ type: "image", source: { type: "url", url } });
    });
    content.push({
      type: "text",
      text: buildUserText({
        siteName,
        workType,
        materials,
        memo,
        imageCount: imageUrls.length,
        videoCount: mediaUrls.length - imageUrls.length,
      }),
    });

    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: BLOG_SYSTEM_PROMPT,
      output_config: { format: zodOutputFormat(PostSchema), effort: "medium" },
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return { error: "AI가 이 요청의 처리를 거절했습니다. 사진과 키워드를 확인 후 다시 시도해 주세요." };
    }
    const post = response.parsed_output;
    if (!post) {
      return { error: "글 생성 결과를 해석하지 못했습니다. 다시 시도해 주세요." };
    }

    // 3. 후처리 — slug 고유화, 마커 보정, 미디어 치환
    const slug = await ensureUniqueSlug(post.slug);
    const finalContent = replaceMediaMarkers(ensureImageMarkers(post.content, mediaUrls), mediaUrls);
    const thumbnailUrl = imageUrls[0] ?? mediaUrls[0] ?? null;

    // 4. 저장 (자동 발행)
    const admin = createSupabaseAdmin();
    const { data: inserted, error: insertError } = await admin
      .from("posts")
      .insert({
        title: post.title,
        slug,
        categories: post.categories,
        excerpt: post.excerpt,
        content: finalContent,
        thumbnail_url: thumbnailUrl,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("generateAndPublishPost insert error:", insertError?.message);
      return { error: "글 저장에 실패했습니다. 다시 시도해 주세요." };
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");
    return { slug, postId: inserted.id, title: post.title };
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return { error: "AI 사용량 한도에 걸렸습니다. 잠시 후 다시 시도해 주세요." };
    }
    if (err instanceof Anthropic.APIConnectionError) {
      return { error: "AI 서버에 연결하지 못했습니다. 네트워크 확인 후 다시 시도해 주세요." };
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", err.status, err.message);
      return { error: `AI 호출에 실패했습니다 (${err.status ?? "오류"}). 잠시 후 다시 시도해 주세요.` };
    }
    console.error("generateAndPublishPost error:", err);
    return { error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." };
  }
}
