"use client";

import { useEffect, useState } from "react";
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
  const { address, phone, email } = SITE.footer;
  const { title, subtitle, fields, privacy } = SITE.contact;

  const [inquiryType, setInquiryType] = useState<InquiryType>(INQUIRY_TYPES[0]);

  // 마운트 시 hash 읽어서 select 기본값 설정
  useEffect(() => {
    setInquiryType(resolveTypeFromHash());
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("문의 접수:", data);
  }

  return (
    <section id="contact" className={ui.sectionAlt}>
      <div className={ui.container}>
        <div className="grid gap-12 lg:grid-cols-[40fr_60fr] lg:items-start">

          {/* ── 좌측: 안내 텍스트 ────────────────────────────────── */}
          <div>
            <p className={ui.eyebrow}>Contact</p>
            <h2 className={ui.h2Display}>{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted break-keep">
              {subtitle}
            </p>

            {/* 연락처 정보 */}
            <div className="mt-8 space-y-3 text-sm text-muted">
              <div className="flex items-start gap-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-accent">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{address}</span>
              </div>
              {phone && (
                <div className="flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-accent">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.41 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 5.9 5.9l.83-.83a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <a href={`tel:${phone}`} className="hover:text-accent transition-colors">{phone}</a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-accent">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
                </div>
              )}
            </div>
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
                  placeholder="경주, 포항, 울산 등"
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