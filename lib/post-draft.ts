/**
 * 모바일 포스팅의 생성 → 검토·수정 → 발행 흐름에서 쓰는 순수 헬퍼.
 * "use server" 파일(generate-post.ts)은 async 함수만 export 할 수 있어 여기로 분리했다.
 */

/** AI가 만든 글 (본문은 아직 [사진N] 마커 상태 — 발행 시 실제 미디어로 치환) */
export interface PostDraft {
  title: string;
  slug: string;
  categories: string[];
  excerpt: string;
  content: string;
}

/** 수정 요청 프롬프트 최대 길이 */
export const MAX_INSTRUCTION_LENGTH = 2000;

/** 직전 버전을 assistant 턴으로 되돌려 줄 때 쓰는 JSON (스키마 필드만) */
export function draftToJson(draft: PostDraft): string {
  const { title, slug, categories, excerpt, content } = draft;
  return JSON.stringify({ title, slug, categories, excerpt, content });
}

/** 사진을 지운 뒤 남은 [사진N] 마커(N > 미디어 수)를 제거한다 — 본문에 글자로 노출되지 않도록 */
export function stripOrphanMarkers(
  content: string,
  mediaCount: number,
): string {
  return content
    .replace(/\[사진(\d+)\]/g, (m, n) => (Number(n) > mediaCount ? "" : m))
    .replace(/\n{3,}/g, "\n\n");
}
