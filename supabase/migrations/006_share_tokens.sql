-- 공유 링크 토큰 지원
ALTER TABLE posts
  ADD COLUMN share_token text UNIQUE,
  ADD COLUMN share_expires_at timestamptz;

CREATE INDEX posts_share_token_idx ON posts (share_token) WHERE share_token IS NOT NULL;

-- RLS: 유효한 토큰으로 공개 접근 허용 (만료 체크는 앱 레벨)
CREATE POLICY "posts_share_token_read" ON posts
  FOR SELECT TO anon
  USING (share_token IS NOT NULL AND share_expires_at > now());
