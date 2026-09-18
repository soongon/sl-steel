import { isVideoUrl, extractFilename } from "./types";

export interface MediaItem {
  url: string;
  filename: string;
  type: "image" | "video";
}

export interface ParsedShareContent {
  plainText: string;
  images: MediaItem[];
  videos: MediaItem[];
}

/**
 * MDX 콘텐츠를 공유용 순수 텍스트로 변환.
 * - 이미지/동영상 위치를 [실제파일명.확장자]로 표시
 * - 마크다운 문법 제거
 */
export function parseContentForShare(mdxContent: string): ParsedShareContent {
  const images: MediaItem[] = [];
  const videos: MediaItem[] = [];
  let text = mdxContent;

  // 1. ![alt](url) → [filename.jpg]
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, _alt, url) => {
    const filename = extractFilename(url);
    if (isVideoUrl(url)) {
      videos.push({ url, filename, type: "video" });
    } else {
      images.push({ url, filename, type: "image" });
    }
    return `[${filename}]`;
  });

  // 2. <video src="url" ... /> → [filename.mp4]
  text = text.replace(/<video\s+[^>]*src="([^"]+)"[^>]*\/?>/g, (_, url) => {
    const filename = extractFilename(url);
    videos.push({ url, filename, type: "video" });
    return `[${filename}]`;
  });

  // 3. 마크다운 문법 제거
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^---$/gm, "")
    .replace(/^[-*+]\s+/gm, "• ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { plainText: text, images, videos };
}

/**
 * Cloudinary 변환 세그먼트 판별: "키_값" 쌍의 콤마 목록 (예: f_auto,q_auto,w_800)
 * 폴더(blog/)나 버전(v1234/) 세그먼트는 매칭하지 않는다.
 */
const TRANSFORM_SEGMENT = /\/upload\/[a-z]+_[^,/]+(?:,[a-z]+_[^,/]+)*\//;

/** Cloudinary 다운로드 URL 생성 (fl_attachment + 최적화 제거) */
export function getDownloadUrl(url: string): string {
  // 이미지: /upload/f_auto,q_auto,w_800/ → /upload/fl_attachment/
  const replaced = url.replace(TRANSFORM_SEGMENT, "/upload/fl_attachment/");
  if (replaced !== url) return replaced;
  // 동영상 등 변환 없는 경우: /upload/ → /upload/fl_attachment/
  return url.replace("/upload/", "/upload/fl_attachment/");
}

/** ZIP용 원본 URL (최적화 파라미터 제거) */
export function getOriginalUrl(url: string): string {
  const cleaned = url.replace(TRANSFORM_SEGMENT, "/upload/");
  return cleaned !== url ? cleaned : url;
}

// ── 네이버 블로그 붙여넣기용 HTML 변환 ──────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 인라인 마크다운 → HTML (escape 이후에 호출) */
function inlineToHtml(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<s>$1</s>")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // 링크는 텍스트만 (네이버 링크 카드 방지)
}

/**
 * MDX 본문 → 네이버 스마트에디터ONE 붙여넣기용 리치 HTML.
 * - 이미지는 <img src>로 포함 → 붙여넣기 시 네이버가 자동 업로드
 * - 동영상은 붙여넣기가 불가능하므로 안내 문구로 대체 (별도 업로드)
 */
export function mdxToNaverHtml(mdxContent: string): string {
  // 1. 동영상 태그 → 안내 문구 (escape 전에 처리)
  let src = mdxContent.replace(/<video\s+[^>]*src="([^"]+)"[^>]*\/?>/g, (_, url) => {
    const filename = extractFilename(url);
    return `▶ 현장 영상 (${filename}) — 공유 페이지에서 다운로드 후 이 위치에 업로드해 주세요`;
  });

  // 2. HTML 특수문자 이스케이프
  src = escapeHtml(src);

  // 3. 블록 단위 변환
  const blocks = src.split(/\n{2,}/);
  const html = blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (/^###\s+/.test(b)) return `<h3>${inlineToHtml(b.replace(/^###\s+/, ""))}</h3>`;
      if (/^##\s+/.test(b)) return `<h2>${inlineToHtml(b.replace(/^##\s+/, ""))}</h2>`;
      if (/^#\s+/.test(b)) return `<h2>${inlineToHtml(b.replace(/^#\s+/, ""))}</h2>`;
      if (/^---+$/.test(b)) return "<hr>";
      if (/^[-*+]\s+/m.test(b)) {
        const items = b
          .split("\n")
          .map((line) => line.replace(/^[-*+]\s+/, "").trim())
          .filter(Boolean)
          .map((line) => `<li>${inlineToHtml(line)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      // 일반 문단 — 줄바꿈은 <br>
      return `<p>${b.split("\n").map(inlineToHtml).join("<br>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}
