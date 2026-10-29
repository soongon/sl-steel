"use client";

import { useEffect, useRef, useState } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxComponents } from "@/lib/mdx-components";

interface Props {
  source: string;
}

export default function MdxPreview({ source }: Props) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // 늦게 도착한 이전 요청의 응답이 최신 미리보기를 덮어쓰지 않도록 순번으로 거른다
  const seqRef = useRef(0);

  useEffect(() => {
    if (!source.trim()) {
      seqRef.current++;
      setMdxSource(null);
      setError("");
      setLoading(false);
      return;
    }

    clearTimeout(timerRef.current);
    const seq = ++seqRef.current;
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source }),
        });
        const data = await res.json();
        if (seq !== seqRef.current) return;
        if (data.error) {
          setError(data.error);
          setMdxSource(null);
        } else {
          setMdxSource(data.mdxSource);
        }
      } catch {
        if (seq === seqRef.current) setError("미리보기를 불러올 수 없습니다.");
      } finally {
        if (seq === seqRef.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [source]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-surface px-4 py-2">
        <span className="text-xs font-medium text-steel">
          미리보기 {loading && "— 렌더링 중..."}
        </span>
      </div>
      <div className="blog-content px-6 py-6">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : mdxSource ? (
          <MDXRemote {...mdxSource} components={mdxComponents} />
        ) : (
          <p className="text-sm text-muted">
            내용을 입력하면 미리보기가 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
