# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brand

**신라철강 (Silla Steel)** — 2026-08 SL철강에서 리브랜딩됨.
- 로고: `components/logo/Logo.tsx` (`<Logo white? withEn? />` + `<LogoSymbol />`) — B-1 크라운 심볼 + T-2 타이포(Pretendard 700, tracking 0.12em)
- 브랜드 컬러: `brand-steel-700` #1B3A5C (심볼), `brand-steel-900` #0F1B29 (워드마크), `brand-gold` #C9A227 (곡옥 포인트 전용 — 남용 금지)
- 브랜드 자산: `public/brand/` (logo-*.svg, profile-512.png), 파비콘 세트 `public/`
- 유지 항목: 저장소명 `sl-steel`, 이메일 `sl-steel@gmail.com`
- 구 `components/logo/SLSteelLogo.tsx`는 미참조 (삭제 보류)

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
- **Cloudinary** — 이미지·동영상 저장/최적화 (이미지: f_auto, q_auto, w_800 / 동영상: 원본 URL)
- **next-mdx-remote** — 블로그 본문 MDX 렌더링 (RSC), 커스텀 컴포넌트(`lib/mdx-components.tsx`)

## Architecture

Independent sections with separate layouts (landing / blog / admin / share / QR):

### Landing page — `app/(landing)/`
- `app/(landing)/layout.tsx` — wraps with `<Header>` + `<Footer>`
- `app/(landing)/page.tsx` — serves `/`, all 9 sections
- `app/layout.tsx` — root layout (fonts + html/body only, no shared UI)

### Blog — `app/blog/`
- `app/blog/layout.tsx` — BlogNav + simple footer, no landing page components
- `app/blog/page.tsx` — post list with category filter (`?category=`) and pagination (`?page=`)
- `app/blog/[slug]/page.tsx` — single post (SSG via `generateStaticParams`)
- `components/blog/` — BlogNav, BlogHeader, PostCard, Sidebar, Pagination

### Share (콘텐츠 공유) — `app/share/`
- `app/share/[token]/page.tsx` — 토큰 기반 공유 페이지 (인증 불필요)
- `app/share/[token]/SharePageClient.tsx` — 제목/본문 복사, 개별·ZIP 다운로드
- `components/admin/ShareLinkButton.tsx` — 관리자 공유 링크 생성/복사/재생성
- `lib/share.ts` — `getShareData(token)` 토큰 조회 (만료/미존재 구분)
- `lib/share-utils.ts` — MDX→순수텍스트 변환, 미디어 추출, 파일명 매핑, 다운로드 URL

### Admin — `app/admin/`
- `app/admin/login/page.tsx` — Supabase Auth 이메일/비밀번호 로그인
- `app/admin/(dashboard)/` — AdminNav 레이아웃, `force-dynamic` (포스트 목록 + 문의 관리)
- `app/admin/posts/new`, `app/admin/posts/[id]/edit` — 포스트 작성/수정 (+공유 링크 버튼)
- `app/admin/quick-post` — Claude.ai JSON 붙여넣기 → draft 저장
- `app/admin/(dashboard)/mobile-post` — 모바일 원탭 포스팅: 사진 업로드 + 현장명·칩 입력 → Claude API가 사진 분석·글 생성 → 자동 발행 (`maxDuration = 60`)

### QR 랜딩 — `app/q/`
- `app/q/page.tsx` — QR 코드 전용 모바일 랜딩 (명함·차량·전단·현장), root layout만 사용
- `?src=card|truck|flyer|site` 유입 경로 구분 — 화이트리스트 정규화, SMS 본문에 `(명함 QR)` 식으로 반영 (전화 문의는 유입 경로 미기록)
- `robots: noindex`, `tel:`/`sms:` CTA, max-w-[430px] 모바일 퍼스트, 자체 하단 고정 CTA 바

