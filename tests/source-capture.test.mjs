import assert from "node:assert/strict";
import test from "node:test";
import { extractSource } from "../lib/source-capture.ts";

test("첫 방문: 랜딩·referrer 호스트·utm", () => {
  const s = extractSource(
    "https://www.sl-steel.co.kr/?utm_source=naver&utm_medium=cpc",
    "https://search.naver.com/search.naver?query=철근",
    null,
  );
  assert.deepEqual(s, {
    utm_source: "naver",
    utm_medium: "cpc",
    landing_path: "/?utm_source=naver&utm_medium=cpc",
    referrer: "search.naver.com",
  });
});

test("내부 이동은 referrer·랜딩을 덮지 않고, utm 은 갱신한다", () => {
  const prev = { referrer: "blog.naver.com", landing_path: "/blog/x" };
  const s = extractSource("https://www.sl-steel.co.kr/?utm_campaign=oct", "https://www.sl-steel.co.kr/blog/x", prev);
  assert.equal(s.referrer, "blog.naver.com");
  assert.equal(s.landing_path, "/blog/x");
  assert.equal(s.utm_campaign, "oct");
});

test("/q?src= 는 화이트리스트 정규화, 없으면 qr", () => {
  assert.equal(extractSource("https://www.sl-steel.co.kr/q?src=card", "", null).qr_src, "card");
  assert.equal(extractSource("https://www.sl-steel.co.kr/q?src=hack", "", null).qr_src, "qr");
  assert.equal(extractSource("https://www.sl-steel.co.kr/", "", null).qr_src, undefined);
});
