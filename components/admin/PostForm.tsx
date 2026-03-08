"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUpload from "./CloudinaryUpload";
import MdxPreview from "./MdxPreview";
import type { AdminPost, Category } from "@/lib/admin";

interface Props {
  post?: AdminPost;
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
}

function toSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^가-힣a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostForm({ post, categories, action }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!post);
  const [category, setCategory] = useState(post?.category ?? categories[0]?.name ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url ?? "");
  const [status, setStatus] = useState(post?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  );
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual) {
      setSlug(toSlug(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", slug);
      formData.set("category", category);
      formData.set("excerpt", excerpt);
      formData.set("content", content);
      formData.set("thumbnail_url", thumbnailUrl);
      formData.set("status", status);
      formData.set("published_at", publishedAt);

      await action(formData);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* 왼쪽: 메인 콘텐츠 */}
        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-foreground">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="포스트 제목"
            />
          </div>

          {/* 슬러그 */}
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium text-foreground">
              슬러그
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManual(true);
              }}
              required
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="post-url-slug"
            />
          </div>

          {/* 요약 */}
          <div>
            <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-foreground">
              요약
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="포스트 요약 (목록에 표시됩니다)"
            />
          </div>

          {/* 썸네일 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              썸네일
            </label>
            <CloudinaryUpload value={thumbnailUrl} onChange={setThumbnailUrl} />
          </div>

          {/* MDX 에디터 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="content" className="text-sm font-medium text-foreground">
                본문 (MDX)
              </label>
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="text-xs text-accent hover:text-accent-dark"
              >
                {showPreview ? "미리보기 닫기" : "미리보기"}
              </button>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full resize-y rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="MDX 형식으로 본문을 작성하세요..."
            />
          </div>

          {/* MDX 미리보기 */}
          {showPreview && <MdxPreview source={content} />}
        </div>

        {/* 오른쪽: 사이드바 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">게시 설정</h3>

            {/* 상태 */}
            <div className="mb-3">
              <label htmlFor="status" className="mb-1 block text-xs font-medium text-steel">
                상태
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="draft">초안</option>
                <option value="published">발행</option>
              </select>
            </div>

            {/* 카테고리 */}
            <div className="mb-3">
              <label htmlFor="category" className="mb-1 block text-xs font-medium text-steel">
                카테고리
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 발행일 */}
            <div className="mb-4">
              <label htmlFor="published_at" className="mb-1 block text-xs font-medium text-steel">
                발행일
              </label>
              <input
                id="published_at"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {error && (
              <p className="mb-3 text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {submitting ? "저장 중..." : post ? "수정 저장" : "포스트 저장"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
