/**
 * 블로그 글이 "철근 매입" 관련인지 — /used-rebar 연결 링크 노출 여부에 쓴다.
 *
 * 1) 저자가 붙인 카테고리("매입 기준"/"철근 매입")가 있어야 후보가 된다. "수거 사례"는 납품 글에도 붙어 있어 쓰지 않는다.
 * 2) 그래도 납품 글에 "매입 기준"이 잘못 붙은 데이터가 있어, 서로 독립인 세 신호 중 둘 이상이 "납품 중심"이면 제외한다.
 *    - 제목 앞부분(현장명 작업내용)이 납품이고 매입 언급이 없음
 *    - slug 가 delivery 계열이고 purchase/buyout 이 없음
 *    - 요약(excerpt) 첫 문장이 납품·직납·하역 작업이고 매입 언급이 없음
 *    한 신호만으로는 빼지 않는다 — 제목 문자열 하나에 판정을 맡기지 않기 위해서.
 * 의존성 없는 순수 모듈(테스트 tests/purchase-post.test.mjs).
 */
export const PURCHASE_CATEGORIES = ["매입 기준", "철근 매입"] as const;

export interface PurchasePostInput {
  categories: readonly string[];
  title?: string;
  slug?: string;
  excerpt?: string;
}

/** 납품 중심 신호 개수(0~3) — 테스트·디버깅용으로 노출 */
export function deliverySignals({
  title = "",
  slug = "",
  excerpt = "",
}: PurchasePostInput): number {
  const head = title.split(/\s[—–-]\s/)[0];
  const titleSignal = /납품/.test(head) && !/매입/.test(head);
  const s = slug.toLowerCase();
  const slugSignal =
    /(^|-)delivery(-|$)/.test(s) && !/(purchase|buyout)/.test(s);
  const firstSentence = excerpt.split(/(?<=[.!?。])\s|(?<=다\.)/)[0] ?? "";
  const excerptSignal =
    /(납품|직납|하역)/.test(firstSentence) && !/매입/.test(firstSentence);
  return [titleSignal, slugSignal, excerptSignal].filter(Boolean).length;
}

export function isPurchasePost(input: PurchasePostInput): boolean {
  const tagged = input.categories.some((c) =>
    (PURCHASE_CATEGORIES as readonly string[]).includes(c.trim()),
  );
  if (!tagged) return false;
  return deliverySignals(input) < 2;
}
