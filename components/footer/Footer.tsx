import { SITE } from "@/lib/site";
import { ui } from "@/lib/ui";
import SLSteelLogo from "@/components/logo/SLSteelLogo";

const QUICK_LINKS = [
  { label: "회사소개", href: "#about" },
  { label: "사업영역", href: "#business" },
  { label: "진행절차", href: "#process" },
  { label: "문의", href: "#contact" },
] as const;

export default function Footer() {
  const { email, regions, tagline } = SITE.footer;
  const mainPhone = regions[0].phone;
  const hasContact = !!(mainPhone || email);

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50" aria-label="사이트 하단">
      <div className={ui.container}>

        {/* 모바일 전용 */}
        <div className="py-8 sm:hidden">
          <a href="#top" className="flex items-center gap-2.5" aria-label="SL Steel 홈으로">
            <SLSteelLogo size={28} fill="#2C5F8A" gap="#F7F6F3" />
            <span className="text-base font-bold tracking-tight text-neutral-900">
              <span className="text-primary-600">SL</span>{" 철강"}
            </span>
          </a>

          <p className="mt-3 text-xs text-neutral-400">
            <span className="font-medium">{regions[0].name}</span>
            <span className="ml-2">{mainPhone}</span>
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
            <p className="text-xs text-neutral-400">© {new Date().getFullYear()} {SITE.brand.en}</p>
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-900">개인정보처리방침</a>
          </div>
        </div>

        {/* 데스크톱 */}
        <div className="hidden sm:block py-14">
          <div
            className={[
              "grid gap-10",
              hasContact ? "lg:grid-cols-3 sm:grid-cols-2" : "sm:grid-cols-2",
            ].join(" ")}
          >
            {/* 브랜드 */}
            <div>
              <a
                href="#top"
                aria-label="SL Steel 홈으로"
                className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
              >
                <SLSteelLogo size={32} fill="#2C5F8A" gap="#F7F6F3" />
                <div className="leading-none">
                  <p className="text-sm font-semibold text-neutral-900">{SITE.brand.en}</p>
                  <p className="mt-0.5 text-[11px] text-neutral-400">{SITE.brand.ko}</p>
                </div>
              </a>

              <p className="mt-5 text-sm font-semibold leading-snug text-neutral-900 break-keep">
                {SITE.hero.h1}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-400 break-keep">
                {tagline}
              </p>
            </div>

            {/* 빠른 링크 */}
            <div>
              <p className="mb-4 text-sm font-semibold text-neutral-900">Quick Links</p>
              <nav aria-label="푸터 메뉴">
                <ul className="space-y-2.5">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-neutral-900"
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
                <p className="mb-4 text-sm font-semibold text-neutral-900">Contact</p>
                <address className="not-italic space-y-2.5 text-sm text-neutral-400">
                  <a href={`tel:${mainPhone}`} className="block transition-colors hover:text-neutral-900">
                    {mainPhone}
                  </a>
                  {email && (
                    <a href={`mailto:${email}`} className="block transition-colors hover:text-neutral-900">
                      {email}
                    </a>
                  )}
                </address>
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6">
            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} {SITE.brand.en}. All rights reserved.
            </p>
            <a href="#" className="text-xs text-neutral-400 transition-colors hover:text-neutral-900">
              개인정보처리방침
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}