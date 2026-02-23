"use client";

import { useEffect, useState, startTransition } from "react";
import { SITE, INQUIRY_TYPES, type InquiryType } from "@/lib/site";
import { ui } from "@/lib/ui";

// "#contact?type=납품" → "납품 문의" 파싱
function resolveTypeFromHash(): InquiryType {
  if (typeof window === "undefined") return INQUIRY_TYPES[0];
  const raw = window.location.hash; // e.g. "#contact?type=납품"
  const match = raw.match(/type=([^&]+)/);
  if (!match) return INQUIRY_TYPES[0];
  const keyword = decodeURIComponent(match[1]);
  const found = INQUIRY_TYPES.find((t) => t.startsWith(keyword));
  return found ?? INQUIRY_TYPES[0];
}

const inputBase =
  "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

export default function ContactSection() {
  const { email, kakao, regions } = SITE.footer;
  const { title, subtitle, fields, privacy } = SITE.contact;

  const [inquiryType, setInquiryType] = useState<InquiryType>(INQUIRY_TYPES[0]);

  // 마운트 시 hash 읽어서 select 기본값 설정
  useEffect(() => {
    startTransition(() => setInquiryType(resolveTypeFromHash()));
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("문의 접수:", data);
  }

  return (
    <section id="contact" className={ui.section}>
      <div className={ui.container}>
        <div className="grid gap-12 lg:grid-cols-[40fr_60fr] lg:items-start">

          {/* ── 좌측: 안내 텍스트 ────────────────────────────────── */}
          <div>
            <p className={ui.eyebrow}>Contact</p>
            <h2 className={ui.h2Display}>{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted break-keep">
              {subtitle}
            </p>

            {/* 지역별 연락처 */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {regions.map((region) => (
                <a
                  key={region.name}
                  href={`tel:${region.phone}`}
                  className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-card"
                >
                  <span className="text-xs font-semibold text-accent">{region.name}</span>
                  <span className="text-base font-bold text-foreground tabular-nums">{region.phone}</span>
                </a>
              ))}
            </div>

            {/* 카카오 문의 버튼 */}
            {kakao && (
              <div className="mt-4">
                <a
                  href={kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#FEE500] px-6 text-sm font-semibold text-[#3A1D1D] hover:opacity-90 transition-opacity"
                >
                  카카오로 문의하기
                </a>
              </div>
            )}

            {/* 이메일 */}
            {email && (
              <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-accent">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
              </div>
            )}
          </div>

          {/* ── 우측: 폼 카드 ─────────────────────────────────────── */}
          <div className={`${ui.card} ${ui.cardPad}`}>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* 문의 구분 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  문의 구분
                </label>
                <select
                  name="inquiryType"
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                  className={inputBase}
                >
                  {INQUIRY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* 성함/업체명 + 연락처 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {fields.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="홍길동 / (주)건설"
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {fields.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="010-0000-0000"
                    required
                    className={inputBase}
                  />
                </div>
              </div>

              {/* 현장/지역 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {fields.location}
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="예) 경기 화성시, 천안, 전주 등"
                  className={inputBase}
                />
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {fields.message}
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="규격, 수량, 납기 등 필요한 내용을 자유롭게 적어주세요."
                  className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* 개인정보 수집 안내 */}
              <p className="text-xs text-muted">{privacy}</p>

              {/* 제출 버튼 */}
              <button type="submit" className={`${ui.btn.primary} h-12 w-full justify-center`}>
                문의 보내기
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}