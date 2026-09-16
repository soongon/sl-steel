"use client";
import { Phone, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";
import ContactLink from "@/components/ContactLink";
export default function MobileCTABar() {
  return (
    <div className="silla-mobile-cta">
      <a href={`tel:${SITE.footer.regions[0].phone}`}>
        <Phone size={17} aria-hidden="true" />
        전화 문의
      </a>
      <ContactLink>
        매입 상담 <ArrowUpRight size={18} aria-hidden="true" />
      </ContactLink>
    </div>
  );
}
