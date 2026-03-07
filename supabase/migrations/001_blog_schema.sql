-- ============================================================
-- SL Steel 블로그 스키마
-- Supabase SQL Editor에서 실행
-- ============================================================

-- ── 카테고리 ──────────────────────────────────────────────────

create table categories (
  id serial primary key,
  name text not null unique,
  sort_order int not null default 0
);

insert into categories (name, sort_order) values
  ('매입 기준', 1),
  ('현장 실무', 2),
  ('업계 정보', 3),
  ('시설·인프라', 4),
  ('수거 사례', 5);

-- RLS: 누구나 읽기 가능
alter table categories enable row level security;
create policy "categories_public_read" on categories
  for select using (true);

-- ── 포스트 ────────────────────────────────────────────────────

create type post_status as enum ('draft', 'published');

create table posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  category text not null references categories(name),
  excerpt text not null default '',
  content text not null default '',
  thumbnail_url text,
  status post_status not null default 'draft',
  view_count int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- slug 검색 인덱스
create index posts_slug_idx on posts (slug);
-- 발행 목록 조회용 복합 인덱스
create index posts_published_idx on posts (status, published_at desc);

-- RLS: published 포스트만 공개 읽기
alter table posts enable row level security;
create policy "posts_public_read" on posts
  for select using (status = 'published');

-- updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- ── 기존 MDX 포스트 마이그레이션 ──────────────────────────────

