"use server";

import { SLUG_PATTERN } from "@/lib/post-validation";
import { revalidatePostPages } from "@/lib/revalidate-posts";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { createSupabaseAdmin, requireAuth } from "./supabase-server";
import { isVideoUrl } from "./types";
import { BLOG_CATEGORIES } from "./blog";
import { ensureImageMarkers, renderDraftContent } from "./media-markers";
import {
  BLOG_SYSTEM_PROMPT,
  buildRevisionText,
  buildUserText,
} from "./blog-prompt";
import { generateShareToken } from "./admin";
import {
  MAX_INSTRUCTION_LENGTH,
  draftToJson,
  type PostDraft,
} from "./post-draft";

// 모바일 포스팅: 생성(generatePostDraft) → 검토·반복 수정(revisePostDraft) → 발행(publishPostDraft)
// 검토 중인 글은 DB에 저장하지 않고 클라이언트가 들고 있다가 발행 시점에 한 번만 insert 한다.

// ── 결과 타입 ─────────────────────────────────────────────────────────

export interface DraftResult {
  error?: string;
  draft?: PostDraft;
}

export interface PublishResult {
  error?: string;
  slug?: string;
  postId?: string;
  title?: string;
  status?: "draft" | "published";
  /** 지메일 임시보관함에 공유 메일이 생성됐는지 (발행은 성공해도 메일은 실패할 수 있음) */
  draftCreated?: boolean;
  /** 같은 제목의 글이 방금 저장돼 있어 새로 만들지 않고 그 글을 돌려줬는지 */
  duplicate?: boolean;
}

/** 같은 제목 재저장을 중복으로 보는 시간 */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

// 사이트 카테고리 (BLOG_CATEGORIES에서 "전체" 제외)
const POST_CATEGORIES = BLOG_CATEGORIES.filter((c) => c !== "전체") as [
  string,
  ...string[],
];

const PostSchema = z.object({
  title: z.string().describe("'{현장명} {작업내용} — {부제목}' 형식"),
  slug: z.string().regex(SLUG_PATTERN).describe("영문 소문자와 하이픈"),
  categories: z.array(z.enum(POST_CATEGORIES)).min(2).max(3),
  excerpt: z.string().describe("1~2문장 요약, 회사명 미포함"),
  content: z.string().describe("마크다운 본문, [사진N] 마커 포함"),
});

// 클라이언트가 되돌려 보내는 글 검증 (AI 출력 스키마 + 길이 상한)
const DraftInputSchema = PostSchema.extend({
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().max(1000),
  content: z.string().trim().min(1).max(50000),
});

const MODEL = process.env.BLOG_AI_MODEL || "claude-opus-5";

function requireApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "환경변수 ANTHROPIC_API_KEY가 설정되지 않았습니다. Vercel/로컬 env에 추가해 주세요.",
    );
  }
  return key;
}

// ── 입력 파싱 ─────────────────────────────────────────────────────────

interface SiteInput {
  siteName: string;
  workType: string;
  materials: string[];
  memo: string;
  mediaUrls: string[];
  imageUrls: string[];
}

function parseSiteInput(formData: FormData): SiteInput | { error: string } {
  const siteName = String(formData.get("siteName") ?? "").trim();
  const workType = String(formData.get("workType") ?? "").trim() || "납품";
  const memo = String(formData.get("memo") ?? "").trim();
  let materials: unknown;
  let mediaUrls: unknown;
  try {
    materials = JSON.parse(String(formData.get("materials") ?? "[]"));
    mediaUrls = JSON.parse(String(formData.get("mediaUrls") ?? "[]"));
  } catch {
    return { error: "입력 형식이 올바르지 않습니다." };
  }
  if (
    !Array.isArray(materials) ||
    !materials.every((m) => typeof m === "string") ||
    !Array.isArray(mediaUrls) ||
    !mediaUrls.every((u) => typeof u === "string")
  ) {
    return { error: "입력 형식이 올바르지 않습니다." };
  }
  if (!mediaUrls.every((u) => u.startsWith("https://res.cloudinary.com/"))) {
    return { error: "허용되지 않은 미디어 URL이 포함되어 있습니다." };
  }

  if (!siteName) return { error: "현장명을 입력해 주세요." };
  const imageUrls = mediaUrls.filter((u) => !isVideoUrl(u));
  if (imageUrls.length === 0) return { error: "사진을 1장 이상 올려 주세요." };

  return { siteName, workType, materials, memo, mediaUrls, imageUrls };
}

