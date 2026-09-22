import { SITE } from "@/lib/site";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactSection() {
  const { email, kakao, naverPlace, regions } = SITE.footer;
  const { title, subtitle } = SITE.contact;

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
            <a
              className="silla-contact-action silla-contact-email"
              href={`mailto:${email}`}
            >
              <Mail size={24} aria-hidden="true" />
              <span>
                <strong>이메일 문의</strong>
                <small>{email}</small>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a
              className="silla-contact-action silla-contact-place"
              href={naverPlace}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={24} aria-hidden="true" />
              <span>
                <strong>네이버 플레이스</strong>
                <small>위치 · 길찾기 확인</small>
              </span>
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
        <ContactForm />
      </div>
    </section>
  );
}