insert into posts (slug, title, category, excerpt, content, thumbnail_url, status, published_at) values
(
  'rebar-buyout-guide',
  '현장 철근 매입 기준 완전 정리 — 녹슨 철근도 팔 수 있나?',
  '매입 기준',
  '표면에 녹이 발생한 철근도 기준에 맞으면 전량 매입합니다. 어떤 철근이 매입 가능하고 불가능한지 명확한 기준을 정리했습니다.',
  E'건설 현장 마무리 단계에서 가장 처리하기 어려운 자재 중 하나가 바로 남은 철근입니다. 특히 표면에 녹이 발생했거나 작업 중 절단된 철근은 일반 고철로 처리하기 애매해 현장에 그대로 방치되는 경우가 많습니다.\n\nSL Steel은 이런 철근을 명확한 기준으로 매입합니다. 어떤 철근이 매입 가능하고, 어떤 게 불가능한지 정리해 드립니다.\n\n## 매입 가능한 철근\n\n### 1. 녹 발생 온전한 철근\n\n표면에 붉은 녹이 발생했더라도, **절단되지 않은 온전한 길이**라면 매입 가능합니다. 단순 표면 녹은 철근의 구조적 성능에 큰 영향을 주지 않기 때문입니다.\n\n### 2. 4m 이상 절단 철근\n\n작업 중 절단된 철근도 **4m 이상**이면 매입합니다. 4m 기준은 실제 유통과 재활용이 가능한 최소 길이입니다.\n\n## 매입 불가 항목\n\n- 휘거나 변형된 철근\n- 3.5m 이하 단척 철근\n- 일반 고철 (철근 외 금속류)\n\n## 문의 전 준비사항\n\n연락 전 간단히 파악해 두시면 상담이 빠릅니다.\n\n1. 철근 종류 (이형/원형)\n2. 대략적인 수량 (묶음 수 또는 톤)\n3. 현장 위치 (도·시 단위)\n4. 보관 상태 (야외 적치 여부)\n\n전화 한 통이면 나머지는 저희가 현장에서 직접 확인합니다.',
  '/images/warehouse-rebar.jpg',
  'published',
  '2026-02-20T00:00:00Z'
),
(
  'crane-truck-site-prep',
  '크레인 트럭 상하차 시 현장 준비사항 — 소장님이 알아두면 좋은 것들',
  '현장 실무',
  '5톤·25톤 크레인 카고 트럭이 현장에 들어오기 전 확인해야 할 진입로·작업 공간 기준을 정리했습니다.',
  E'크레인 카고 트럭이 현장에 진입하기 위해서는 몇 가지 기본 조건이 필요합니다. 미리 확인해 두시면 당일 작업이 훨씬 빠르게 진행됩니다.\n\n## 진입로 기준\n\n### 5톤 크레인 카고\n\n- 최소 폭: **3m 이상**\n- 높이 제한: 4m 이상 (전선·지붕 등)\n- 회전 반경: 약 8m\n\n### 25톤 크레인 카고\n\n- 최소 폭: **4m 이상**\n- 높이 제한: 4.5m 이상\n- 회전 반경: 약 12m\n\n## 작업 공간\n\n크레인 작업을 위해 트럭 옆면에 최소 3m 이상의 공간이 확보되어야 합니다. 작업 반경 내 다른 차량이나 장비가 없어야 안전하게 작업이 가능합니다.\n\n## 철근 적치 상태\n\n수거가 원활하도록 아래 조건을 미리 갖춰 두시면 작업 시간이 단축됩니다.\n\n- 철근이 한 곳에 모여 있을수록 빠릅니다\n- 묶음 상태가 아닌 산적 상태도 괜찮습니다\n- 야외 적치도 문제 없습니다\n\n## 문의 시 알려주시면 좋은 정보\n\n현장 상황을 미리 공유해 주시면 적합한 차량을 배정해 드립니다.\n\n- 진입로 폭과 높이 제한 여부\n- 작업 공간 확보 가능 여부\n- 철근 적치 위치 (창고 내부 / 야외)\n- 대략적인 물량 규모',
  '/images/facility-truck-wide.jpg',
  'published',
  '2026-02-10T00:00:00Z'
),
(
  'sl-steel-infrastructure',
  'SL Steel 창고·야적장·트럭 인프라 소개 — 당일 수거가 가능한 이유',
  '시설·인프라',
  '대형 창고, 야적장, 5톤·25톤 크레인 카고 트럭. 자체 물류 시스템이 당일 수거와 즉시 정산을 가능하게 합니다.',
  E'SL Steel이 당일 수거와 즉시 정산을 제공할 수 있는 이유는 단순합니다. 외부 업체에 의존하지 않고, 보관부터 운송까지 모든 과정을 직접 운영하기 때문입니다.\n\n## 대형 창고\n\n수거 즉시 입고·보관이 가능한 대형 창고를 운영합니다. 별도 야적 준비 없이 현장에서 가져온 철근을 즉시 처리할 수 있습니다.\n\n창고 운영의 핵심은 **재고 회전**입니다. 들어오는 물량을 빠르게 처리하는 시스템이 갖춰져 있기 때문에, 매입 후 정산까지의 시간이 최소화됩니다.\n\n## 야적장\n\n대형 물량도 안정적으로 대응하는 야적장을 보유하고 있습니다. 대규모 현장에서 한꺼번에 수거하는 물량도 처리가 가능합니다.\n\n## 5톤·25톤 크레인 카고 트럭\n\n소형 현장부터 대형 현장까지 모두 대응합니다.\n\n- **5톤**: 소형 현장, 좁은 진입로 현장 적합\n- **25톤**: 대형 물량, 넓은 현장 적합\n\n자체 트럭 운영으로 외부 운송 비용 없이 현장에 직접 출동합니다.\n\n## 2009년부터 쌓아온 노하우\n\n2009년 창업 이후 중부권(경기·강원·충청)과 남부권(경상·전라) 전반에 걸쳐 수거 경험을 쌓아왔습니다. 현장 상황에 맞는 효율적인 수거 방법을 알고 있습니다.\n\n처음 연락하시는 분들도 안심하고 문의해 주세요. 철근 종류, 수량, 위치만 알려주시면 나머지는 저희가 안내해 드립니다.',
  '/images/warehouse-large.jpg',
  'published',
  '2026-01-15T00:00:00Z'
);