function parseDraft(formData: FormData): PostDraft | { error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("draft") ?? ""));
  } catch {
    return { error: "글 데이터가 올바르지 않습니다. 다시 생성해 주세요." };
  }
  const parsed = DraftInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "글 데이터가 올바르지 않습니다. 다시 생성해 주세요." };
  }
  return parsed.data;
}

// ── Claude 호출 ───────────────────────────────────────────────────────

/** 사진 + 현장 정보 유저 메시지. 마지막 블록에 캐시 지점을 둬 수정 호출이 사진 분석을 재사용한다. */
function buildInitialContent(input: SiteInput): Anthropic.ContentBlockParam[] {
  const content: Anthropic.ContentBlockParam[] = [];
  input.mediaUrls.forEach((url, i) => {
    if (isVideoUrl(url)) return; // 동영상은 분석 대상 아님 (텍스트로만 안내)
    content.push({ type: "text", text: `[사진${i + 1}]` });
    content.push({ type: "image", source: { type: "url", url } });
  });
  content.push({
    type: "text",
    text: buildUserText({
      siteName: input.siteName,
      workType: input.workType,
      materials: input.materials,
      memo: input.memo,
      imageCount: input.imageUrls.length,
      videoCount: input.mediaUrls.length - input.imageUrls.length,
    }),
    cache_control: { type: "ephemeral" },
  });
  return content;
}

async function callClaude(
  messages: Anthropic.MessageParam[],
  mediaUrls: string[],
): Promise<DraftResult> {
  const client = new Anthropic({ apiKey: requireApiKey() });
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: BLOG_SYSTEM_PROMPT,
    output_config: { format: zodOutputFormat(PostSchema), effort: "medium" },
    messages,
  });

  if (response.stop_reason === "refusal") {
    return {
      error:
        "AI가 이 요청의 처리를 거절했습니다. 사진과 키워드를 확인 후 다시 시도해 주세요.",
    };
  }
  const post = response.parsed_output;
  if (!post) {
    return { error: "글 생성 결과를 해석하지 못했습니다. 다시 시도해 주세요." };
  }
  return {
    draft: { ...post, content: ensureImageMarkers(post.content, mediaUrls) },
  };
}

function aiErrorMessage(err: unknown, where: string): string {
  if (err instanceof Anthropic.RateLimitError) {
    return "AI 사용량 한도에 걸렸습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return "AI 서버에 연결하지 못했습니다. 네트워크 확인 후 다시 시도해 주세요.";
  }
  if (err instanceof Anthropic.APIError) {
    console.error("Anthropic API error:", err.status, err.message);
    return `AI 호출에 실패했습니다 (${err.status ?? "오류"}). 잠시 후 다시 시도해 주세요.`;
  }
  console.error(`${where} error:`, err);
  return err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
}

// ── 서버 액션 ─────────────────────────────────────────────────────────

/** 1단계: 사진 분석 → 글 생성 (저장하지 않음) */
export async function generatePostDraft(
  formData: FormData,
): Promise<DraftResult> {
  try {
    await requireAuth();
    const input = parseSiteInput(formData);
    if ("error" in input) return input;

    return await callClaude(
      [{ role: "user", content: buildInitialContent(input) }],
      input.mediaUrls,
    );
  } catch (err) {
    return { error: aiErrorMessage(err, "generatePostDraft") };
  }
}

