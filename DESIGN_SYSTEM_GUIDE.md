# SL Steel 디자인시스템 리뉴얼 가이드

> 이 문서는 Claude Code가 SL Steel 랜딩 페이지 리뉴얼 작업 시 참조하는 컨텍스트입니다.
> `CLAUDE.md`에서 이 파일을 참조하도록 연결하세요.

---

## 1. 리뉴얼 목표

- **브랜드 신뢰감/전문성 강화** — 2009년부터의 업력, 자체 인프라를 시각적으로 전달
- **모바일 사용성 개선** — 건설 현장에서 스마트폰으로 접근하는 고객이 주요 타겟
- **디자인시스템 기반** — 토큰 + 핵심 컴포넌트 체계로 일관성 확보, 향후 확장 용이

## 2. 기술 제약 (기존 스택 유지)

- Next.js 16 + App Router (`/app` 디렉토리)
- React 19 + Server Components
- Tailwind CSS v4 (`@theme` in `globals.css`, `tailwind.config` 없음)
- TypeScript strict mode, path alias `@/*`
- Vercel 배포 (GitHub push → 자동 배포)

## 3. 현재 프로젝트 구조 (건드리면 안 되는 것)

```
app/
├── (landing)/        # 랜딩 페이지 (리뉴얼 대상)
│   ├── layout.tsx    # Header + Footer 래핑
│   └── page.tsx      # 메인 페이지 (9개 섹션)
├── blog/             # 블로그 (리뉴얼 범위 밖, 건드리지 말 것)
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/page.tsx
├── globals.css       # @theme 블록 (디자인 토큰 여기서 수정)
└── layout.tsx        # 루트 레이아웃 (폰트 + html/body만)

components/
├── blog/             # 블로그 컴포넌트 (건드리지 말 것)
└── (landing 관련)    # 리뉴얼 대상

lib/
├── site.ts           # SITE 상수 (전화번호, 카피 등 single source of truth)
├── ui.ts             # Tailwind class 토큰 (리뉴얼 시 업데이트)
├── scroll.ts         # scrollToContact 함수
├── blog.ts           # 블로그 데이터 함수 (건드리지 말 것)
└── supabase.ts       # Supabase 클라이언트 (건드리지 말 것)

public/images/        # 랜딩 페이지 이미지
```

**절대 건드리면 안 되는 영역:**
- `app/blog/` 전체
- `components/blog/` 전체
- `lib/blog.ts`, `lib/supabase.ts`
- `supabase/migrations/`
- `content/blog/` (레거시)

## 4. 디자인 토큰 정의

### 4.1 Color Palette

`globals.css`의 `@theme` 블록에 아래 토큰을 추가/교체한다.

```
기존 토큰과의 매핑:
- accent → primary-600 (Steel Blue #2C5F8A) 으로 변경
- accent-dark → primary-800 (#1A3D5C)
- brand-navy → 유지 또는 primary-900 (#0F2640)으로 통일
- surface → neutral-50 (#F7F6F3) 으로 변경

신규 추가:
--color-primary-50:  #E8EEF4;
--color-primary-100: #C5D4E5;
--color-primary-200: #9FB8D4;
--color-primary-400: #5A8AB8;
--color-primary-600: #2C5F8A;   ← 메인 브랜드 컬러
--color-primary-800: #1A3D5C;
--color-primary-900: #0F2640;

--color-accent-50:  #FFF3E8;
--color-accent-100: #FFD9B3;
--color-accent-200: #FFBE7D;
--color-accent-400: #F28C28;
--color-accent-600: #D4700E;   ← CTA 컬러 (매입 문의 버튼)
--color-accent-800: #8C4A09;

--color-neutral-0:   #FFFFFF;
--color-neutral-50:  #F7F6F3;  ← 교차 섹션 배경 (기존 surface 대체)
--color-neutral-100: #EDEBE6;
--color-neutral-200: #D9D6CF;
--color-neutral-400: #A8A49B;
--color-neutral-600: #6B675F;
--color-neutral-800: #3D3A34;
--color-neutral-900: #1E1C18;

--color-success: #1D9E75;
--color-danger:  #D93025;
```

**컬러 사용 원칙:**
- Primary (Steel Blue): 네비게이션, 섹션 제목 강조, 납품 버튼, 통계 수치
- Accent (Industrial Orange): 매입 관련 CTA, 뱃지, 강조 포인트
- Neutral (Warm Gray): 본문, 배경, 보더, 보조 텍스트
- Success/Danger: 매입 가능/불가 기준 카드

### 4.2 Typography

```
서체: Pretendard Variable (CDN 또는 next/font)
- 기존 Geist 서체에서 Pretendard로 교체
- 한글 가독성 + 무료 + 가변폰트

Scale (Mobile First, Tailwind class):
- text-xs (12px): 캡션, 라벨, 지역명
- text-sm (14px): 보조 텍스트, 카드 설명
- text-base (16px): 본문
- text-lg (18px): 강조 본문, 카드 제목
- text-xl (24px): 섹션 제목 (mobile)
- text-2xl (32px): 섹션 제목 (desktop)
- text-3xl (40px): 히어로 제목 (mobile)
- text-4xl (52px): 히어로 제목 (desktop)

Weight:
- 400: 본문
- 500: 라벨, 네비게이션
- 600: 카드 제목, 버튼
- 700: 섹션 제목, 히어로, 통계 수치
```

