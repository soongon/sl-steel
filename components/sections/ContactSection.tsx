"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { SITE, INQUIRY_TYPES, type InquiryType } from "@/lib/site";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
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

export default function ContactSection() {
  const { email, kakao, naverPlace, regions } = SITE.footer;
  const { title, subtitle, fields, privacy } = SITE.contact;

  const [inquiryType, setInquiryType] = useState<InquiryType>(INQUIRY_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const previousPhone = useRef("");

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const deleting = (event.nativeEvent as InputEvent).inputType?.startsWith("delete")
      ?? raw.length < previousPhone.current.length;
    let digits = raw.replace(/\D/g, "");
    let digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;

    // Backspace over an automatic separator also removes the preceding digit.
    if (deleting && digits === previousPhone.current.replace(/\D/g, "")) {
      const forward = (event.nativeEvent as InputEvent).inputType === "deleteContentForward";
      const index = forward ? digitsBeforeCaret : digitsBeforeCaret - 1;
      if (index >= 0) {
        digits = digits.slice(0, index) + digits.slice(index + 1);
        if (!forward) digitsBeforeCaret--;
      }
    }
    digits = digits.slice(0, 11);
    let formatted = digits.slice(0, 3);
    if (digits.length > 3 || (digits.length === 3 && !deleting)) formatted += "-";
    formatted += digits.slice(3, 7);
    if (digits.length > 7 || (digits.length === 7 && !deleting)) formatted += "-";
    formatted += digits.slice(7);
    input.value = formatted;
    previousPhone.current = formatted;

    let position = 0;
    let seen = 0;
    while (position < formatted.length && seen < digitsBeforeCaret) {
      if (/\d/.test(formatted[position])) seen++;
      position++;
    }
    if (!deleting && formatted[position] === "-") position++;
    input.setSelectionRange(position, position);
  }

  useEffect(() => {
    const sync = () =>
      startTransition(() => setInquiryType(resolveTypeFromHash()));
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
      previousPhone.current = "";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문의 접수에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="silla-section silla-contact">
      <div className="silla-container silla-contact-grid">
        <div>
          <span className="silla-eyebrow">LET’S TALK</span>
          <h2>{title}</h2>
          <p className="silla-contact-description">{subtitle}</p>
          <a className="silla-main-phone" href={`tel:${regions[0].phone}`}>
            {regions[0].phone}
          </a>
          <div className="silla-region-list">
            {regions.slice(1).map((region) => (
              <a key={region.name} href={`tel:${region.phone}`}>
                <span>
                  {region.name} <small>{region.coverage}</small>
                </span>
                <strong>{region.phone}</strong>
              </a>
            ))}
          </div>
          <div className="silla-contact-links">
            <a className="silla-contact-action silla-contact-email" href={`mailto:${email}`}>
              <Mail size={24} aria-hidden="true" />
              <span><strong>이메일 문의</strong><small>{email}</small></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a className="silla-contact-action silla-contact-place" href={naverPlace} target="_blank" rel="noopener noreferrer">
              <MapPin size={24} aria-hidden="true" />
              <span><strong>네이버 플레이스</strong><small>위치 · 길찾기 확인</small></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            {kakao && (
              <a href={kakao} target="_blank" rel="noopener noreferrer">
                카카오로 문의하기
              </a>
            )}
          </div>
          <p className="silla-contact-address">{SITE.footer.address.full}</p>
        </div>
        <div className="silla-contact-form">
          {submitted ? (
            <div className="silla-form-success" role="status">
              <h3>문의가 접수되었습니다</h3>
              <p>빠른 시일 내에 연락드리겠습니다.</p>
              <button
                type="button"
                className="silla-button"
                onClick={() => setSubmitted(false)}
              >
                추가 문의하기
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="silla-tabs" aria-label="문의 구분">
                {INQUIRY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={inquiryType === type}
                    onClick={() => setInquiryType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="silla-form-row">
                <div>
                  <label htmlFor="contact-name">
                    {fields.name} <span>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="성함 또는 업체명"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone">
                    {fields.phone} <span>*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="010-xxxx-xxxx"
                    inputMode="tel"
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-location">{fields.location}</label>
                <input
                  id="contact-location"
                  name="location"
                  type="text"
                  placeholder="예) 경기 화성시, 경북 경주시"
                />
              </div>
              <div>
                <label htmlFor="contact-message">{fields.message}</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="수량, 규격, 현장 상황 등을 알려주세요."
                />
              </div>
              <p className="silla-privacy">{privacy}</p>
              {error && (
                <p className="silla-form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="silla-button silla-submit"
              >
                {submitting ? "접수 중..." : "문의 보내기"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
