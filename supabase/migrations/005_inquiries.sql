-- 문의 테이블 생성
-- Supabase SQL Editor에서 실행

CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  location text DEFAULT '',
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS 활성화
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 누구나 INSERT 가능 (문의 폼 제출)
CREATE POLICY "anon_insert_inquiries" ON inquiries
  FOR INSERT TO anon WITH CHECK (true);

-- 인증된 사용자만 조회 가능 (관리자)
CREATE POLICY "auth_select_inquiries" ON inquiries
  FOR SELECT TO authenticated USING (true);

-- 인증된 사용자만 수정 가능 (관리자 — 상태 변경)
CREATE POLICY "auth_update_inquiries" ON inquiries
  FOR UPDATE TO authenticated USING (true);