### Data flow
```
Supabase DB (posts/categories)
  → lib/blog.ts (getPosts, getPost, getCategoryCounts, getSlugs)
    → 페이지 컴포넌트 (async/await)

Cloudinary (이미지·동영상 원본 + 자동 최적화)
  → Supabase DB (thumbnail_url 필드에 Cloudinary URL 저장)
    → next/image (추가 최적화 + lazy loading)

공유 링크 흐름:
  관리자 포스트 수정 → "공유 링크 생성" → /share/[token]
  → 담당자가 본문 복사 + 사진/동영상 다운로드 → 네이버 블로그 등 외부 채널 등록
```

### Shared libraries
- `lib/supabase.ts` — Supabase client (env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- `lib/supabase-server.ts` — `createSupabaseServer()` (cookie auth) + `createSupabaseAdmin()` (service role), `requireEnv()` 런타임 검증, `requireAuth()` 관리자 인증 가드
- `lib/supabase-browser.ts` — browser Supabase client (어드민 로그인용)
- `lib/blog.ts` — async 블로그 데이터 함수 (Supabase 쿼리)
- `lib/admin.ts` — server actions for admin CRUD (createPost, updatePost, deletePost, generateShareToken, sendShareDraft) — 조회 포함 전 함수 `requireAuth()` 적용
- `lib/gmail.ts` — Gmail API OAuth2 드래프트 생성 (공유 링크 → 임시보관함)
- `lib/inquiries.ts` — 문의 제출/조회/상태 변경 server actions (관리자 함수는 `requireAuth()` 적용)
- `lib/types.ts` — 공유 타입(`PostStatus`, `InquiryStatus`), 상수, 유틸(`formatDate`, `isVideoUrl`, `extractFilename`)
- `lib/share.ts` — 공유 링크 토큰 조회 (만료/미존재 구분)
- `lib/share-utils.ts` — MDX→텍스트 변환, 미디어 추출, Cloudinary 다운로드 URL 생성
- `lib/mdx-components.tsx` — MDX 커스텀 컴포넌트 (video 등), 블로그 + 어드민 미리보기 공유
- `lib/media-markers.ts` — `replaceMediaMarkers()`: 본문 [사진N] 마커를 이미지/비디오로 치환 (QuickPostForm + generate-post 공유)
- `lib/blog-prompt.ts` — AI 블로그 생성 시스템 프롬프트 (원본: 노션 "신라철강 블로그 생성 로직" 문서 — 수정 시 동기화)
- `lib/generate-post.ts` — `generateAndPublishPost()` server action: 사진 URL + 키워드 → Claude API(structured output) → 카테고리·slug 검증 → 자동 발행
- `lib/site.ts` — 랜딩 페이지 copy/data (SITE constant, 전화번호 single source of truth)
- `lib/ui.ts` — shared Tailwind class tokens + `COLOR` 상수 (landing page only)
- `lib/scroll.ts` — `scrollToContact(type)` for CTA navigation
- `app/globals.css` — design tokens (`@theme`) + `.blog-content` MDX prose styles (img + video)

## External services

| 서비스 | 용도 | 환경변수 |
|--------|------|----------|
| Supabase | 블로그 DB + RLS | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Cloudinary | 이미지·동영상 CDN | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` |
| Gmail API | 공유 링크 드래프트 발송 | `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `SHARE_EMAIL_TO` |
| Admin API | `/api/admin/posts` Bearer 토큰 | `ADMIN_API_KEY` |
| Anthropic API | 모바일 포스팅 AI 글 생성 (기본 모델 `claude-opus-5`, `BLOG_AI_MODEL`로 변경 가능) | `ANTHROPIC_API_KEY` |
| Vercel | 배포 | — |

## DB schema

### `posts` 테이블
`id (uuid)`, `slug (unique)`, `title`, `categories (text[])`, `excerpt`, `content`, `thumbnail_url`, `status (draft/published)`, `view_count`, `published_at`, `created_at`, `updated_at`, `share_token (unique, nullable)`, `share_expires_at (timestamptz, nullable)`

### `categories` 테이블
`id (serial)`, `name (unique)`, `sort_order`

### `inquiries` 테이블
`id (uuid)`, `inquiry_type`, `name`, `phone`, `location`, `message`, `status (new/read/resolved)`, `created_at`, `updated_at`

### RLS 정책
- categories: 누구나 읽기
- posts: `status = 'published'`만 공개 읽기 + `share_token IS NOT NULL AND share_expires_at > now()` 공유 링크 읽기
- inquiries: 누구나 INSERT, 인증된 사용자만 SELECT/UPDATE

마이그레이션 SQL: `supabase/migrations/`

## Design tokens (v2)

All colors defined in `globals.css` `@theme` block. `--color-neutral-*: initial`로 Tailwind 기본 neutral 리셋 후 커스텀 정의.

### 핵심 컬러
| 토큰 | Hex | 용도 |
|------|-----|------|
| primary-600 | #2C5F8A | 메인 브랜드 Steel Blue |
| primary-900 | #0F2640 | 다크 섹션 배경 (Hero, Why) |
| accent-600 | #D4700E | CTA 버튼 Industrial Orange |
| accent-400 | #F28C28 | 강조, 하이라이트 |
| neutral-50 | #F7F6F3 | 교차 섹션 배경 (Warm Gray) |
| neutral-900 | #1E1C18 | 제목 텍스트 |

### 호환 레이어 (레거시)
- `accent` / `accent-dark` — Steel Blue 계열로 재매핑됨 (구 파란색 아님)
- `brand-navy`, `surface`, `foreground`, `muted`, `steel`, `border`, `card` — 유지

### SVG/인라인 색상
Tailwind class 사용 불가한 곳(SVG prop 등)은 `lib/ui.ts`의 `COLOR` 상수 사용:
```ts
import { COLOR } from "@/lib/ui";
// COLOR.primary600, COLOR.primary400, COLOR.primary900, COLOR.accent600, COLOR.neutral50, COLOR.white
```

### ui 토큰 (lib/ui.ts)
- `ui.label` / `ui.labelDark` — 섹션 라벨 (밝은/다크 배경)
- `ui.title` / `ui.titleDark` — 섹션 타이틀
- `ui.desc` / `ui.descDark` — 섹션 설명
- `ui.btn.primary` / `ui.btn.secondary` — 버튼 스타일
- `ui.card`, `ui.cardPad`, `ui.chip` — 카드/칩 컴포넌트

## Media conventions

- 이미지 Cloudinary URL: `https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/blog/filename.jpg`
- 동영상 Cloudinary URL: `https://res.cloudinary.com/dpwpptrhe/video/upload/blog/filename.mp4` (최적화 파라미터 없음)
- `next.config.ts` remotePatterns: `res.cloudinary.com`
- 랜딩 페이지 이미지: `public/images/` (로컬)
- 블로그 이미지: Cloudinary → DB `thumbnail_url`
- 블로그 동영상: Cloudinary → MDX `<video>` 태그 (커스텀 컴포넌트로 렌더링)
- 동영상 판별: `isVideoUrl()` — `/video/upload/` 경로 또는 `.mp4|.mov|.webm|.avi` 확장자
- 업로드 제한: 최대 15개, 이미지 10MB / 동영상 포함 50MB
- QuickPostForm: 마커 없는 동영상은 본문 끝 "현장 영상" 섹션에 자동 추가

## Notes

- `content/blog/*.mdx` — 더 이상 사용하지 않음 (Supabase 전환 완료). 레거시.
- `gray-matter` — 제거 완료 (레거시 의존성)
- Tailwind v4: `bg-linear-to-t` 사용 (`bg-gradient-to-t` 아님)
- 전화번호 변경 시 `lib/site.ts` SITE.footer.regions만 수정하면 전체 반영
- 환경변수 미설정 시 `requireEnv()`가 명확한 에러 메시지 출력
- API route 보안: `/api/admin/preview`는 Supabase 세션 인증, `/api/admin/posts`는 Bearer 토큰
- server action 보안: `"use server"` export는 공개 엔드포인트 — 관리자 함수는 조회/변이 구분 없이 `requireAuth()` 호출 필수
- middleware matcher: `/admin/:path*` + `/api/admin/*` (posts 제외) 보호

## Admin 기능

### 관리자 페이지 (`/admin`)
- Supabase Auth 기반 로그인 (`/admin/login`)
- 블로그 포스트 CRUD (목록, 새 포스트, 수정, 삭제)
- 빠른 등록 (`/admin/quick-post`) — Claude.ai JSON 붙여넣기 → 초안 저장
- 모바일 포스팅 (`/admin/mobile-post`) — 사진+현장명만으로 AI가 글 생성 후 **자동 발행** → 이어서 공유 토큰 발급 + Gmail 임시보관함 메일 자동 생성(실패해도 발행 유지, `draftCreated`로 UI 표시). 카테고리는 BLOG_CATEGORIES enum으로 강제, slug 중복 시 -2 접미사, 누락된 이미지 마커는 마무리 섹션 앞에 자동 보충
- 문의 관리 (`/admin/inquiries`) — 상태 변경 (new → read → resolved)
- 대시보드 레이아웃: AdminNav + 새 문의 카운트 배지

### 공유 링크 + Gmail 연동
- 포스트 수정 페이지에서 "공유 링크 생성" → UUID 토큰 발급 (7일 만료)
- "링크 다시보내기" → 클립보드 복사 + Gmail 임시보관함에 드래프트 자동 생성
- 포스트 목록에 공유 상태 배지 (파란색=유효, 회색=만료)
- 수신자 변경: Vercel `SHARE_EMAIL_TO` 환경변수만 수정
- Gmail OAuth: 앱 게시(프로덕션) 상태 → Refresh Token 만료 없음

### 서버 액션 에러 처리 패턴
- 모든 서버 액션(createPost, updatePost, deletePost)은 `{ error?: string }` 반환
- throw 사용 안 함 (Next.js 프로덕션에서 에러 메시지가 숨겨지므로)
- 클라이언트에서 `result?.error` 체크 후 UI에 표시

### 파일 구조
```
lib/admin.ts          — 포스트 CRUD + 공유 링크 서버 액션
lib/gmail.ts          — Gmail API 드래프트 생성
lib/inquiries.ts      — 문의 서버 액션
lib/types.ts          — PostStatus, InquiryStatus 타입/상수
components/admin/
  ├─ Toast.tsx         — 재사용 토스트 (success/error/info)
  ├─ StatusBadge.tsx   — 발행/초안 + 공유 상태 배지
  ├─ ShareLinkButton.tsx — 공유 링크 생성/복사/드래프트
  ├─ PostForm.tsx      — 포스트 생성/수정 폼
  ├─ QuickPostForm.tsx — 빠른 등록 (JSON 파싱)
  ├─ DeleteButton.tsx  — 삭제 확인
  ├─ AdminNav.tsx      — 관리자 네비게이션
  └─ MultiImageUpload.tsx — Cloudinary 멀티 업로드
```


## 🎨 디자인시스템 리뉴얼 (v2) — 완료

랜딩 페이지 리뉴얼 완료됨 (Steel Blue + Industrial Orange, Pretendard 폰트, MobileCTABar 하단 고정 CTA, `@theme` 토큰 + `lib/ui.ts` 토큰).
컬러 토큰은 위 "Design tokens" 섹션 참조. 리뉴얼 당시 참조 문서(`docs/DESIGN_SYSTEM_GUIDE.md`, `docs/sl-steel-redesign.html`)는 삭제되어 저장소에 없음.

랜딩 디자인 변경 시 주의:
- `app/blog/`, `components/blog/`, `lib/blog.ts`, `lib/supabase.ts` — 건드리지 말 것
- `--color-neutral-*: initial` 필수 — 없으면 Tailwind 기본 neutral 팔레트가 커스텀 값 덮어씀
- 기존 토큰명(accent, surface 등) 호환 레이어 유지할 것
