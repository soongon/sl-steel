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
  "h-12 w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-600/20";

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

          {/* 좌측: 안내 텍스트 */}
          <div>
            <span className={ui.label}>Contact</span>
            <h2 className={ui.title}>{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600 break-keep">
              {subtitle}
            </p>

            {/* 지역별 연락처 */}
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`tel:${regions[0].phone}`}
                className="flex items-center justify-between rounded-lg border border-primary-600/20 bg-white px-5 py-4 transition-shadow hover:shadow-sm"
              >
                <span className="text-sm font-semibold text-primary-600">{regions[0].name}</span>
                <span className="text-xl font-bold text-neutral-900 tabular-nums">{regions[0].phone}</span>
              </a>
              <div className="grid grid-cols-2 gap-3">
                {(regions.slice(1) as readonly { name: string; phone: string; coverage: string }[]).map((region) => (
                  <a
                    key={region.name}
                    href={`tel:${region.phone}`}
                    className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-4 transition-shadow hover:shadow-sm"
                  >
                    <span className="text-xs font-semibold text-primary-600">{region.name}</span>
                    <span className="text-base font-bold text-neutral-900 tabular-nums">{region.phone}</span>
                    {region.coverage && (
                      <span className="text-xs text-neutral-400">{region.coverage}</span>
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
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FEE500] px-6 text-base font-semibold text-[#3A1D1D] hover:opacity-90 transition-opacity"
                >
                  카카오로 문의하기
                </a>
              </div>
            )}

            {email && (
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-4">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-primary-600">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href={`mailto:${email}`} className="text-base font-medium text-neutral-900 hover:text-primary-600 transition-colors">{email}</a>
              </div>
            )}
          </div>

          {/* 우측: 폼 카드 */}
          <div className={`${ui.card} p-8 sm:p-10`}>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900">문의가 접수되었습니다</h3>
                <p className="text-base text-neutral-600">빠른 시일 내에 연락드리겠습니다.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className={`${ui.btn.base} ${ui.btn.secondary} ${ui.btn.md} mt-2`}
                >
                  추가 문의하기
                </button>
              </div>
            ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* 문의 구분 */}
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-base font-semibold text-neutral-900">문의 구분</span>
                <div className="flex rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
                  {INQUIRY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInquiryType(type)}
                      className={[
                        "rounded-md px-4 py-1.5 text-sm font-semibold transition-colors",
                        inquiryType === type
                          ? "bg-primary-600 text-white shadow-sm"
                          : "text-neutral-400 hover:text-neutral-900",
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
                  <label className="mb-2 block text-base font-semibold text-neutral-900">{fields.name}</label>
                  <input type="text" name="name" placeholder="홍길동 / (주)건설" required className={inputBase} />
                </div>
                <div>
                  <label className="mb-2 block text-base font-semibold text-neutral-900">{fields.phone}</label>
                  <input type="tel" name="phone" placeholder="010-0000-0000" required className={inputBase} />
                </div>
              </div>

              {/* 현장/지역 */}
              <div>
                <label className="mb-2 block text-base font-semibold text-neutral-900">{fields.location}</label>
                <input type="text" name="location" placeholder="예) 경기 화성시, 천안, 전주 등" className={inputBase} />
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="mb-2 block text-base font-semibold text-neutral-900">{fields.message}</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="수량, 규격, 현장 상황 등 자유롭게 적어주세요."
                  className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-600/20"
                />
              </div>

              <p className="text-xs text-neutral-400">{privacy}</p>

              {error && (
                <p className="text-sm font-medium text-danger">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`${ui.btn.base} ${ui.btn.primary} h-14 w-full text-lg rounded-md disabled:opacity-50`}
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