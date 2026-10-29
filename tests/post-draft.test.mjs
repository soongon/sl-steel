import assert from "node:assert/strict";
import test from "node:test";
import { draftToJson, stripOrphanMarkers } from "../lib/post-draft.ts";

test("orphan markers beyond the media count are stripped", () => {
  const out = stripOrphanMarkers("a\n\n[사진1]\n\n[사진3]\n\nb", 2);
  assert.equal(out, "a\n\n[사진1]\n\nb");
  assert.equal(stripOrphanMarkers("[사진2]", 2), "[사진2]");
});

test("draft JSON keeps only schema fields", () => {
  const json = draftToJson({
    title: "t",
    slug: "s",
    categories: ["a", "b"],
    excerpt: "e",
    content: "c",
    extra: "drop me",
  });
  assert.deepEqual(Object.keys(JSON.parse(json)), [
    "title",
    "slug",
    "categories",
    "excerpt",
    "content",
  ]);
});
