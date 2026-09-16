"use client";
import type { ReactNode } from "react";
import type { InquiryType } from "@/lib/site";
import { scrollToContact } from "@/lib/scroll";
export default function ContactLink({
  type = "매입 문의",
  className,
  children,
}: {
  type?: InquiryType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        scrollToContact(type);
      }}
    >
      {children}
    </a>
  );
}
