# 신라철강 로고 패키지 — B-1 크라운 + T-2 타이포

확정안: 심볼 **B-1 크라운**(신라 금관 出 모티프 — 세 기둥 + 베이스 + 곡옥 골드) + 워드마크 **T-2**(Pretendard Bold 700 / 자간 +0.12em). 워드마크가 들어간 SVG는 모두 폰트를 **아웃라인(패스)** 처리해서 폰트 미설치 환경(인쇄소·소셜·외부 문서)에서도 동일하게 보입니다.

## 파일 구성

| 파일 | 용도 |
|---|---|
| `logo-symbol.svg` / `logo-symbol-white.svg` | 심볼 단독 (라이트/다크 배경) |
| `logo-horizontal.svg` / `logo-horizontal-white.svg` | 가로형 락업 — 문서·간판·배너 |
| `logo-stacked.svg` / `logo-stacked-white.svg` | 세로 스택 — 히어로·명함·현수막 (자간 +0.3em) |
| `favicon.svg` | 브라우저 탭 (다크모드 자동 반전 내장) |
| `favicon-16/32/48.png` | 구형 브라우저 대응 |
| `apple-touch-icon-180.png` | iOS 홈 화면 |
| `profile-512.png` | 네이버 플레이스·카카오채널 프로필 |
| `Logo.tsx` | Next.js 컴포넌트 (네비바·푸터용, 텍스트는 실제 폰트로 렌더) |

## 컬러 토큰

```css
--brand-steel-700: #1B3A5C;  /* 심볼·주조색 */
--brand-steel-900: #0F1B29;  /* 워드마크 텍스트·다크 배경 */
--brand-gold:      #C9A227;  /* 곡옥 포인트 — 로고 외 남용 금지 */
--brand-orange:    #F0641E;  /* CTA 전용 (기존 유지) */
```

## 타이포 스펙 (T-2)

- 네비바·본문 타이틀: Pretendard **700 / letter-spacing +0.12em** (끝 글자 보정 `margin-right:-0.12em`)
- 히어로·명함 등 큰 지면: Pretendard 600~700 / **+0.2~0.3em** (세로 스택 락업과 동일)
- 영문 서브: Pretendard SemiBold / +0.46em / 소형

## `<head>` 적용 스니펫

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
```

## SL철강 → 신라철강 교체 체크리스트 (코드 적용 시)

- [ ] 전역 텍스트 치환: `SL철강` → `신라철강` (컴포넌트·카피·상수)
- [ ] 헤더/푸터 로고 → `Logo.tsx` 교체
- [ ] `layout.tsx` metadata: title / description / openGraph.siteName
- [ ] OG 이미지 · JSON-LD(Organization name) · sitemap
- [ ] favicon 세트 교체 (`/public`)
- [ ] 이메일 서명·견적서 템플릿 등 사이트 외 자산은 별도 반영
