// 사용 예시:
// import { SITE } from "@/lib/site"
// <h1>{SITE.hero.h1}</h1>
// <p>{SITE.brand.ko}</p>

// ─── 섹션 앵커 ────────────────────────────────────────────────────────────────

export const NAV_SECTIONS = [
  "hero",
  "points",
  "about",
  "business",
  "system",
  "process",
  "why",
  "contact",
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number];

// ─── 문의 타입 ────────────────────────────────────────────────────────────────

export const INQUIRY_TYPES = ["납품 문의", "매입 문의"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

// ─── 메인 상수 ────────────────────────────────────────────────────────────────

export const SITE = {
  // 브랜드
  brand: {
    en: "SL Steel",
    ko: "SL 철강",
  },

  // SEO 메타
  seo: {
    title: "SL Steel | 현장을 잇는 철강 유통 전문 기업",
    description:
      "철근·H빔 안정 공급과 표면 녹 발생 철근 가치 매입까지. 자체 물류 기반 현장 대응.",
  },

  // 히어로 섹션
  hero: {
    h1: "현장을 잇는 철강 유통 전문 기업",
    subcopy:
      "철근과 H빔의 안정적인 공급, 그리고 사용이 어려운 철근의 가치 회수까지.\nSL Steel은 철강의 흐름을 연결합니다.",
    badges: ["대형 창고", "야적장", "크레인 장착 5톤 트럭"] as const,
    cta: {
      primary: "납품 문의" as InquiryType,
      secondary: "매입 문의" as InquiryType,
    },
  },

  // Key Points 3카드
  points: [
    {
      title: "안정적 공급",
      desc: "철근·H빔 재고 기반으로 현장 요구에 빠르게 대응",
    },
    {
      title: "가치 회수",
      desc: "표면 녹 발생 철근을 합리적 기준으로 매입",
    },
    {
      title: "자체 물류",
      desc: "크레인 장착 5톤 트럭으로 상하차·운송까지 대응",
    },
  ] as const,

  // About 섹션
  about: {
    title: "건설 현장의 시작과 마무리를 연결합니다",
    body: "SL 철강은 경상북도 경주시를 기반으로 철근 및 H빔을 전문 유통하는 철강 기업입니다.\n대형 창고와 야적장, 크레인 장착 5톤 트럭을 보유해 현장 요구에 신속히 대응합니다.",
  },

  // Business 섹션
  business: {
    delivery: {
      title: "철근·H빔 전문 납품",
      bullets: ["대량 재고 보유", "현장 직납", "긴급 대응", "안정 공급"] as const,
      cta: "납품 문의" as InquiryType,
    },
    recovery: {
      title: "자재 가치 회수 사업",
      lead: "사용이 어려워진 철근의 가치를 다시 연결합니다.",
      table: {
        target: "표면에 녹이 발생한 온전한 철근",
        exclude: "절단·훼손 폐철근, 일반 고철",
      },
      bullets: [
        "현장 잔여 처리",
        "보관 공간 확보",
        "자재 손실 최소화",
        "합리적 매입",
      ] as const,
      notice: "폐철근/일반 고철은 취급하지 않습니다.",
      cta: "매입 문의" as InquiryType,
    },
  },

  // System 3카드
  system: [
    {
      title: "대형 창고",
      desc: "철근 보관/재고 운영",
      value: "필요할 때 바로 출고",
    },
    {
      title: "야적장",
      desc: "대형 자재 적치",
      value: "대형 물량도 안정 대응",
    },
    {
      title: "크레인 장착 5톤 트럭",
      desc: "상하차 및 운송",
      value: "현장 작업 부담 감소",
    },
  ] as const,

  // Process 섹션
  process: {
    tabs: ["납품 프로세스", "매입 프로세스"] as const,
    delivery: {
      steps: ["문의", "견적/일정", "출고", "현장 납품", "사후 대응"] as const,
    },
    recovery: {
      steps: ["문의", "상태 확인", "매입가 제시", "회수", "정산"] as const,
    },
  },

  // Why 섹션
  why: {
    checklist: [
      "납품과 회수를 함께 보는 구조적 운영",
      "재고·물류 자체 보유",
      "자재 흐름을 끊지 않는 연결형 서비스",
      "정직한 커뮤니케이션",
    ] as const,
  },

  // Contact 섹션
  contact: {
    title: "납품 · 매입 문의",
    subtitle:
      "철근·H빔 납품 문의와 표면 녹 철근 매입 상담을 빠르게 도와드립니다.",
    fields: {
      name: "성함/업체명",
      phone: "연락처",
      location: "현장/지역",
      message: "문의 내용",
    },
    privacy: "문의 응대를 위해 연락처를 수집합니다.",
  },

  // 통계 수치
  stats: [
    { value: "15년+", label: "업력" },
    { value: "경북 경주", label: "지역 거점" },
    { value: "당일 출고", label: "재고 보유 품목" },
    { value: "납품+회수", label: "원스톱 서비스" },
  ] as const,

  // 취급 품목
  products: [
    { name: "H빔",   spec: "KS D 3503 · SS400", desc: "철골 구조, 교량, 건축 기둥" },
    { name: "철근",  spec: "KS D 3504 · SD400",  desc: "RC 구조물, 슬래브, 기초" },
    { name: "각관",  spec: "KS D 3568 · SGH275", desc: "구조체, 파티션, 가설물" },
    { name: "철판",  spec: "KS D 3503 · SS400",  desc: "배관 플레이트, 보강재" },
    { name: "앵글",  spec: "KS D 3503 · SS400",  desc: "브래킷, 프레임, 보강재" },
    { name: "C형강", spec: "KS D 3530 · G540",  desc: "지붕 purlin, 내외장 골조" },
  ] as const,

  // 푸터
  footer: {
    address: "경상북도 경주시 충효동",
    phone: "010-0000-0000",
    email: "sl-steel@gmail.com",
    kakao: "https://pf.kakao.com/_xxxxx",
  },
} as const;