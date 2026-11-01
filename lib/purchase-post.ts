/**
 * 블로그 글이 "철근 매입" 관련인지 — 카테고리 기준. /used-rebar 연결 링크 노출 여부에 쓴다.
 * "수거 사례"는 납품 글에도 붙어 있어 기준으로 쓰지 않는다. 의존성 없는 순수 모듈(테스트 tests/purchase-post.test.mjs).
 */
export const PURCHASE_CATEGORIES = ["매입 기준", "철근 매입"] as const;

export function isPurchasePost(categories: readonly string[]): boolean {
  return categories.some((c) =>
    (PURCHASE_CATEGORIES as readonly string[]).includes(c.trim()),
  );
}
