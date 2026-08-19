"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MultiImageUpload from "./MultiImageUpload";
import { generateAndPublishPost, type GenerateResult } from "@/lib/generate-post";

const WORK_TYPES = ["납품", "매입·수거", "가공", "기타"] as const;
const MATERIALS = ["철근", "C형강", "각관", "H빔", "유로폼·거푸집"] as const;

export default function MobilePostForm() {
  const [media, setMedia] = useState<string[]>([]);
  const [siteName, setSiteName] = useState("");
  const [workType, setWorkType] = useState<string>("납품");
  const [materials, setMaterials] = useState<string[]>(["철근"]);
  const [memo, setMemo] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (submitting) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitting]);

  function toggleMaterial(m: string) {
    setMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function handleSubmit() {
    setResult(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("siteName", siteName);
      formData.set("workType", workType);
      formData.set("materials", JSON.stringify(materials));
      formData.set("memo", memo);
      formData.set("mediaUrls", JSON.stringify(media));
      const res = await generateAndPublishPost(formData);
      setResult(res);
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "요청에 실패했습니다." });
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !submitting && siteName.trim().length > 0 && media.length > 0;

  // ── 완료 화면 ──────────────────────────────────────────────────────
  if (result?.slug) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 text-center">
        <div className="text-4xl">✅</div>
        <p className="text-sm font-semibold text-foreground">블로그에 발행됐습니다</p>
        <p className="text-sm text-steel">{result.title}</p>
        <div className="flex flex-col gap-2">
          <Link
            href={`/blog/${result.slug}`}
            className="rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white"
          >
            발행된 글 보기
          </Link>
          <Link
            href={`/admin/posts/${result.postId}/edit`}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel"
          >
            수정하기
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setMedia([]);
              setSiteName("");
              setMemo("");
            }}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel"
          >
            새 글 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. 사진 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-1 text-sm font-semibold text-foreground">1. 현장 사진·동영상</h3>
        <p className="mb-3 text-xs text-steel">작업 흐름 순서(상차→운송→하역)로 올리면 글 순서가 맞습니다</p>
        <MultiImageUpload images={media} onChange={setMedia} />
      </div>

      {/* 2. 현장 정보 */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        <div>
          <label htmlFor="site-name" className="mb-1.5 block text-sm font-semibold text-foreground">
            2. 현장명 <span className="text-red-500">*</span>
          </label>
          <input
            id="site-name"
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="예: 김천 상가 신축"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">작업 종류</p>
          <div className="flex flex-wrap gap-2">
            {WORK_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setWorkType(t)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  workType === t
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-steel"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">자재 (복수 선택)</p>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMaterial(m)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  materials.includes(m)
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-steel"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="memo" className="mb-1.5 block text-sm font-semibold text-foreground">
            현장 메모 <span className="font-normal text-steel">(선택)</span>
          </label>
          <input
            id="memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 좁은 골목이라 5톤으로 진입"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* 3. 실행 */}
      {result?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{result.error}</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-accent px-4 py-4 text-base font-bold text-white transition-opacity disabled:opacity-40"
      >
        {submitting ? `글 생성 중… ${elapsed}초 (30초 안팎 걸립니다)` : "사진 분석 → 글 생성 → 바로 발행"}
      </button>
      {!submitting && (
        <p className="text-center text-xs text-steel">
          AI가 사진을 분석해 글을 쓰고 블로그에 바로 게시합니다. 발행 후 수정할 수 있습니다.
        </p>
      )}
    </div>
  );
}
