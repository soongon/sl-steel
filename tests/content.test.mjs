import assert from "node:assert/strict";
import test from "node:test";
import { SLUG_PATTERN } from "../lib/post-validation.ts";
import { optimizedUploadUrl } from "../lib/cloudinary.ts";
test("slug rules allow published URL format and reject paths", () => {
  for (const slug of ["rebar-buyout", "2026-site-1"])
    assert.ok(SLUG_PATTERN.test(slug));
  for (const slug of ["", "../admin", "Hello", "a--b", "a/b", "-abc"])
    assert.ok(!SLUG_PATTERN.test(slug));
});
test("upload optimization preserves video URLs", () => {
  const url = "https://res.cloudinary.com/example/video/upload/demo.mp4";
  assert.equal(
    optimizedUploadUrl({ secure_url: url, resource_type: "video" }),
    url,
  );
});
test("image uploads share the same delivery transformation", () =>
  assert.equal(
    optimizedUploadUrl({
      secure_url: "https://res.cloudinary.com/example/image/upload/demo.jpg",
      resource_type: "image",
    }),
    "https://res.cloudinary.com/example/image/upload/f_auto,q_auto,w_800/demo.jpg",
  ));
