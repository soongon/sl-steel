import assert from "node:assert/strict";
import test from "node:test";
import { isPurchasePost, deliverySignals } from "../lib/purchase-post.ts";

// 운영 DB 의 실제 값(2026-11 기준) — 매입 기준/철근 매입 카테고리가 붙은 11건
const TAGGED = [
  {
    slug: "bucheon-gym-rebar-purchase-11ton",
    title:
      "부천 체육관 현장 잔여철근 11톤 매입 — 지게차 상차로 당일 현장 직수거",
    excerpt:
      "부천 체육관 신축 현장에서 골조 마무리 후 남은 잔여철근 11톤을 지게차 상차로 당일 수거했습니다.",
    categories: ["수거 사례", "매입 기준"],
    purchase: true,
  },
  {
    slug: "pohang-highschool-rebar-purchase",
    title:
      "포항 고등학교 현장 잔여철근 매입 — 비 오는 날 카고크레인으로 현장 직수거",
    excerpt:
      "포항 고등학교 신축 현장에 남은 잔여철근을 비 오는 날 카고크레인으로 상차해 수거한 사례입니다.",
    categories: ["수거 사례", "매입 기준"],
    purchase: true,
  },
  {
    slug: "jincheon-rebar-factory-purchase",
    title:
      "충북 진천 가공공장 잔여 철근 매입 — 이틀간 120톤, 계근 후 즉시 현금 정산",
    excerpt:
      "충북 진천 철근 가공공장에 보관돼 있던 잔여철근 120톤을 이틀에 나눠 매입한 현장입니다.",
    categories: ["수거 사례", "매입 기준"],
    purchase: true,
  },
  {
    slug: "wirye-posco-site-rebar-purchase",
    title: "위례 포스코 현장 잔여철근 매입 — 8m 정척·단척 묶음 당일 수거",
    excerpt:
      "위례 포스코 현장에 남은 잔여철근을 당일 배차로 수거한 작업 기록입니다.",
    categories: ["수거 사례", "매입 기준"],
    purchase: true,
  },
  {
    slug: "ulsan-10m-rebar-120ton-purchase",
    title:
      "울산 10미터 정척 철근 120톤 매입 — 크레인 상차·현금 정산으로 당일 수거",
    excerpt:
      "울산 현장에 야적돼 있던 10미터 정척 철근 120톤을 카고크레인으로 상차해 수거한 사례입니다.",
    categories: ["수거 사례", "매입 기준"],
    purchase: true,
  },
  {
    slug: "buan-jeonbuk-used-rebar-purchase-200ton",
    title: "전북 부안 잔여철근 200톤 매입 — 사비 먹은 야적 철근도 현장 직수거",
    excerpt:
      "전북 부안 야적장에 장기 보관돼 있던 잔여철근 200톤을 현장에서 계근·상차해 매입한 사례입니다.",
    categories: ["수거 사례", "매입 기준", "현장 실무"],
    purchase: true,
  },
  {
    slug: "ulsan-factory-extension-rebar-delivery",
    title:
      "울산 공장 증축 현장 철근 납품 — 우천 속 2층 슬라브 크레인 직상 하역",
    excerpt:
      "울산 공장 증축 현장 2층 바닥 슬라브에 카고크레인으로 철근을 직접 올려 하역한 작업 기록. 우천 상황 인양 요령과 준공 후 잔여철근 매입 안내까지 담았습니다.",
    categories: ["수거 사례", "현장 실무", "매입 기준"],
    purchase: false,
  },
  {
    slug: "dongcheon-lh-housing-rebar-delivery",
    title:
      "동천 LH주택 현장 철근 납품 — 주택가 도로변 카고크레인 하역, 잔여철근 매입까지",
    excerpt:
      "동천 LH주택 골조 현장에 정척 철근을 직납하고 도로변에서 카고크레인으로 하역한 작업 기록입니다. 공사 후 남는 잔여철근 매입 안내까지 정리했습니다.",
    categories: ["수거 사례", "현장 실무", "매입 기준"],
    purchase: false,
  },
  {
    slug: "rebar-laser-rust-removal-restoration",
    title: "철근 레이저 녹 제거 작업 — 녹슨 철근을 새것처럼 복원하는 과정",
    excerpt:
      "철근 레이저 녹 제거 작업 현장입니다. 녹이 발생한 철근의 표면을 레이저로 깨끗하게 복원합니다.",
    categories: ["업계 정보", "철근 매입", "현장 실무", "시설·인프라"],
    purchase: true,
  },
  {
    slug: "200ton-rebar-purchase-crane-loading",
    title: "200톤 철근 매입 현장 — 크레인 트럭 상차 작업 현장",
    excerpt:
      "200톤 규모의 철근 매입 현장입니다. 녹 발생 철근을 크레인 카고 트럭으로 상차·수거하는 과정을 소개합니다.",
    categories: ["철근 매입", "수거 사례"],
    purchase: true,
  },
  {
    slug: "rebar-buyout-guide",
    title: "현장 철근 매입 기준 완전 정리 — 녹슨 철근도 팔 수 있나?",
    excerpt:
      "표면에 녹이 발생한 철근도 기준에 맞으면 전량 매입합니다. 어떤 철근이 매입 가능하고 불가능한지 명확한 기준을 정리했습니다.",
    categories: ["매입 기준", "현장 실무"],
    purchase: true,
  },
];

test("운영 데이터 11건 — 매입 글 9건만 링크 대상", () => {
  for (const p of TAGGED) assert.equal(isPurchasePost(p), p.purchase, p.slug);
  assert.equal(TAGGED.filter((p) => isPurchasePost(p)).length, 9);
});

test("매입 카테고리가 없으면 대상 아님(수거 사례만으로는 부족)", () => {
  assert.equal(
    isPurchasePost({
      categories: ["수거 사례", "현장 실무"],
      title: "철근 매입 — x",
    }),
    false,
  );
  assert.equal(
    isPurchasePost({ categories: ["시설·인프라", "업계 정보"] }),
    false,
  );
  assert.equal(isPurchasePost({ categories: [] }), false);
  assert.equal(isPurchasePost({ categories: [" 매입 기준 "] }), true);
});

test("납품 신호가 하나뿐이면 제외하지 않는다 — 제목 문자열 단독 판정 금지", () => {
  const titleOnly = {
    categories: ["매입 기준"],
    title: "현장 철근 납품 — 부제",
    slug: "site-rebar-purchase",
    excerpt: "남은 철근을 매입한 사례입니다.",
  };
  assert.equal(deliverySignals(titleOnly), 1);
  assert.equal(isPurchasePost(titleOnly), true);
  const slugOnly = {
    categories: ["매입 기준"],
    title: "현장 잔여철근 매입 — 부제",
    slug: "site-delivery",
    excerpt: "남은 철근을 수거했습니다.",
  };
  assert.equal(isPurchasePost(slugOnly), true);
});

test("제목·slug·요약이 모두 납품이면 제외", () => {
  const p = TAGGED.find(
    (x) => x.slug === "ulsan-factory-extension-rebar-delivery",
  );
  assert.equal(deliverySignals(p), 3);
});
