/**
 * 리브랜딩 DB 일괄 치환: posts.title/excerpt/content 내
 * "SL Steel" | "SL STEEL" | "SL철강" | "SL 철강" → "신라철강"
 * (슬러그·URL·이메일의 소문자 "sl-steel"은 건드리지 않음)
 *
 * 실행: node --env-file=.env.local scripts/rebrand-db.mjs [--apply]
 *  - 기본: dry-run (대상 목록 + 백업 파일 생성)
 *  - --apply: 실제 UPDATE 수행
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("env 누락: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const PATTERNS = ["SL Steel", "SL STEEL", "SL철강", "SL 철강"];
const NEW = "신라철강";
const apply = process.argv.includes("--apply");

function replaceAll(text) {
  if (!text) return text;
  let out = text;
  for (const p of PATTERNS) out = out.split(p).join(NEW);
  return out;
}

const { data: posts, error } = await supabase
  .from("posts")
  .select("id, slug, title, excerpt, content");
if (error) {
  console.error("조회 실패:", error.message);
  process.exit(1);
}

const affected = posts.filter((p) =>
  PATTERNS.some((pat) => p.title?.includes(pat) || p.excerpt?.includes(pat) || p.content?.includes(pat))
);

console.log(`전체 ${posts.length}건 중 대상 ${affected.length}건:\n`);
for (const p of affected) {
  const fields = [
    p.title && PATTERNS.some((x) => p.title.includes(x)) ? "title" : null,
    p.excerpt && PATTERNS.some((x) => p.excerpt.includes(x)) ? "excerpt" : null,
    p.content && PATTERNS.some((x) => p.content.includes(x)) ? "content" : null,
  ].filter(Boolean);
  console.log(`- [${fields.join(",")}] ${p.slug}: ${p.title}`);
}

if (affected.length === 0) process.exit(0);

// 백업 (원본 그대로)
const backupPath = `scripts/rebrand-backup-${Date.now()}.json`;
writeFileSync(backupPath, JSON.stringify(affected, null, 2));
console.log(`\n백업 저장: ${backupPath}`);

if (!apply) {
  console.log("\n(dry-run — 적용하려면 --apply)");
  process.exit(0);
}

let ok = 0;
for (const p of affected) {
  const { error: upErr } = await supabase
    .from("posts")
    .update({
      title: replaceAll(p.title),
      excerpt: replaceAll(p.excerpt),
      content: replaceAll(p.content),
    })
    .eq("id", p.id);
  if (upErr) console.error(`실패 ${p.slug}:`, upErr.message);
  else ok++;
}
console.log(`\n적용 완료: ${ok}/${affected.length}건`);

// 검증: 잔여 확인
const { data: after } = await supabase.from("posts").select("slug, title, excerpt, content");
const remain = (after ?? []).filter((p) =>
  PATTERNS.some((pat) => p.title?.includes(pat) || p.excerpt?.includes(pat) || p.content?.includes(pat))
);
console.log(`잔여 발생: ${remain.length}건${remain.length ? " — " + remain.map((r) => r.slug).join(", ") : ""}`);
