/**
 * 블로그 글이 "철근 매입" 관련인지 — 카테고리 + 제목 기준. /used-rebar 연결 링크 노출 여부에 쓴다.
 * "수거 사례"는 납품 글에도 붙어 있어 기준으로 쓰지 않는다. 의존성 없는 순수 모듈(테스트 tests/purchase-post.test.mjs).
 */
export const PURCHASE_CATEGORIES = ["매입 기준", "철근 매입"] as const;

export function isPurchasePost(
  categories: readonly string[],
  title = "",
): boolean {
  const tagged = categories.some((c) =>
    (PURCHASE_CATEGORIES as readonly string[]).includes(c.trim()),
  );
  if (!tagged) return false;
  // 납품 글에 "매입 기준"이 잘못 붙은 데이터 보정 — 제목 앞부분("현장명 작업내용")이 납품이고 매입 언급이 없으면 제외
  const head = title.split(/\s[—–-]\s/)[0];
  return !(/납품/.test(head) && !/매입/.test(head));
}
