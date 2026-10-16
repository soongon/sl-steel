-- 007_inquiry_source_guard.sql — 문의 유입 캡처 + 스팸·중복 가드 (2026-10-16, P0)
--   · source: 폼이 hidden 으로 보낸 유입 정보(utm_*, referrer 호스트, landing_path, qr_src, page_type)
--   · ip_hash / ua: 레이트리밋(분당 3회)·중복 판정용. 원본 IP 는 저장하지 않는다(sha256 앞 32자).
--   · submit_count: 같은 번호·같은 구분으로 10분 내 재제출은 새 행 대신 이 값 +1 (05-25 중복 사례).
--   · notified_at: 알림 메일이 나간 시각(없으면 알림 실패 — 관리자 상세에 표시).
--   · anon INSERT 정책 제거: 제출은 서버 액션이 서비스 롤로만 한다(honeypot·레이트리밋을 우회하는 직접 insert 차단).
--     ⚠ 적용 순서: 새 코드(서비스 롤 insert) 배포 → 이 SQL 실행. 반대로 하면 구 코드의 anon insert 가 막혀 접수가 실패한다.
--     새 코드는 아래 컬럼이 아직 없어도(이 SQL 전) 기본 컬럼만으로 재시도하므로 먼저 배포해도 안전하다.

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS ip_hash text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS ua text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS submit_count int NOT NULL DEFAULT 1;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notified_at timestamptz;

CREATE INDEX IF NOT EXISTS inquiries_ip_hash_created_idx ON inquiries (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_phone_created_idx ON inquiries (phone, created_at DESC);

DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
