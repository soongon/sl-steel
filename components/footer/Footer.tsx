import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import SLSteelLogo from "@/components/logo/SLSteelLogo";

const QUICK_LINKS = [
  { label: "회사소개", href: "#about"    },
  { label: "사업영역", href: "#business" },
  { label: "진행절차", href: "#process"  },
  { label: "문의",     href: "#contact"  },
] as const;

export default function Footer() {
  const { address, phone, email } = SITE.footer;
  const hasContact = !!(address || phone || email);

  return (
    <footer className="border-t border-border bg-surface" aria-label="사이트 하단">
      <div className={ui.container}>

        {/* ── 모바일 전용: 간략 레이아웃 ──────────────────────────── */}
        <div className="py-8 sm:hidden">
          <a
            href="#top"
            className="flex items-center gap-2.5"
            aria-label="SL Steel 홈으로"
          >
            <SLSteelLogo size={28} fill="#3B82F6" gap="#F1F5F9" />
            <span className="font-display text-base font-bold tracking-tight text-brand-navy">
              <span className="text-accent">SL</span>{" 철강"}
            </span>
          </a>

          {address && (
            <p className="mt-3 text-xs text-muted">
              {address}{phone && <span className="ml-2">{phone}</span>}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted">© {new Date().getFullYear()} {SITE.brand.en}</p>
            <a href="#" className="text-xs text-muted hover:text-foreground">개인정보처리방침</a>
          </div>
        </div>

        {/* ── 데스크톱: 풀 레이아웃 ───────────────────────────────── */}
        <div className="hidden sm:block py-14">

          <div
            className={[
              "grid gap-10",
              hasContact ? "lg:grid-cols-3 sm:grid-cols-2" : "sm:grid-cols-2",
            ].join(" ")}
          >
            {/* 브랜드 블록 */}
            <div>
              <a
                href="#top"
                aria-label="SL Steel 홈으로"
                className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
              >
                <SLSteelLogo size={32} fill="#3B82F6" gap="#F1F5F9" />
                <div className="leading-none">
                  <p className="text-sm font-semibold text-foreground">{SITE.brand.en}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{SITE.brand.ko}</p>
                </div>
              </a>

              <p className="mt-5 font-display text-sm font-semibold leading-snug text-foreground break-keep">
                {SITE.hero.h1}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted break-keep">
                녹슨 철근·절단 철근 합리적 매입. 현장 직수거로 빠르게 처리합니다.
              </p>
            </div>

            {/* 빠른 링크 */}
            <div>
              <p className="mb-4 text-sm font-semibold text-foreground">Quick Links</p>
              <nav aria-label="푸터 메뉴">
                <ul className="space-y-2.5">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* 연락처 */}
            {hasContact && (
              <div>
                <p className="mb-4 text-sm font-semibold text-foreground">Contact</p>
                <address className="not-italic space-y-2.5 text-sm text-muted">
                  {address && <p>{address}</p>}
                  {phone && (
                    <a href={`tel:${phone}`} className="block transition-colors hover:text-foreground">
                      {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="block transition-colors hover:text-foreground">
                      {email}
                    </a>
                  )}
                </address>
              </div>
            )}
          </div>

          {/* 하단 바 */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} {SITE.brand.en}. All rights reserved.
            </p>
            <a href="#" className="text-xs text-muted transition-colors hover:text-foreground">
              개인정보처리방침
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}