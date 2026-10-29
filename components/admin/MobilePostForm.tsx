"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MultiImageUpload from "./MultiImageUpload";
import MdxPreview from "./MdxPreview";
import {
  generatePostDraft,
  publishPostDraft,
  revisePostDraft,
  type PublishResult,
} from "@/lib/generate-post";
import { renderDraftContent } from "@/lib/media-markers";
import { MAX_INSTRUCTION_LENGTH, type PostDraft } from "@/lib/post-draft";

const WORK_TYPES = ["납품", "매입·수거", "가공", "기타"] as const;
const MATERIALS = ["철근", "C형강", "각관", "H빔", "유로폼·거푸집"] as const;
const QUICK_INSTRUCTIONS = [
  "전체 분량을 더 짧게",
  "제목을 다른 느낌으로",
  "사진 설명을 더 자세히",
  "말투를 더 친근하게",
] as const;

// 모바일은 카메라·다른 앱을 오가다 탭이 새로고침되기 쉬워 검토 중인 글을 세션에 보관한다
const STORAGE_KEY = "mobile-post-state-v1";

interface Version {
  draft: PostDraft;
  /** 이 버전을 만든 수정 요청 (최초 생성이면 없음) */
  instruction?: string;
}

/** 글을 생성할 때 쓴 사진·현장 정보 — 검토 중 수정·미리보기·발행은 모두 이 값 기준 */
interface Basis {
  media: string[];
  siteName: string;
  workType: string;
  materials: string[];
  memo: string;
}

type Busy = null | "generate" | "revise" | "publish" | "save";

