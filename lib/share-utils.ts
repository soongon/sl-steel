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

/** Cloudinary 다운로드 URL 생성 (fl_attachment + 최적화 제거) */
export function getDownloadUrl(url: string): string {
  // 이미지: /upload/f_auto,q_auto,w_800/ → /upload/fl_attachment/
  const replaced = url.replace(/\/upload\/[a-z_,0-9]+\//, "/upload/fl_attachment/");
  if (replaced !== url) return replaced;
  // 동영상 등 변환 없는 경우: /upload/ → /upload/fl_attachment/
  return url.replace("/upload/", "/upload/fl_attachment/");
}

/** ZIP용 원본 URL (최적화 파라미터 제거) */
export function getOriginalUrl(url: string): string {
  const cleaned = url.replace(/\/upload\/[a-z_,0-9]+\//, "/upload/");
  return cleaned !== url ? cleaned : url;
}
