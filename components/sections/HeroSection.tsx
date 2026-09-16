import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ContactLink from "@/components/ContactLink";
export default function HeroSection() {
  return (
    <section id="hero" className="silla-hero" aria-label="신라철강 소개">
      <Image
        src="/images/silla-drone.webp"
        alt="경주 신라철강 창고와 야적장을 내려다본 드론 전경"
        fill
        priority
        sizes="100vw"
        className="silla-hero-image"
      />
      <div className="silla-hero-shade" />
      <div className="silla-container silla-hero-content">
        <h1>
          현장을 잇고,
          <br />
          가치를 더합니다.
        </h1>
        <p>잔여 철근 매입 · 철근·H빔 납품</p>
        <div className="silla-hero-actions">
          <ContactLink className="silla-button silla-button-white">
            매입 상담 <ArrowRight size={20} aria-hidden="true" />
          </ContactLink>
          <ContactLink type="납품 문의" className="silla-text-link">
            납품 문의 <ArrowRight size={20} aria-hidden="true" />
          </ContactLink>
        </div>
      </div>
    </section>
  );
}