export default function MobilePostForm() {
  const [media, setMedia] = useState<string[]>([]);
  const [siteName, setSiteName] = useState("");
  const [workType, setWorkType] = useState<string>("납품");
  const [materials, setMaterials] = useState<string[]>(["철근"]);
  const [memo, setMemo] = useState("");

  const [versions, setVersions] = useState<Version[]>([]);
  const [basis, setBasis] = useState<Basis | null>(null);
  const [current, setCurrent] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [instruction, setInstruction] = useState("");

  const [busy, setBusy] = useState<Busy>(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PublishResult | null>(null);
  const [restored, setRestored] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── 세션 보관 (복원 → 저장) ──────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.media)) setMedia(s.media);
        if (typeof s.siteName === "string") setSiteName(s.siteName);
        if (typeof s.workType === "string") setWorkType(s.workType);
        if (Array.isArray(s.materials)) setMaterials(s.materials);
        if (typeof s.memo === "string") setMemo(s.memo);
        if (
          Array.isArray(s.versions) &&
          s.versions.length > 0 &&
          s.basis &&
          Array.isArray(s.basis.media)
        ) {
          setVersions(s.versions);
          setBasis(s.basis);
          setCurrent(
            Math.min(
              Math.max(0, Number(s.current) || 0),
              s.versions.length - 1,
            ),
          );
          setReviewing(Boolean(s.reviewing));
        }
      }
    } catch {
      // 저장소 접근 불가(사생활 보호 모드 등) — 빈 폼으로 시작
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          media,
          siteName,
          workType,
          materials,
          memo,
          versions,
          basis,
          current,
          reviewing,
        }),
      );
    } catch {
      // 무시 — 보관은 편의 기능
    }
  }, [
    restored,
    media,
    siteName,
    workType,
    materials,
    memo,
    versions,
    basis,
    current,
    reviewing,
  ]);

  useEffect(() => {
    if (busy === "generate" || busy === "revise") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [busy]);

  const draft = versions[current]?.draft;
  // 발행과 같은 변환 함수 → 미리보기 = 실제 발행 본문
  const previewSource = useMemo(
    () =>
      draft && basis ? renderDraftContent(draft.content, basis.media) : "",
    [draft, basis],
  );
  const currentInput: Basis = { media, siteName, workType, materials, memo };
  // 생성 이후 사진·정보를 바꿨으면 기존 글로 돌아갈 수 없다 (마커 번호가 어긋남)
  const inputChanged =
    basis !== null && JSON.stringify(basis) !== JSON.stringify(currentInput);

  function toggleMaterial(m: string) {
    setMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  function siteFormData(b: Basis): FormData {
    const formData = new FormData();
    formData.set("siteName", b.siteName);
    formData.set("workType", b.workType);
    formData.set("materials", JSON.stringify(b.materials));
    formData.set("memo", b.memo);
    formData.set("mediaUrls", JSON.stringify(b.media));
    return formData;
  }

  async function run<T>(kind: Busy, action: () => Promise<T>) {
    setError("");
    setBusy(kind);
    try {
      return await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했습니다.");
      return undefined;
    } finally {
      setBusy(null);
    }
  }

  async function handleGenerate() {
    const snapshot = currentInput;
    const res = await run("generate", () =>
      generatePostDraft(siteFormData(snapshot)),
    );
    if (!res) return;
    if (res.error || !res.draft) {
      setError(res.error ?? "글 생성에 실패했습니다.");
      return;
    }
    setBasis(snapshot);
    setVersions([{ draft: res.draft }]);
    setCurrent(0);
    setInstruction("");
    setReviewing(true);
    window.scrollTo({ top: 0 });
  }

  async function handleRevise() {
    if (!draft || !basis || !instruction.trim()) return;
    const asked = instruction.trim();
    const formData = siteFormData(basis);
    formData.set("draft", JSON.stringify(draft));
    formData.set("instruction", asked);
    const res = await run("revise", () => revisePostDraft(formData));
    if (!res) return;
    if (res.error || !res.draft) {
      setError(res.error ?? "글 수정에 실패했습니다.");
      return;
    }
    const next = [...versions, { draft: res.draft, instruction: asked }];
    setVersions(next);
    setCurrent(next.length - 1);
    setInstruction("");
  }

  async function handleSave(status: "published" | "draft") {
    if (!draft || !basis) return;
    const formData = siteFormData(basis);
    formData.set("draft", JSON.stringify(draft));
    formData.set("status", status);
    const res = await run(status === "published" ? "publish" : "save", () =>
      publishPostDraft(formData),
    );
    if (!res) return;
    if (res.error || !res.slug) {
      setError(res.error ?? "저장에 실패했습니다.");
      return;
    }
    setResult(res);
    reset();
  }

  function reset() {
    setMedia([]);
    setSiteName("");
    setMemo("");
    setVersions([]);
    setBasis(null);
    setCurrent(0);
    setInstruction("");
    setReviewing(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // 무시
    }
  }

  function appendQuick(text: string) {
    setInstruction((prev) => (prev.trim() ? `${prev.trim()}\n${text}` : text));
  }

  const errorBox = error && (
    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
    </p>
  );

  // ── 완료 화면 ──────────────────────────────────────────────────────
  if (result?.slug) {
    const published = result.status === "published";
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 text-center">
        <div className="text-4xl">{published ? "✅" : "📝"}</div>
        <p className="text-sm font-semibold text-foreground">
          {published ? "블로그에 발행됐습니다" : "초안으로 저장됐습니다"}
        </p>
        <p className="text-sm text-steel">{result.title}</p>
        {result.duplicate ? (
          <p className="rounded-lg bg-surface px-3 py-2 text-xs text-steel">
            ℹ️ 같은 글이 방금 이미 저장돼 있어 새로 만들지 않았습니다
          </p>
        ) : (
          published &&
          (result.draftCreated ? (
            <p className="rounded-lg bg-surface px-3 py-2 text-xs text-steel">
              ✉️ 지메일 임시보관함에 공유 메일이 생성됐습니다
            </p>
          ) : (
            <p className="rounded-lg bg-surface px-3 py-2 text-xs text-steel">
              ⚠️ 공유 메일 생성에 실패했습니다 — 수정 페이지의 &quot;링크
              다시보내기&quot;로 재시도할 수 있습니다
            </p>
          ))
        )}
        <div className="flex flex-col gap-2">
          {published && (
            <Link
              href={`/blog/${result.slug}`}
              className="rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white"
            >
              발행된 글 보기
            </Link>
          )}
          <Link
            href={`/admin/posts/${result.postId}/edit`}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel"
          >
            {published ? "수정하기" : "초안 열기"}
          </Link>
          <button
            onClick={() => setResult(null)}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel"
          >
            새 글 작성
          </button>
        </div>
      </div>
    );
  }

  // ── 검토·수정 화면 ─────────────────────────────────────────────────
  if (reviewing && draft && basis) {
    const locked = busy !== null;
    return (
      <div className="space-y-4">
        {/* 버전 */}
        {versions.length > 1 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-xs font-semibold text-steel">
              버전 — 눌러서 이전 버전으로 돌아갈 수 있습니다
            </p>
            <div className="flex flex-wrap gap-2">
              {versions.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={locked}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                    i === current
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-steel"
                  }`}
                >
                  v{i + 1}
                  {i === 0 ? " 최초" : ""}
                </button>
              ))}
            </div>
            {versions[current]?.instruction && (
              <p className="mt-2 line-clamp-2 text-xs text-steel">
                요청: {versions[current].instruction}
              </p>
            )}
          </div>
        )}

        {/* 생성된 글 */}
        <div className="space-y-2 rounded-xl border border-border bg-card p-4">
          <p className="text-base font-bold text-foreground">{draft.title}</p>
          <p className="text-xs text-steel">{draft.excerpt}</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-surface px-2.5 py-1 text-xs text-steel"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <MdxPreview source={previewSource} />

        {/* 수정 요청 */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <label
            htmlFor="instruction"
            className="block text-sm font-semibold text-foreground"
          >
            수정 요청{" "}
            <span className="font-normal text-steel">
              (v{current + 1} 기준으로 고칩니다)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_INSTRUCTIONS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={locked}
                onClick={() => appendQuick(q)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-steel disabled:opacity-40"
              >
                + {q}
              </button>
            ))}
          </div>
          <textarea
            id="instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            maxLength={MAX_INSTRUCTION_LENGTH}
            rows={3}
            disabled={locked}
            placeholder="예: 두 번째 문단에 '야간 하차'였다는 내용 추가해줘"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          />
          <button
            onClick={handleRevise}
            disabled={locked || !instruction.trim()}
            className="w-full rounded-lg border border-accent px-4 py-3 text-sm font-semibold text-accent transition-opacity disabled:opacity-40"
          >
            {busy === "revise"
              ? `수정 중… ${elapsed}초`
              : "이 요청대로 글 수정하기"}
          </button>
        </div>

        {/* 저장 */}
        {errorBox}
        <button
          onClick={() => handleSave("published")}
          disabled={locked}
          className="w-full rounded-xl bg-accent px-4 py-4 text-base font-bold text-white transition-opacity disabled:opacity-40"
        >
          {busy === "publish" ? "발행 중…" : `v${current + 1} 이대로 발행하기`}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={locked}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel disabled:opacity-40"
          >
            {busy === "save" ? "저장 중…" : "초안으로 저장"}
          </button>
          <button
            onClick={() => {
              setError("");
              setReviewing(false);
            }}
            disabled={locked}
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel disabled:opacity-40"
          >
            사진·정보 고치기
          </button>
        </div>
      </div>
    );
  }

  // ── 입력 화면 ──────────────────────────────────────────────────────
  const canGenerate =
    busy === null && siteName.trim().length > 0 && media.length > 0;

  return (
    <div className="space-y-4">
      {/* 생성 중에는 사진·정보를 잠근다 — AI가 본 사진 번호와 어긋나지 않도록 */}
      <fieldset
        disabled={busy !== null}
        className="space-y-4 disabled:pointer-events-none disabled:opacity-60"
      >
        {/* 1. 사진 */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-1 text-sm font-semibold text-foreground">
            1. 현장 사진·동영상
          </h3>
          <p className="mb-3 text-xs text-steel">
            작업 흐름 순서(상차→운송→하역)로 올리면 글 순서가 맞습니다
          </p>
          <MultiImageUpload images={media} onChange={setMedia} />
        </div>

        {/* 2. 현장 정보 */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div>
            <label
              htmlFor="site-name"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
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
            <p className="mb-1.5 text-sm font-semibold text-foreground">
              작업 종류
            </p>
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
            <p className="mb-1.5 text-sm font-semibold text-foreground">
              자재 (복수 선택)
            </p>
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
            <label
              htmlFor="memo"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
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
      </fieldset>

      {/* 3. 실행 */}
      {errorBox}
      {versions.length > 0 &&
        busy === null &&
        (inputChanged ? (
          <p className="rounded-lg bg-surface px-4 py-3 text-xs text-steel">
            사진·현장 정보가 바뀌어 기존 글(v1~v{versions.length})로는 돌아갈 수
            없습니다. 그대로 되돌리거나 새로 생성해 주세요.
          </p>
        ) : (
          <button
            onClick={() => setReviewing(true)}
            className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-steel"
          >
            ← 생성한 글로 돌아가기 (v{current + 1})
          </button>
        ))}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full rounded-xl bg-accent px-4 py-4 text-base font-bold text-white transition-opacity disabled:opacity-40"
      >
        {busy === "generate"
          ? `글 생성 중… ${elapsed}초 (30초 안팎 걸립니다)`
          : versions.length > 0
            ? "사진 분석 → 글 새로 생성"
            : "사진 분석 → 글 생성"}
      </button>
      {busy === null && (
        <p className="text-center text-xs text-steel">
          {versions.length > 0
            ? "새로 생성하면 지금까지의 버전은 사라집니다."
            : "AI가 글을 쓰면 미리보기로 확인하고, 원하는 대로 고쳐 달라고 한 뒤 발행합니다."}
        </p>
      )}
    </div>
  );
}
