import assert from "node:assert/strict";
import test from "node:test";
import { formatPhoneEdit } from "../lib/phone.ts";
for (const [raw, expected] of [
  ["", ""],
  ["01", "01"],
  ["010", "010-"],
  ["0101234", "010-1234-"],
  ["01012345678", "010-1234-5678"],
  ["010-1234-5678", "010-1234-5678"],
  ["010 1234 abc5678", "010-1234-5678"],
  ["01012345678999", "010-1234-5678"],
]) {
  test(`phone insertion/paste: ${raw}`, () =>
    assert.equal(
      formatPhoneEdit(raw, raw.length, "", "insertFromPaste").value,
      expected,
    ));
}
test("backspace across an auto separator removes the preceding digit", () =>
  assert.deepEqual(
    formatPhoneEdit("010-1234", 8, "010-1234-", "deleteContentBackward"),
    { value: "010-123", caret: 7 },
  ));
test("forward delete across a separator removes the next digit", () =>
  assert.deepEqual(
    formatPhoneEdit("0101234-5678", 3, "010-1234-5678", "deleteContentForward"),
    { value: "010-2345-678", caret: 3 },
  ));
test("clear resets the complete number", () =>
  assert.deepEqual(
    formatPhoneEdit("", 0, "010-1234-5678", "deleteContentBackward"),
    { value: "", caret: 0 },
  ));
test("middle insertion preserves digit-relative cursor", () =>
  assert.deepEqual(
    formatPhoneEdit("010-9123-4567", 5, "010-123-4567", "insertText"),
    { value: "010-9123-4567", caret: 5 },
  ));