### 4.3 Spacing & Layout

```
기본 단위: 4px grid
섹션 간격: mobile 64px / desktop 96px
컨테이너: max-width 1200px, padding mobile 20px / desktop 40px

반응형 브레이크포인트:
- sm: 640px
- md: 768px  ← 주요 전환점 (1→2열, 모바일 메뉴 전환)
- lg: 1024px
- xl: 1280px
```

### 4.4 Border Radius & Shadow

```
Radius:
- sm (4px): 태그, 뱃지
- md (8px): 버튼, 인풋, 프로세스 탭
- lg (12px): 카드, 연락처 정보
- xl (16px): 히어로 Stats 바, 인프라 카드
- full (9999px): 히어로 뱃지

Shadow:
- sm: 미묘한 깊이감 (Stats 바 내부)
- md: 카드 hover 상태
- lg: Stats 바 전체, 모바일 CTA 바
```

## 5. 핵심 컴포넌트 스펙

### 5.1 Button

| Variant   | 용도                | 배경             | 텍스트    |
|-----------|---------------------|------------------|-----------|
| primary   | 매입 문의 CTA       | accent-600       | white     |
| secondary | 납품 문의, 전화     | primary-600      | white     |
| outline   | 히어로 보조 CTA     | transparent      | white     |
| ghost     | 텍스트 링크형       | transparent      | primary-600|

크기: sm(h-9 px-4) / md(h-11 px-6, 기본) / lg(h-14 px-9)
공통: font-semibold, rounded-md, transition-all duration-250
Active: scale-[0.98]

### 5.2 Card 유형

**Service Card** (매입/납품):
- 상단 3px 액센트 라인 (매입=accent, 납품=primary)
- 뱃지 + 제목 + 설명 + 체크리스트 + CTA 버튼
- hover: shadow-md, border 진해짐

**Infrastructure Card** (창고/야적장/트럭):
- 이미지 full cover + 하단 그라데이션 오버레이
- hover: 이미지 scale(1.04)
- aspect-ratio 4/3

**Stat Card** (숫자 강조):
- Stats 바 내부 아이템
- 큰 숫자(text-2xl font-bold primary-600) + 작은 라벨
- 2×2 그리드(mobile) → 4열(desktop)

**Criteria Card** (매입 기준):
- ok: green 배경 + green 보더
- no: red 배경 + red 보더
- 상태 표시(✓/✗) + 제목 + 설명

### 5.3 Section Layout

```
공통 구조:
<section class="py-16 md:py-24 {배경}">
  <div class="container mx-auto px-5 md:px-10">
    <SectionLabel />   ← 영문 라벨 + 왼쪽 액센트 라인
    <SectionTitle />   ← 한글 제목
    <SectionDesc />    ← 한글 설명 (optional)
    {콘텐츠}
  </div>
</section>

배경 교차 패턴:
Hero    → primary-900 (어두운 배경)
Stats   → white (오버랩)
About   → white
Services → neutral-50
Criteria → white
Process  → neutral-50
Infra    → white
Why      → primary-900 (어두운 배경)
Contact  → white
```

### 5.4 Navigation

**Desktop (md+):**
- 로고 좌측 / 메뉴 중앙 / CTA 버튼 우측
- 초기: 투명 배경, 흰색 텍스트
- 스크롤 후: white/blur 배경, 어두운 텍스트
- height: 72px

**Mobile (<md):**
- 로고 좌측 / 햄버거 우측
- 풀스크린 오버레이 메뉴 (primary-900 배경)
- 하단 고정 CTA 바: [전화 문의] [매입 문의] (항상 노출)

### 5.5 Contact Form

- Select (문의 구분) + 2열 Row (성함, 연락처) + Input (현장) + Textarea (내용) + Submit
- 입력 필드: border neutral-200 → focus border primary-600
- 좌측에 연락처 정보 카드 배치

## 6. lib/ui.ts 업데이트 가이드

`lib/ui.ts`에 Tailwind class 토큰을 정의한다. 모든 랜딩 페이지 컴포넌트는 이 토큰을 참조한다.

```typescript
// lib/ui.ts — 리뉴얼 토큰 예시 구조

export const ui = {
  // Button variants
  btn: {
    base: 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-250 active:scale-[0.98]',
    primary: 'bg-accent-600 text-white hover:bg-accent-400',
    secondary: 'bg-primary-600 text-white hover:bg-primary-400',
    outline: 'bg-transparent text-white border-1.5 border-white/40 hover:border-white hover:bg-white/8',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
    sm: 'h-9 px-4 text-sm rounded-md',
    md: 'h-11 px-6 text-[15px] rounded-md',
    lg: 'h-14 px-9 text-base rounded-md',
  },

  // Section wrapper
  section: {
    base: 'py-16 md:py-24',
    light: 'bg-white',
    muted: 'bg-neutral-50',
    dark: 'bg-primary-900 text-white',
  },

  // Section label (영문 작은 라벨)
  label: 'inline-flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3 before:content-[""] before:w-5 before:h-0.5 before:bg-accent-600 before:rounded-full',

  // Section title
  title: 'text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight leading-tight mb-4',

  // Section description
  desc: 'text-[15px] text-neutral-600 leading-relaxed max-w-xl',

  // Container
  container: 'mx-auto max-w-[1200px] px-5 md:px-10',
} as const;
```

