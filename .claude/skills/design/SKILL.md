---
name: design
description: 랜딩 페이지 디자인 수정, UI 개선, 컴포넌트 스타일 변경, 색상/폰트/레이아웃 조정 시 사용. 디자인 리뉴얼, 디자인 수정, UI 변경, 스타일 수정 등의 요청에 자동 적용.
allowed-tools: Read, Grep, Edit, Write, Glob
argument-hint: "[수정 대상 또는 지시사항]"
---

# SL Steel 디자인 시스템 스킬

디자인 관련 작업 시 반드시 아래 절차를 따른다.

## 1. 작업 전 필수 참조

작업 시작 전에 아래 3개 파일을 반드시 읽는다:

1. **`DESIGN_SYSTEM_GUIDE.md`** — 컬러 팔레트, 타이포, 컴포넌트 스펙, 사용 원칙
2. **`app/globals.css`** @theme 블록 — 현재 정의된 디자인 토큰 확인
3. **`lib/ui.ts`** — 현재 Tailwind class 토큰 확인

## 2. 디자인 원칙

### 컬러 사용
- **Primary (Steel Blue)**: 네비게이션, 섹션 제목, 납품 버튼, 통계 수치
- **Accent (Industrial Orange)**: 매입 CTA, 뱃지, 강조 포인트
- **Neutral (Warm Gray)**: 본문, 배경, 보더, 보조 텍스트
- 하드코딩 금지 — 반드시 `globals.css` @theme 토큰 또는 `ui.ts` 토큰 사용

### 컴포넌트 스타일
- 버튼: `ui.btn.base` + variant(`primary`/`secondary`/`outline`/`ghost`) + size(`sm`/`md`/`lg`) 조합
- 섹션: `ui.section` / `ui.sectionAlt` / `ui.sectionDark`
- 섹션 헤더: `ui.label` (영문 라벨) + `ui.title` (한글 제목) + `ui.desc` (설명)
- 카드: `ui.card` + `ui.cardPad`

### 반응형
- 모바일 퍼스트 (base → sm → md → lg)
- md(768px)가 주요 전환점 (1→2열, 모바일 메뉴 전환)
- 모바일 하단 CTA 바 가려짐 주의 (하단 여백)

### Tailwind v4 주의
- 그라데이션: `bg-linear-to-t` (v3의 `bg-gradient-to-t` 아님)
- @theme 토큰: `bg-primary-600`, `text-accent-400` 등으로 직접 사용

## 3. 수정 범위 제한

- **수정 가능**: `app/(landing)/`, `components/` (landing 관련), `lib/ui.ts`, `app/globals.css`
- **수정 금지**: `app/blog/`, `components/blog/`, `lib/blog.ts`, `lib/supabase.ts`

## 4. 작업 후 검증

- 새로운 컬러를 사용했다면 `globals.css` @theme에 토큰으로 정의했는지 확인
- `lib/ui.ts`에 재사용 가능한 패턴이면 토큰으로 추가했는지 확인
- 기존 블로그 영역에서 참조하는 호환 토큰(`--color-accent`, `--color-surface` 등)을 깨뜨리지 않았는지 확인