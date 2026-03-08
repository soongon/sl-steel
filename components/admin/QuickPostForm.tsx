"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/admin";
import MultiImageUpload from "./MultiImageUpload";

interface ParsedPost {
  title: string;
  slug: string;
  categories: string[];
  excerpt: string;
  content: string;
}

function replaceImageMarkers(content: string, imageUrls: string[]): string {
  let result = content;

  imageUrls.forEach((url, i) => {
    const marker = `[사진${i + 1}]`;
    result = result.replace(marker, `![사진 ${i + 1}](${url})`);
  });

  return result;
}

export default function QuickPostForm() {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedPost | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [parseError, setParseError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleParse() {
    setParseError("");
    try {
      let jsonStr = raw.trim();
      const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }

      const data = JSON.parse(jsonStr);

      // categories 배열 또는 category 문자열 호환
      const cats: string[] = Array.isArray(data.categories)
        ? data.categories
        : data.category
          ? [data.category]
          : [];

      if (!data.title || !data.slug || cats.length === 0 || !data.excerpt || !data.content) {
        setParseError("필수 필드가 누락되었습니다: title, slug, categories, excerpt, content");
        return;
      }

      setParsed({
        title: data.title,
        slug: data.slug,
        categories: cats,
        excerpt: data.excerpt,
        content: data.content,
      });
    } catch {
      setParseError("JSON 파싱에 실패했습니다. Claude.ai 출력을 그대로 붙여넣어 주세요.");
    }
  }

  async function handleSubmit() {
    if (!parsed) return;
    setSubmitError("");
    setSubmitting(true);

    try {
      const thumbnailUrl = images[0] ?? "";
      const finalContent = replaceImageMarkers(parsed.content, images);

      const formData = new FormData();
      formData.set("title", parsed.title);
      formData.set("slug", parsed.slug);
      formData.set("categories", JSON.stringify(parsed.categories));
      formData.set("excerpt", parsed.excerpt);
      formData.set("content", finalContent);
      formData.set("thumbnail_url", thumbnailUrl);
      formData.set("status", "draft");
      formData.set("published_at", new Date().toISOString().slice(0, 10));

      await createPost(formData);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSubmitting(false);
    }
  }

  function handleReset() {
    setParsed(null);
    setImages([]);
    setRaw("");
    setParseError("");
    setSubmitError("");
  }

  return (
    <div className="space-y-4">
      {/* 1. 현장 사진 — 항상 표시 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">1. 현장 사진</h3>
        <MultiImageUpload images={images} onChange={setImages} />
      </div>

      {/* 2. JSON 입력 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">2. Claude.ai 출력 붙여넣기</h3>
        <textarea
          id="raw-json"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={10}
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder={'{\n  "title": "포스트 제목",\n  "slug": "post-slug",\n  "categories": ["수거 사례", "현장 실무"],\n  "excerpt": "요약",\n  "content": "## 본문..."\n}'}
        />

        {parseError && (
          <p className="mt-2 text-sm text-red-500">{parseError}</p>
        )}

        {!parsed && (
          <button
            onClick={handleParse}
            disabled={!raw.trim()}
            className="mt-3 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            파싱하기
          </button>
        )}
      </div>

      {/* 3. 파싱 결과 미리보기 */}
      {parsed && (
        <>
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">3. 미리보기</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-steel">제목: </span>
                <span className="text-foreground">{parsed.title}</span>
              </div>
              <div>
                <span className="font-medium text-steel">슬러그: </span>
                <span className="font-mono text-foreground">{parsed.slug}</span>
              </div>
              <div>
                <span className="font-medium text-steel">카테고리: </span>
                <span className="inline-flex flex-wrap gap-1">
                  {parsed.categories.map((cat) => (
                    <span key={cat} className="inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      {cat}
                    </span>
                  ))}
                </span>
              </div>
              <div>
                <span className="font-medium text-steel">요약: </span>
                <span className="text-foreground">{parsed.excerpt}</span>
              </div>
              <div>
                <span className="font-medium text-steel">본문: </span>
                <span className="text-muted">{parsed.content.length}자</span>
              </div>
              {(() => {
                const markerCount = (parsed.content.match(/\[사진\d+\]/g) || []).length;
                return (
                  <>
                    {images.length > 0 && (
                      <div>
                        <span className="font-medium text-steel">썸네일: </span>
                        <span className="text-muted">사진 1</span>
                      </div>
                    )}
                    {markerCount > 0 && (
                      <div>
                        <span className="font-medium text-steel">본문 이미지: </span>
                        <span className={images.length >= markerCount ? "text-green-600" : "text-yellow-600"}>
                          {markerCount}개 마커 / {images.length}장 업로드
                          {images.length < markerCount && " — 사진을 더 업로드하세요"}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-steel transition-colors hover:bg-surface"
            >
              다시 입력
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-lg bg-brand-navy py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {submitting ? "저장 중..." : "초안 저장"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
