import assert from "node:assert/strict";
import test from "node:test";
import { isPurchasePost } from "../lib/purchase-post.ts";

test("매입 기준·철근 매입 카테고리가 있으면 매입 글", () => {
  assert.equal(isPurchasePost(["수거 사례", "매입 기준"]), true);
  assert.equal(isPurchasePost(["업계 정보", "철근 매입"]), true);
  assert.equal(isPurchasePost([" 매입 기준 "]), true);
  assert.equal(
    isPurchasePost(
      ["수거 사례", "매입 기준"],
      "위례 포스코 현장 잔여철근 매입 — 8m 정척·단척 묶음 당일 수거",
    ),
    true,
  );
  assert.equal(
    isPurchasePost(
      ["업계 정보", "철근 매입"],
      "철근 레이저 녹 제거 작업 — 녹슨 철근을 새것처럼 복원하는 과정",
    ),
    true,
  );
});

test("납품·시설·업계 글(수거 사례 포함)은 매입 글이 아니다", () => {
  assert.equal(isPurchasePost(["수거 사례", "현장 실무"]), false);
  assert.equal(isPurchasePost(["시설·인프라", "업계 정보"]), false);
  assert.equal(isPurchasePost([]), false);
});

test("매입 기준 카테고리가 잘못 붙은 납품 글은 제목으로 걸러낸다", () => {
  assert.equal(
    isPurchasePost(
      ["수거 사례", "현장 실무", "매입 기준"],
      "울산 공장 증축 현장 철근 납품 — 우천 속 2층 슬라브 크레인 직상 하역",
    ),
    false,
  );
  assert.equal(
    isPurchasePost(
      ["수거 사례", "현장 실무", "매입 기준"],
      "동천 LH주택 현장 철근 납품 — 주택가 도로변 카고크레인 하역, 잔여철근 매입까지",
    ),
    false,
  );
  // 제목 앞부분에 매입이 함께 있으면 유지
  assert.equal(
    isPurchasePost(["매입 기준"], "철근 매입·납품 현장 — 부제"),
    true,
  );
});
