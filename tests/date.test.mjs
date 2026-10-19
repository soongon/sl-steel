// 서버 시간대(Vercel = UTC)와 상관없이 한국 시간으로 찍히는지 — 일부러 한국이 아닌 시간대로 돌린다.
process.env.TZ = "America/Los_Angeles";

import assert from "node:assert/strict";
import test from "node:test";
import { formatDate, formatKstDate, kstToday } from "../lib/types.ts";

test("formatDate: UTC 로 저장된 접수 시각을 한국 시간으로", () => {
  assert.equal(formatDate("2026-10-19T00:47:00+00:00"), "2026-10-19 09:47");
  // 한국 오전 9시 전 접수는 UTC 로는 전날 — 날짜도 한국 기준
  assert.equal(formatDate("2026-05-25T22:19:00.123+00:00"), "2026-05-26 07:19");
});

test("formatDate: 한국 자정은 00시(24시 아님)", () => {
  assert.equal(formatDate("2026-10-18T15:00:00Z"), "2026-10-19 00:00");
  assert.equal(formatDate("2026-12-31T15:05:00Z"), "2027-01-01 00:05");
});

test("formatDate: 값이 없거나 잘못되면 빈 문자열", () => {
  assert.equal(formatDate(""), "");
  assert.equal(formatDate(null), "");
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate("garbage"), "");
});

test("formatKstDate: 날짜만 고른 발행일(UTC 자정 저장)은 그 날짜 그대로", () => {
  assert.equal(formatKstDate("2026-10-19T00:00:00+00:00"), "2026-10-19");
});

test("formatKstDate: 한국 오전 9시 전 자동 발행도 한국 날짜로", () => {
  assert.equal(formatKstDate("2026-10-18T23:30:00Z"), "2026-10-19");
  assert.equal(formatKstDate(null), "");
});

test("kstToday: 오늘 한국 날짜 YYYY-MM-DD", () => {
  const today = kstToday();
  assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(today, formatKstDate(new Date().toISOString()));
});
