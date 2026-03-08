# SL Steel — Claude 문서 인덱스

이 디렉토리의 문서들은 Claude Code(개발)와 Claude Project(기획·콘텐츠) 양쪽에서
컨텍스트를 공유하기 위해 관리합니다.

---

## 어디서 무엇을 읽어야 하나

### Claude Code (개발 작업)
> 코드 작성, 기능 구현, 버그 수정 등 기술 작업 시

| 파일 | 내용 |
|------|------|
| `CLAUDE.md` ← **루트** | 명령어, 아키텍처, 파일 구조, 설계 결정 |
| `docs/claude-project/site-structure.md` | 섹션 구조, URL, 개발 로드맵 |

### Claude Project (기획·콘텐츠 작업)
> 블로그 글 작성, 카피 작성, 마케팅 기획 등 비개발 작업 시
> → claude.ai 프로젝트에 아래 파일들을 업로드

| 파일 | 내용 |
|------|------|
| `docs/claude-project/brand-guide.md` | 브랜드 정보, 톤 & 보이스, 주의사항 |
| `docs/claude-project/site-structure.md` | 현재 홈페이지 구조, 섹션별 메시지 |
| `docs/claude-project/blog-strategy.md` | 블로그 전략, 콘텐츠 계획, 작성 방법 |
| `docs/claude-project/blog-prompt.md` | **블로그 자동 작성 프롬프트** (커스텀 인스트럭션용) |

---

## 파일별 역할 요약

### `brand-guide.md`
SL Steel의 브랜드 정체성 전반. 새로운 Claude 세션에서 가장 먼저 읽어야 할 파일.
- 회사 기본 정보 (연락처, 권역, 업력)
- 핵심 사업 내용 및 매입 기준
- 타깃 고객 및 페인포인트
- 커뮤니케이션 톤 & 보이스
- 표현 가이드 (피해야 할 것 / 선호하는 것)

### `site-structure.md`
현재 운영 중인 홈페이지의 구조와 내용.
- 랜딩 페이지 9개 섹션 순서 및 핵심 카피
- 블로그 섹션 구조
- 개발 로드맵 (완료·예정 항목)

### `blog-strategy.md`
블로그 운영 전략 및 콘텐츠 계획.
- SEO 키워드 목록
- 콘텐츠 아이디어 20선 (발행 여부 표시)
- 포스팅 구조 템플릿
- Supabase DB 기반 작성 방법

### `blog-prompt.md`
Claude.ai 프로젝트 **커스텀 인스트럭션**에 복사할 프롬프트.
- 현장 사진 + 키워드 → JSON 블로그 포스트 자동 생성
- `[사진N]` 마커로 이미지 위치 지정
- `categories` 배열로 멀티 카테고리 출력

---

## 문서 업데이트 원칙

- 기능이 추가/변경될 때마다 `site-structure.md` 로드맵 업데이트
- 블로그 포스트 발행 시 `blog-strategy.md` 발행 계획 상태 업데이트
- 브랜드 방향 변경 시 `brand-guide.md` 업데이트
- 기술 아키텍처 변경 시 루트 `CLAUDE.md` 업데이트
