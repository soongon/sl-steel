import { isVideoUrl } from "./types";

/**
 * 본문의 [사진N] 마커를 업로드된 미디어로 치환한다.
 * - 이미지: `![사진 N](url)` 마크다운으로 치환
 * - 동영상: `<video>` 태그로 치환, 마커가 없으면 본문 끝 "현장 영상" 섹션에 자동 추가
 * QuickPostForm(수동 붙여넣기)과 generate-post(모바일 자동 생성)가 공유한다.
 */
export function replaceMediaMarkers(content: string, mediaUrls: string[]): string {
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
