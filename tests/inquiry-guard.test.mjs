import assert from "node:assert/strict";
import test from "node:test";
import {
  buildNotifyText,
  describeSource,
  guessLeadSource,
  hashIp,
  isHoneypotFilled,
  isTooFast,
  isWithinDedupeWindow,
  mergeMessage,
  readSource,
} from "../lib/inquiry-guard.ts";

test("hashIp: 첫 번째 IP 만, 원본은 남기지 않는다", () => {
  const h = hashIp("1.2.3.4, 10.0.0.1");
  assert.equal(h?.length, 32);
  assert.equal(h, hashIp("1.2.3.4"));
  assert.notEqual(h, hashIp("1.2.3.5"));
  assert.equal(hashIp(""), null);
  assert.equal(hashIp(null), null);
});

test("honeypot: 값이 있으면 봇", () => {
  assert.equal(isHoneypotFilled(""), false);
  assert.equal(isHoneypotFilled(null), false);
  assert.equal(isHoneypotFilled("http://spam"), true);
});

test("isTooFast: 3초 미만만 막고, 값이 없거나 이상하면 막지 않는다", () => {
  const now = 1_000_000;
  assert.equal(isTooFast(String(now - 1000), now), true);
  assert.equal(isTooFast(String(now - 5000), now), false);
  assert.equal(isTooFast(null, now), false);
  assert.equal(isTooFast("abc", now), false);
  assert.equal(isTooFast(String(now + 1000), now), false);
});

test("dedupe 창: 10분 안이면 중복", () => {
  const now = Date.parse("2026-05-25T10:00:00Z");
  assert.equal(isWithinDedupeWindow("2026-05-25T09:55:00Z", now), true);
  assert.equal(isWithinDedupeWindow("2026-05-25T09:40:00Z", now), false);
  assert.equal(isWithinDedupeWindow("not a date", now), false);
});

test("mergeMessage: 같으면 그대로, 다르면 덧붙임", () => {
  assert.equal(mergeMessage("A", "A"), "A");
  assert.equal(mergeMessage("", "B"), "B");
  assert.equal(mergeMessage("A", ""), "A");
  assert.equal(mergeMessage("A", "B"), "A\n— 재제출 —\nB");
  assert.equal(mergeMessage("A B C", "B"), "A B C");
});

test("readSource: src_ 접두 화이트리스트만, 200자 상한", () => {
  const data = new Map([
    ["src_utm_source", " naver "],
    ["src_referrer", "blog.naver.com"],
    ["src_evil", "x"],
    ["src_landing_path", "a".repeat(300)],
  ]);
  const src = readSource((k) => data.get(k) ?? null);
  assert.deepEqual(Object.keys(src).sort(), ["landing_path", "referrer", "utm_source"]);
  assert.equal(src.utm_source, "naver");
  assert.equal(src.landing_path?.length, 200);
});

test("guessLeadSource 매핑", () => {
  assert.equal(guessLeadSource({}), "homepage");
  assert.equal(guessLeadSource({ referrer: "blog.naver.com" }), "blog");
  assert.equal(guessLeadSource({ referrer: "m.place.naver.com" }), "naver_place");
  assert.equal(guessLeadSource({ utm_medium: "cpc" }), "ad");
  assert.equal(guessLeadSource({ qr_src: "card", referrer: "blog.naver.com" }), "other");
  assert.equal(describeSource({ qr_src: "card" }), "기타(QR 등) · QR:card");
});

test("buildNotifyText: 번호 하이픈·내용 요약·링크", () => {
  const t = buildNotifyText({
    inquiryType: "매입 문의",
    name: "홍길동",
    phone: "01012345678",
    location: "울산 언양",
    message: "SD-400 22mm 9M  34EA\n문의드립니다.",
    source: { referrer: "blog.naver.com" },
    adminUrl: "https://www.sl-steel.co.kr/admin/inquiries/abc",
  });
  assert.match(t, /📩 홈페이지 매입 문의 · 홍길동/);
  assert.match(t, /010-1234-5678 · 울산 언양/);
  assert.match(t, /“SD-400 22mm 9M 34EA 문의드립니다.”/);
  assert.match(t, /유입: 네이버 블로그 · blog.naver.com/);
  assert.match(t, /admin\/inquiries\/abc$/);
});
