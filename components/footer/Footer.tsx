import Link from "next/link";
import Logo from "@/components/logo/Logo";
import { SITE } from "@/lib/site";
export default function Footer() {
  return (
    <footer className="silla-footer" aria-label="사이트 하단">
      <div className="silla-container">
        <div className="silla-footer-top">
          <a href="#top" aria-label="신라철강 홈으로">
            <Logo white withEn size="lg" />
          </a>
          <p>현장을 잇고, 가치를 더합니다.</p>
          <a href={`mailto:${SITE.footer.email}`}>{SITE.footer.email}</a>
        </div>
        <div className="silla-footer-bottom">
          <span>© {new Date().getFullYear()} Silla Steel</span>
          <span>{SITE.footer.address.full}</span>
          <nav aria-label="푸터 메뉴">
            <Link href="/blog">블로그</Link>
            <a href="#contact">문의하기</a>
            <a
              href={SITE.footer.naverPlace}
              target="_blank"
              rel="noopener noreferrer"
            >
              오시는 길
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
