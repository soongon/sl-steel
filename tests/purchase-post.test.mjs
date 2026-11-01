import assert from "node:assert/strict";
import test from "node:test";
import { isPurchasePost } from "../lib/purchase-post.ts";

test("매입 기준·철근 매입 카테고리가 있으면 매입 글", () => {
  assert.equal(isPurchasePost(["수거 사례", "매입 기준"]), true);
  assert.equal(isPurchasePost(["업계 정보", "철근 매입"]), true);
  assert.equal(isPurchasePost([" 매입 기준 "]), true);
});

test("납품·시설·업계 글(수거 사례 포함)은 매입 글이 아니다", () => {
  assert.equal(isPurchasePost(["수거 사례", "현장 실무"]), false);
  assert.equal(isPurchasePost(["시설·인프라", "업계 정보"]), false);
  assert.equal(isPurchasePost([]), false);
});
