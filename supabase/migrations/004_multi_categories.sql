-- 카테고리 멀티 선택 지원
-- Supabase SQL Editor에서 실행

-- 1. 새 배열 컬럼 추가
ALTER TABLE posts ADD COLUMN categories text[] NOT NULL DEFAULT '{}';

-- 2. 기존 단일 카테고리 데이터 마이그레이션
UPDATE posts SET categories = ARRAY[category];

-- 3. 기존 FK 제약 + 컬럼 제거
ALTER TABLE posts DROP COLUMN category;
