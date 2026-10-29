import { stripOrphanMarkers } from "./post-draft";
import { isVideoUrl } from "./types";

/**
 * 본문의 [사진N] 마커를 업로드된 미디어로 치환한다.
 * - 이미지: `![사진 N](url)` 마크다운으로 치환
 * - 동영상: `<video>` 태그로 치환, 마커가 없으면 본문 끝 "현장 영상" 섹션에 자동 추가
 * QuickPostForm(수동 붙여넣기)과 generate-post(모바일 자동 생성)가 공유한다.
 */
export function replaceMediaMarkers(
  content: string,
  mediaUrls: string[],
): string {
  let result = content;
  const unmatchedVideos: string[] = [];

  mediaUrls.forEach((url, i) => {
    const marker = `[사진${i + 1}]`;
    const hasMarker = result.includes(marker);

    if (isVideoUrl(url)) {
      const videoTag = `<video src="${url}" controls playsInline preload="metadata" />`;
      if (hasMarker) {
        result = result.replace(marker, videoTag);
      } else {
        // 마커 없는 동영상 → 나중에 본문 끝에 추가
        unmatchedVideos.push(videoTag);
      }
    } else {
      if (hasMarker) {
        result = result.replace(marker, `![사진 ${i + 1}](${url})`);
      }
    }
  });

  // 마커에 매칭되지 않은 동영상을 본문 끝에 추가
  if (unmatchedVideos.length > 0) {
    result += "\n\n---\n\n## 현장 영상\n\n" + unmatchedVideos.join("\n\n");
  }

  return result;
}

/** 빠진 이미지 마커를 본문 끝(마무리 섹션 앞)에 보충해 사진 유실을 막는다 */
export function ensureImageMarkers(
  content: string,
  mediaUrls: string[],
): string {
  const missing: string[] = [];
  mediaUrls.forEach((url, i) => {
    if (!isVideoUrl(url) && !content.includes(`[사진${i + 1}]`)) {
      missing.push(`[사진${i + 1}]`);
    }
  });
  if (missing.length === 0) return content;

  const extra = `\n\n${missing.join("\n\n")}\n`;
  // 마무리(매입 안내) 섹션 앞에 삽입, 못 찾으면 끝에 추가
  const closingIdx = content.lastIndexOf("\n## 공사 후 남은 철근");
  if (closingIdx > 0) {
    return content.slice(0, closingIdx) + extra + content.slice(closingIdx);
  }
  return content + extra;
}

/**
 * 모바일 포스팅 초안 본문 → 최종 MDX. 검토 화면 미리보기와 발행(publishPostDraft)이
 * 반드시 같은 결과를 내도록 이 함수 하나로만 변환한다.
 */
export function renderDraftContent(
  content: string,
  mediaUrls: string[],
): string {
  return replaceMediaMarkers(
    ensureImageMarkers(
      stripOrphanMarkers(content, mediaUrls.length),
      mediaUrls,
    ),
    mediaUrls,
  );
}
