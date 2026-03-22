# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Node.js >=20.9.0 required. No test runner is configured.

## Stack

- **Next.js 16** with App Router (`/app` directory)
- **React 19** with Server Components by default
- **TypeScript 5** (strict mode, path alias `@/*` maps to root)
- **Tailwind CSS v4** — configured via PostCSS; no `tailwind.config` file (v4 uses `@theme` in `globals.css`)
- **Supabase** — 블로그 DB (posts, categories 테이블), RLS 적용
- **Cloudinary** — 이미지 저장/최적화 (f_auto, q_auto, w_800)
- **next-mdx-remote** — 블로그 본문 MDX 렌더링 (RSC)

## Architecture

Two completely separate sections with independent layouts:

### Landing page — `app/(landing)/`
- `app/(landing)/layout.tsx` — wraps with `<Header>` + `<Footer>`
- `app/(landing)/page.tsx` — serves `/`, all 9 sections
- `app/layout.tsx` — root layout (fonts + html/body only, no shared UI)

### Blog — `app/blog/`
- `app/blog/layout.tsx` — BlogNav + simple footer, no landing page components
- `app/blog/page.tsx` — post list with category filter (`?category=`) and pagination (`?page=`)
- `app/blog/[slug]/page.tsx` — single post (SSG via `generateStaticParams`)
- `components/blog/` — BlogNav, BlogHeader, PostCard, Sidebar, Pagination

### Data flow
```
Supabase DB (posts/categories)
  → lib/blog.ts (getPosts, getPost, getCategoryCounts, getSlugs)
    → 페이지 컴포넌트 (async/await)

Cloudinary (이미지 원본 + 자동 최적화)
  → Supabase DB (thumbnail_url 필드에 Cloudinary URL 저장)
    → next/image (추가 최적화 + lazy loading)
```

### Shared libraries
- `lib/supabase.ts` — Supabase client (env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- `lib/blog.ts` — async 블로그 데이터 함수 (Supabase 쿼리)
- `lib/site.ts` — 랜딩 페이지 copy/data (SITE constant, 전화번호 single source of truth)
- `lib/ui.ts` — shared Tailwind class tokens (landing page only)
- `lib/scroll.ts` — `scrollToContact(type)` for CTA navigation
- `app/globals.css` — design tokens (`@theme`) + `.blog-content` MDX prose styles

## External services

| 서비스 | 용도 | 환경변수 |
|--------|------|----------|
| Supabase | 블로그 DB + RLS | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Cloudinary | 이미지 CDN | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (dpwpptrhe) |
| Vercel | 배포 (예정) | — |

## DB schema

### `posts` 테이블
`id (uuid)`, `slug (unique)`, `title`, `categories (text[])`, `excerpt`, `content`, `thumbnail_url`, `status (draft/published)`, `view_count`, `published_at`, `created_at`, `updated_at`

### `categories` 테이블
`id (serial)`, `name (unique)`, `sort_order`

### `inquiries` 테이블
`id (uuid)`, `inquiry_type`, `name`, `phone`, `location`, `message`, `status (new/read/resolved)`, `created_at`, `updated_at`

### RLS 정책
- categories: 누구나 읽기
- posts: `status = 'published'`만 공개 읽기
- inquiries: 누구나 INSERT, 인증된 사용자만 SELECT/UPDATE

마이그레이션 SQL: `supabase/migrations/`

## Design tokens

All colors defined in `globals.css` `@theme` block. Key values:
- `accent` / `accent-dark` — blue CTA (#3B82F6 / #2563EB)
- `brand-navy` — dark header/hero (#0F172A)
- `surface` — alternate section bg (#F1F5F9)
- `foreground`, `muted`, `steel`, `border`, `card`

## Image conventions

- Cloudinary URL format: `https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/blog/filename.jpg`
- `next.config.ts` remotePatterns: `res.cloudinary.com`
- 랜딩 페이지 이미지: `public/images/` (로컬)
- 블로그 이미지: Cloudinary → DB `thumbnail_url`

## Notes

- `content/blog/*.mdx` — 더 이상 사용하지 않음 (Supabase 전환 완료). 레거시.
- Tailwind v4: `bg-linear-to-t` 사용 (`bg-gradient-to-t` 아님)
- 전화번호 변경 시 `lib/site.ts` SITE.footer.regions만 수정하면 전체 반영


## 🎨 디자인시스템 리뉴얼 (v2)

### 리뉴얼 목표
- 브랜드 신뢰감/전문성 강화 (Steel Blue + Industrial Orange)
- 모바일 사용성 개선 (하단 고정 CTA, 모바일 퍼스트)
- 디자인시스템 기반 토큰 + 핵심 컴포넌트 체계화

### 디자인 가이드 문서
상세 스펙은 `docs/DESIGN_SYSTEM_GUIDE.md` 참조.
이 문서에 컬러 팔레트, 타이포그래피, 컴포넌트 스펙, 작업 순서가 모두 정의되어 있다.

### 리뉴얼 범위
- ✅ `app/(landing)/` — 메인 랜딩 페이지 전체
- ✅ `components/` (landing 관련) — 컴포넌트 리뉴얼
- ✅ `lib/ui.ts` — Tailwind class 토큰 업데이트
- ✅ `app/globals.css` — @theme 블록 토큰 추가
- ✅ `app/layout.tsx` — 폰트 변경 (Geist → Pretendard)
- ❌ `app/blog/` — 건드리지 말 것
- ❌ `components/blog/` — 건드리지 말 것
- ❌ `lib/blog.ts`, `lib/supabase.ts` — 건드리지 말 것

### 핵심 컬러 토큰 (빠른 참조)
| 토큰 | Hex | 용도 |
|------|-----|------|
| primary-600 | #2C5F8A | 메인 브랜드 (Steel Blue) |
| primary-900 | #0F2640 | 다크 섹션 배경 |
| accent-600 | #D4700E | CTA 버튼 (Industrial Orange) |
| accent-400 | #F28C28 | 강조, 히어로 하이라이트 |
| neutral-50 | #F7F6F3 | 교차 섹션 배경 |
| neutral-900 | #1E1C18 | 제목 텍스트 |

### 컴포넌트 변경 체크리스트
작업 시 아래 순서대로 진행:
1. `globals.css` @theme 토큰 → 2. `lib/ui.ts` 토큰 → 3. 폰트 교체
4. Header/Nav → 5. Hero → 6. Stats → 7. About → 8. Services
9. Criteria → 10. Process → 11. Infra → 12. Why → 13. Contact → 14. Footer
15. 모바일 하단 CTA 바 (신규) → 16. build 검증

### Tailwind v4 주의
- 그라데이션: `bg-linear-to-t` (v3의 `bg-gradient-to-t` 아님)
- @theme 정의 후 `bg-primary-600`, `text-accent-400` 등으로 직접 사용
- 기존 토큰명(accent, surface 등) 호환 레이어 유지할 것

### 프로토타입 참조
`docs/sl-steel-redesign.html` — 브라우저에서 열어서 리뉴얼 최종 형태 확인 가능.
실제 구현은 이 HTML의 구조/스타일을 React 컴포넌트 + Tailwind로 변환하는 방식.