/** 2단계(반복 가능): 직전 글 + 수정 요청 → 수정된 글 (저장하지 않음) */
export async function revisePostDraft(
  formData: FormData,
): Promise<DraftResult> {
  try {
    await requireAuth();
    const input = parseSiteInput(formData);
    if ("error" in input) return input;
    const draft = parseDraft(formData);
    if ("error" in draft) return draft;

    const instruction = String(formData.get("instruction") ?? "").trim();
    if (!instruction) return { error: "수정 요청 내용을 입력해 주세요." };
    if (instruction.length > MAX_INSTRUCTION_LENGTH) {
      return {
        error: `수정 요청은 ${MAX_INSTRUCTION_LENGTH}자 이내로 입력해 주세요.`,
      };
    }

    // 원래 요청(사진 포함) → 직전 글 → 수정 요청 순의 대화로 보낸다.
    // 이전 수정 요청들은 직전 글에 이미 반영돼 있으므로 최신 버전만 넘긴다.
    return await callClaude(
      [
        { role: "user", content: buildInitialContent(input) },
        { role: "assistant", content: draftToJson(draft) },
        { role: "user", content: buildRevisionText(instruction) },
      ],
      input.mediaUrls,
    );
  } catch (err) {
    return { error: aiErrorMessage(err, "revisePostDraft") };
  }
}

/** 3단계: 확인된 글 저장 — 발행(공유 링크 + 지메일 임시보관함 메일 포함) 또는 초안 */
export async function publishPostDraft(
  formData: FormData,
): Promise<PublishResult> {
  try {
    await requireAuth();
    const input = parseSiteInput(formData);
    if ("error" in input) return input;
    const draft = parseDraft(formData);
    if ("error" in draft) return draft;
    const status = formData.get("status") === "draft" ? "draft" : "published";

    const admin = createSupabaseAdmin();

    // 중복 저장 방지 — 응답이 끊겨 같은 글을 다시 누른 경우 새로 만들지 않고 기존 글을 돌려준다
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const { data: existing } = await admin
      .from("posts")
      .select("id, slug, status")
      .eq("title", draft.title)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) {
      return {
        slug: existing.slug,
        postId: existing.id,
        title: draft.title,
        status: existing.status === "draft" ? "draft" : "published",
        duplicate: true,
      };
    }

    // 후처리 — slug 고유화, 마커 보정·미디어 치환(미리보기와 같은 함수)
    const slug = await ensureUniqueSlug(draft.slug);
    const finalContent = renderDraftContent(draft.content, input.mediaUrls);
    const thumbnailUrl = input.imageUrls[0] ?? input.mediaUrls[0] ?? null;

    const { data: inserted, error: insertError } = await admin
      .from("posts")
      .insert({
        title: draft.title,
        slug,
        categories: draft.categories,
        excerpt: draft.excerpt,
        content: finalContent,
        thumbnail_url: thumbnailUrl,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("publishPostDraft insert error:", insertError?.message);
      return { error: "글 저장에 실패했습니다. 다시 시도해 주세요." };
    }

    revalidatePostPages(slug);

    // 공유 링크 발급 + 지메일 임시보관함 메일 생성 — 발행 시에만 (실패해도 발행은 유지)
    let draftCreated = false;
    if (status === "published") {
      try {
        const share = await generateShareToken(inserted.id);
        draftCreated = share.draftCreated;
      } catch (shareErr) {
        console.error("share/draft after publish failed:", shareErr);
      }
    }

    return {
      slug,
      postId: inserted.id,
      title: draft.title,
      status,
      draftCreated,
    };
  } catch (err) {
    console.error("publishPostDraft error:", err);
    return {
      error:
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

// ── 헬퍼 ─────────────────────────────────────────────────────────────

/** slug 중복 시 -2, -3… 을 붙여 고유 slug 확보 */
async function ensureUniqueSlug(slug: string): Promise<string> {
  const admin = createSupabaseAdmin();
  let candidate = slug;
  for (let i = 2; i <= 20; i++) {
    const { data } = await admin
      .from("posts")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${slug}-${i}`;
  }
  throw new Error(`슬러그 "${slug}" 중복을 해소하지 못했습니다.`);
}
