"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { SITE, INQUIRY_TYPES, type InquiryType } from "@/lib/site";
import { ui } from "@/lib/ui";
import { submitInquiry } from "@/lib/inquiries";

function resolveTypeFromHash(): InquiryType {
  if (typeof window === "undefined") return INQUIRY_TYPES[0];
  const raw = window.location.hash;
  const match = raw.match(/type=([^&]+)/);
  if (!match) return INQUIRY_TYPES[0];
  const keyword = decodeURIComponent(match[1]);
  const found = INQUIRY_TYPES.find((t) => t.startsWith(keyword));
  return found ?? INQUIRY_TYPES[0];
}

const inputBase =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-foreground placeholder:text-steel/50 outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20";

export default function ContactSection() {
  const { email, kakao, regions } = SITE.footer;
  const { title, subtitle, fields, privacy } = SITE.contact;

  const [inquiryType, setInquiryType] = useState<InquiryType>(INQUIRY_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const sync = () => startTransition(() => setInquiryType(resolveTypeFromHash()));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("inquiry_type", inquiryType);
      await submitInquiry(formData);
      setSubmitted(true);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "문의 접수에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className={ui.section}>
      <div className={ui.container}>
        <div className="grid gap-12 lg:grid-cols-[40fr_60fr] lg:items-start">

          {/* ── 좌측: 안내 텍스트 ────────────────────────────────── */}
          <div>
            <p className={ui.eyebrow}>Contact</p>
            <h2 className={ui.h2Display}>{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted break-keep">
              {subtitle}
            </p>

            {/* 지역별 연락처 */}
            <div className="mt-8 flex flex-col gap-3">
              {/* 서울 본사 — 풀 너비 */}
              <a
                href={`tel:${regions[0].phone}`}
                className="flex items-center justify-between rounded-xl border border-accent/40 bg-card px-5 py-4 transition-shadow hover:shadow-sm"
              >
                <span className="text-sm font-semibold text-accent">{regions[0].name}</span>
                <span className="text-xl font-bold text-foreground tabular-nums">{regions[0].phone}</span>
              </a>
              {/* 중부권·남부권 — 2열 */}
              <div className="grid grid-cols-2 gap-3">
                {(regions.slice(1) as readonly { name: string; phone: string; coverage: string }[]).map((region) => (
                  <a
                    key={region.name}
                    href={`tel:${region.phone}`}
                    className="flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-4 transition-shadow hover:shadow-sm"
                  >
                    <span className="text-xs font-semibold text-accent">{region.name}</span>
                    <span className="text-base font-bold text-foreground tabular-nums">{region.phone}</span>
                    {region.coverage && (
                      <span className="text-xs text-muted">{region.coverage}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {kakao && (
              <div className="mt-4">
                <a
                  href={kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#FEE500] px-6 text-base font-semibold text-[#3A1D1D] hover:opacity-90 transition-opacity"
                >
                  카카오로 문의하기
                </a>
              </div>
            )}

            {email && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-accent">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href={`mailto:${email}`} className="text-base font-medium text-foreground hover:text-accent transition-colors">{email}</a>
              </div>
            )}
          </div>

          {/* ── 우측: 폼 카드 ─────────────────────────────────────── */}
          <div className={`${ui.card} p-8 sm:p-10`}>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">문의가 접수되었습니다</h3>
                <p className="text-base text-muted">빠른 시일 내에 연락드리겠습니다.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  추가 문의하기
                </button>
              </div>
            ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* 문의 구분 — 컴팩트 세그먼트 */}
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-base font-semibold text-foreground">문의 구분</span>
                <div className="flex rounded-lg border border-border bg-surface p-0.5">
                  {INQUIRY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInquiryType(type)}
                      className={[
                        "rounded-md px-4 py-1.5 text-sm font-semibold transition-colors",
                        inquiryType === type
                          ? "bg-accent text-white shadow-sm"
                          : "text-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 성함/업체명 + 연락처 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-base font-semibold text-foreground">
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
                  <label className="mb-2 block text-base font-semibold text-foreground">
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
                <label className="mb-2 block text-base font-semibold text-foreground">
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
                <label className="mb-2 block text-base font-semibold text-foreground">
                  {fields.message}
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="수량, 규격, 현장 상황 등 자유롭게 적어주세요."
                  className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-steel/50 outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* 개인정보 수집 안내 */}
              <p className="text-xs text-muted">{privacy}</p>

              {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-accent text-lg font-bold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? "접수 중..." : "문의 보내기"}
              </button>

            </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}