## 7. globals.css @theme 블록 변경 가이드

기존 `@theme` 블록의 color 값을 아래로 교체한다.
Tailwind v4에서는 `@theme`에 정의하면 `bg-primary-600`, `text-accent-400` 등으로 바로 사용 가능.

```css
@theme {
  /* === Brand Colors === */
  --color-primary-50:  #E8EEF4;
  --color-primary-100: #C5D4E5;
  --color-primary-200: #9FB8D4;
  --color-primary-400: #5A8AB8;
  --color-primary-600: #2C5F8A;
  --color-primary-800: #1A3D5C;
  --color-primary-900: #0F2640;

  --color-accent-50:  #FFF3E8;
  --color-accent-100: #FFD9B3;
  --color-accent-200: #FFBE7D;
  --color-accent-400: #F28C28;
  --color-accent-600: #D4700E;
  --color-accent-800: #8C4A09;

  --color-neutral-0:   #FFFFFF;
  --color-neutral-50:  #F7F6F3;
  --color-neutral-100: #EDEBE6;
  --color-neutral-200: #D9D6CF;
  --color-neutral-400: #A8A49B;
  --color-neutral-600: #6B675F;
  --color-neutral-800: #3D3A34;
  --color-neutral-900: #1E1C18;

  --color-success: #1D9E75;
  --color-danger:  #D93025;

  /* === 기존 토큰 호환 (점진적 마이그레이션) === */
  --color-accent:      #2C5F8A;  /* 기존 accent → primary로 교체 */
  --color-accent-dark: #1A3D5C;
  --color-brand-navy:  #0F2640;
  --color-surface:     #F7F6F3;  /* 기존 surface → neutral-50 */
  --color-foreground:  #1E1C18;
  --color-muted:       #6B675F;
  --color-border:      #D9D6CF;
  --color-card:        #FFFFFF;

  /* === Typography === */
  --font-sans: 'Pretendard Variable', 'Pretendard', system-ui, sans-serif;

  /* === Radius === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

## 8. 폰트 변경 (Geist → Pretendard)

`app/layout.tsx`에서 서체 로딩 방식 변경:

```typescript
// 방법 1: CDN (간단)
// <head>에 추가:
// <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet">

// 방법 2: next/font/local (성능 최적)
// public/fonts/에 PretendardVariable.subset.woff2 배치 후:
import localFont from 'next/font/local';
const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.subset.woff2',
  variable: '--font-sans',
  display: 'swap',
});
```

## 9. 작업 순서 (Claude Code에서의 실행 순서)

```
Phase 1: 토큰 세팅
  1. globals.css @theme 블록 업데이트
  2. lib/ui.ts 토큰 객체 업데이트
  3. app/layout.tsx 폰트 변경 (Geist → Pretendard)
  4. npm run build 로 깨지는 부분 확인

Phase 2: 컴포넌트 리뉴얼 (landing 영역만)
  5. Navigation (Header) — 스크롤 반응 + 모바일 메뉴
  6. Hero 섹션 — 다크 배경 + 배경 패턴 + CTA
  7. Stats 바 — 오버랩 카드 그리드
  8. About 섹션 — 이미지 + 텍스트 split
  9. Services 섹션 — 매입/납품 카드
  10. Criteria 섹션 — 매입 기준 카드
  11. Process 섹션 — 탭 전환 + 스텝
  12. Infrastructure 섹션 — 이미지 카드 그리드
  13. Why SL Steel 섹션 — 다크 배경 + 아이콘 그리드
  14. Contact 섹션 — 폼 + 연락처 정보
  15. Footer
  16. 모바일 하단 고정 CTA 바 (새로 추가)

Phase 3: 검증
  17. npm run build 성공 확인
  18. 모바일 반응형 확인 (320px ~ 768px)
  19. 블로그 영향 없는지 확인
```

## 10. 주의사항

1. **블로그 영역은 절대 수정하지 않는다** — `app/blog/`, `components/blog/`, `lib/blog.ts`
2. **lib/site.ts의 데이터 구조는 유지한다** — 전화번호, 카피 등 SITE 상수 구조
3. **Tailwind v4 문법** — `bg-linear-to-t` 사용 (`bg-gradient-to-t` 아님)
4. **이미지 경로** — 랜딩 페이지는 `public/images/` 로컬 이미지 사용
5. **Server Component 기본** — 클라이언트 상태가 필요한 컴포넌트만 `'use client'` 추가
6. **globals.css 수정 시** — 기존 토큰명 호환 레이어 유지 (블로그에서 참조 가능)
7. **Supabase inquiries 테이블** — Contact 폼 제출은 기존 로직 유지