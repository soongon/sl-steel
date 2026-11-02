/**
 * 블로그 목록 URL — Pagination 과 /blog canonical 이 같은 표기를 쓰도록 한 곳에서 만든다.
 * BlogHeader·Sidebar 의 카테고리 링크는 같은 규칙(encodeURIComponent, "전체"→/blog)으로 직접 만든다 — 규칙을 바꾸면 함께 수정.
 * 공백은 encodeURIComponent 기준 %20(URLSearchParams 의 + 와 섞이면 같은 페이지가 두 URL 로 갈라진다).
 * 의존성 없는 순수 모듈(테스트 tests/blog-url.test.mjs).
 */
export function blogListPath(category: string, page: number): string {
  const query = [
    category && category !== "전체"
      ? `category=${encodeURIComponent(category)}`
      : null,
    page > 1 ? `page=${page}` : null,
  ]
    .filter(Boolean)
    .join("&");
  return query ? `/blog?${query}` : "/blog";
}
