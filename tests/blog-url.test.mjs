import assert from "node:assert/strict";
import test from "node:test";
import { blogListPath } from "../lib/blog-url.ts";

test("기본 목록은 /blog", () => {
  assert.equal(blogListPath("전체", 1), "/blog");
  assert.equal(blogListPath("", 1), "/blog");
});

test("공백은 %20 — + 로 인코딩하지 않는다", () => {
  assert.equal(
    blogListPath("매입 기준", 2),
    "/blog?category=%EB%A7%A4%EC%9E%85%20%EA%B8%B0%EC%A4%80&page=2",
  );
  assert.ok(!blogListPath("매입 기준", 1).includes("+"));
});

test("BlogHeader·Sidebar 의 카테고리 링크와 같은 표기", () => {
  const name = "시설·인프라";
  assert.equal(
    blogListPath(name, 1),
    `/blog?category=${encodeURIComponent(name)}`,
  );
  assert.equal(blogListPath("전체", 3), "/blog?page=3");
});
