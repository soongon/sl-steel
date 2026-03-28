"use client";

import { useState } from "react";
import Image from "next/image";
import type { ParsedShareContent, MediaItem } from "@/lib/share-utils";
import { getDownloadUrl, getOriginalUrl } from "@/lib/share-utils";

interface Props {
  title: string;
  parsed: ParsedShareContent;
}

async function downloadFile(item: MediaItem) {
  try {
    const res = await fetch(getOriginalUrl(item.url));
    if (!res.ok) throw new Error("다운로드 실패");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = item.filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    alert(`${item.filename} 다운로드에 실패했습니다.`);
  }
}

export default function SharePageClient({ title, parsed }: Props) {
  const [copied, setCopied] = useState<"title" | "text" | null>(null);
  const [zipping, setZipping] = useState(false);

  const allMedia = [...parsed.images, ...parsed.videos];

  async function copyToClipboard(text: string, type: "title" | "text") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  }

  async function downloadAllAsZip() {
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      await Promise.all(
        allMedia.map(async (item) => {
          const res = await fetch(getOriginalUrl(item.url));
          if (!res.ok) throw new Error(`${item.filename} 다운로드 실패`);
          const blob = await res.blob();
          zip.file(item.filename, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = `${title}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("ZIP 다운로드에 실패했습니다. 개별 다운로드를 이용해 주세요.");
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">SL Steel 콘텐츠 공유</p>
        </div>

        {/* 제목 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <button
              onClick={() => copyToClipboard(title, "title")}
              className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {copied === "title" ? "복사됨!" : "제목 복사"}
            </button>
          </div>
        </div>

        {/* 본문 텍스트 */}
        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">본문</h2>
            <button
              onClick={() => copyToClipboard(parsed.plainText, "text")}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {copied === "text" ? "복사됨!" : "전체 복사"}
            </button>
          </div>
          <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-surface p-4 text-sm leading-relaxed text-foreground">
            {parsed.plainText}
          </pre>
          <p className="mt-2 text-xs text-muted">
            [파일명.확장자] 표시된 위치에 해당 사진/동영상을 삽입해 주세요.
          </p>
        </div>

        {/* 사진 */}
        {parsed.images.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              사진 ({parsed.images.length}장)
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {parsed.images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-border">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={img.url}
                      alt={img.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-card px-3 py-2">
                    <span className="truncate text-xs font-medium text-foreground">{img.filename}</span>
                    <a
                      href={getDownloadUrl(img.url)}
                      className="shrink-0 rounded bg-accent px-2.5 py-1 text-xs font-semibold text-white hover:bg-accent-dark"
                    >
                      다운로드
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 동영상 */}
        {parsed.videos.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              동영상 ({parsed.videos.length}개)
            </h2>
            <div className="space-y-3">
              {parsed.videos.map((vid, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-border">
                  <video
                    src={vid.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full"
                  />
                  <div className="flex items-center justify-between bg-card px-3 py-2">
                    <span className="truncate text-xs font-medium text-foreground">{vid.filename}</span>
                    <button
                      onClick={() => downloadFile(vid)}
                      className="shrink-0 rounded bg-accent px-2.5 py-1 text-xs font-semibold text-white hover:bg-accent-dark"
                    >
                      다운로드
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전체 다운로드 */}
        {allMedia.length > 0 && (
          <div className="mt-4">
            <button
              onClick={downloadAllAsZip}
              disabled={zipping}
              className="w-full rounded-xl border border-border bg-card py-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface disabled:opacity-50"
            >
              {zipping ? "ZIP 생성 중..." : `전체 다운로드 (${allMedia.length}개 파일)`}
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          이 페이지는 공유 전용입니다. 링크를 받은 분만 접근할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
