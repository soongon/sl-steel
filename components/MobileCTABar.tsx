"use client";

import { SITE } from "@/lib/site";
import { scrollToContact } from "@/lib/scroll";
import { ui } from "@/lib/ui";

export default function MobileCTABar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-neutral-200 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        <a
          href={`tel:${SITE.footer.regions[0].phone}`}
          className={`${ui.btn.base} ${ui.btn.secondary} ${ui.btn.sm} w-full`}
        >
          전화 문의
        </a>
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); scrollToContact("매입 문의"); }}
          className={`${ui.btn.base} ${ui.btn.primary} ${ui.btn.sm} w-full`}
        >
          매입 문의
        </a>
      </div>
    </div>
  );
}