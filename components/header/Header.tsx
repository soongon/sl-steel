"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "@/components/logo/Logo";
const links = [
  { label: "회사소개", href: "#about" },
  { label: "사업영역", href: "#business" },
  { label: "현장사례", href: "#cases" },
];
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 32);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = menuRef.current?.querySelectorAll<HTMLElement>("a, button");
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  return (
    <>
      <a className="silla-skip" href="#main-content">
        본문으로 바로가기
      </a>
      <header className={`silla-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="silla-container silla-header-inner">
          <a href="#top" aria-label="신라철강 홈으로">
            <Logo white={!scrolled} withEn size="lg" />
          </a>
          <nav className="silla-desktop-nav" aria-label="주요 메뉴">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a className="silla-nav-contact" href="#contact">
              문의하기
            </a>
          </nav>
          <button
            ref={toggleRef}
            className="silla-menu-toggle"
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="silla-mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>
      {open && (
        <div
          ref={menuRef}
          id="silla-mobile-menu"
          className="silla-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="모바일 메뉴"
        >
          <div className="silla-mobile-menu-top">
            <a
              href="#top"
              onClick={() => setOpen(false)}
              aria-label="신라철강 홈으로"
            >
              <Logo white withEn size="lg" />
            </a>
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="모바일 주요 메뉴">
            {[
              ...links,
              { label: "진행절차", href: "#process" },
              { label: "문의하기", href: "#contact" },
            ].map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                <span>0{i + 1}</span>
                {link.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <Link href="/blog" className="silla-mobile-blog">
            신라철강 블로그 <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
