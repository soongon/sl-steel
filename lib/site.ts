// 사용 예시:
// import { SITE } from "@/lib/site"
// <h1>{SITE.hero.h1}</h1>
// <p>{SITE.brand.ko}</p>

// ─── 문의 타입 ────────────────────────────────────────────────────────────────

export const INQUIRY_TYPES = ["매입 문의", "납품 문의"] as const;
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
    title: "SL Steel | 현장 철근 전문 매입",
    description:
      "녹 발생 철근·4m 이상 절단 철근 합리적 매입. 경북 경주 기반 현장 직수거.",
  },

  // 히어로 섹션
  hero: {
    h1: "공사 후 남은 철근, 최고가로 매입합니다",
    subcopy:
      "녹이 슬었거나 절단된 철근도 명확한 기준으로 현장에서 직접 수거합니다.\n공사 후 남은 철근의 가치를 SL Steel이 연결합니다.",
    badges: ["대형 창고", "야적장", "5톤·25톤 크레인 카고 트럭"] as const,
    cta: {
      primary: "매입 문의" as InquiryType,
      secondary: "납품 문의" as InquiryType,
    },
  },

  // Key Points 3카드
  points: [
    {
      title: "녹슨 철근 매입",
      desc: "표면에 녹이 발생한 온전한 철근, 상품성 없어도 합리적 기준으로 매입합니다",
    },
    {
      title: "절단 철근도 OK",
      desc: "4m 이상 절단 철근도 매입 가능. 현장에서 처리 어렵던 자재를 직접 수거합니다",
    },
    {
      title: "현장 직수거",
      desc: "5톤·25톤 크레인 카고 트럭으로 현장에 직접 방문. 별도 운반 부담이 없습니다",
    },
  ] as const,

  // About 섹션
  about: {
    title: "공사 후 현장에 남은 철근, SL Steel이 가져갑니다",
    body: "공사 후 현장에 남은 녹슨 철근이나 작업 중 절단된 철근은 일반적으로 처리가 어렵습니다.\nSL Steel은 이러한 공사 후 남은 철근을 최고가에 직접 매입·수거합니다.",
    steps: [
      { label: "전화 한 통",  sub: "연락 즉시 상담" },
      { label: "현장 직방문", sub: "트럭 직접 출동" },
      { label: "즉시 정산",   sub: "현장에서 바로"  },
    ] as const,
  },

  // Business 섹션
  business: {
    recovery: {
      title: "현장 철근 전문 매입",
      lead: "녹슨 철근과 절단 철근, 명확한 기준으로 합리적 가격에 매입합니다.",
      table: {
        target: "녹 발생 온전한 철근 / 4m 이상 절단 철근",
        exclude: "휘거나 3.5m 이하 철근 · 일반 고철",
      },
      bullets: [
        "현장 직접 수거",
        "빠른 정산",
        "보관 공간 확보",
        "합리적 매입가",
      ] as const,
      notice: "휘거나 3.5m 이하 철근 및 일반 고철은 매입하지 않습니다.",
      cta: "매입 문의" as InquiryType,
    },
    delivery: {
      title: "철근·H빔 납품",
      bullets: ["대량 재고 보유", "현장 직납", "긴급 대응", "안정 공급"] as const,
      cta: "납품 문의" as InquiryType,
    },
  },

  // System 3카드
  system: [
    {
      title: "대형 창고",
      desc: "철근 보관/재고 운영",
      value: "수거 즉시 입고·보관",
    },
    {
      title: "야적장",
      desc: "대형 자재 적치",
      value: "대형 물량도 안정 대응",
    },
    {
      title: "5톤·25톤 크레인 카고 트럭",
      desc: "상하차 및 운송",
      value: "소형·대형 물량 모두 대응",
    },
  ] as const,

  // Process 섹션 — 매입 탭이 첫 번째
  process: {
    tabs: ["매입 프로세스", "납품 프로세스"] as const,
    recovery: {
      steps: ["문의", "상태 확인", "매입가 제시", "현장 수거", "정산"] as const,
    },
    delivery: {
      steps: ["문의", "견적/일정", "출고", "현장 납품", "사후 대응"] as const,
    },
  },

  // Why 섹션
  why: {
    checklist: [
      "녹슨 철근·4m↑ 절단 철근 모두 명확한 기준으로 매입",
      "5톤·25톤 크레인 카고 트럭으로 현장 직수거 — 별도 운반 불필요",
      "최고가 매입 — 상품성 없어도 최고가에 가져갑니다",
      "매입과 납품을 함께 운영하는 현장 밀착 구조",
    ] as const,
  },

  // Contact 섹션
  contact: {
    title: "철근 매입 문의",
    subtitle:
      "녹 발생 철근·절단 철근 매입 상담을 바로 도와드립니다. 납품 문의도 함께 받습니다.",
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
    { value: "2009년~", label: "업력" },
    { value: "중부·남부권", label: "전국 거점 네트워크" },
    { value: "4m↑", label: "절단 철근 매입 기준" },
    { value: "당일 수거", label: "현장 직접 방문" },
  ] as const,

  // 매입 대상 품목
  products: [
    {
      name: "녹 발생 철근",
      spec: "온전한 길이",
      desc: "표면에 녹이 발생했으나 절단되지 않은 원형·이형철근",
      available: true,
    },
    {
      name: "절단 철근",
      spec: "4m 이상",
      desc: "현장 작업 중 절단된 4m 이상 철근",
      available: true,
    },
    {
      name: "매입 불가 항목",
      spec: "제외 기준",
      desc: "휘거나 3.5m 이하 철근 · 일반 고철",
      available: false,
    },
  ] as const,

  // 푸터
  footer: {
    tagline: "녹슨 철근·절단 철근 합리적 매입. 현장 직수거로 빠르게 처리합니다.",
    email: "sl-steel@gmail.com",
    kakao: "",   // 카카오 채널 URL 확정 후 입력
    regions: [
      { name: "대표 전화", phone: "02-3462-5710", coverage: "" },
      { name: "중부권",    phone: "010-5295-9288", coverage: "경기·강원·충청" },
      { name: "남부권",    phone: "010-5038-5710", coverage: "경상·전라" },
    ] as const,
  },
} as const;
