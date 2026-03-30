"use client";

import { useState, useEffect } from "react";
import { generateShareToken } from "@/lib/admin";
import { formatDate } from "@/lib/types";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
      type === "success" ? "bg-green-600" : "bg-red-500"
    }`}>
      {type === "success" ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  );
}

interface Props {
  postId: string;
  existingToken: string | null;
  expiresAt: string | null;
}

export default function ShareLinkButton({ postId, existingToken, expiresAt }: Props) {
  const [token, setToken] = useState(existingToken);
  const [expires, setExpires] = useState(expiresAt);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isExpired = expires ? new Date(expires) < new Date() : true;
  const shareUrl = token && typeof window !== "undefined"
    ? `${window.location.origin}/share/${token}`
    : null;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await generateShareToken(postId);
      setToken(result.token);
      setExpires(result.expiresAt);
      if (result.draftCreated) {
        setToast({ message: "Gmail 임시보관함에 메일이 생성되었습니다", type: "success" });
      }
    } catch {
      alert("공유 링크 생성에 실패했습니다.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  }

  const toastEl = toast && (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  );

  // 토큰 없거나 만료 → 생성/재생성 버튼
  if (!token || isExpired) {
    return (
      <>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
        >
          {generating ? "생성 중..." : token ? "공유 링크 재생성" : "공유 링크 생성"}
        </button>
        {toastEl}
      </>
    );
  }

  // 유효한 토큰 → 링크 표시 + 복사 + 만료일
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        >
          {copied ? "복사됨!" : "공유 링크 복사"}
        </button>
        <span className="text-xs text-muted">
          만료: {formatDate(expires ?? "")}
        </span>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="text-xs text-muted hover:text-foreground"
          title="링크 재생성"
        >
          재생성
        </button>
      </div>
      {toastEl}
    </>
  );
}
