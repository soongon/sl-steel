"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    id: "warehouse",
    label: "대형 창고",
    caption: "철근·H빔 재고 상시 보유 · 즉시 출고 대응",
    imagePath: "/images/hero-1.jpg",
  },
  {
    id: "yard",
    label: "야적장",
    caption: "대형 물량 적치 · 현장 배송 기반 확보",
    imagePath: "/images/hero-2.png",
  },
  {
    id: "truck",
    label: "크레인 장착 5톤 트럭",
    caption: "상하차부터 현장 납품까지 자체 대응",
    imagePath: "/images/hero-3.jpg",
  },
] as const;

const INTERVAL = 4000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // ref로 관리 — 서버/클라이언트 초기값 불일치(hydration mismatch) 방지
  const prefersReducedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (prefersReducedRef.current) return;
    stopTimer();
    timerRef.current = setInterval(() => {
      setActive((cur) => (cur + 1) % SLIDES.length);
    }, INTERVAL);
  }, [stopTimer]);

  useEffect(() => {
    // 클라이언트 마운트 후에만 읽음 — SSR에서 window 접근 없음
    prefersReducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const goTo = (i: number) => {
    setActive(i);
    startTimer();
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 min-h-80 lg:h-full"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      aria-label="시설 이미지 슬라이드"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== active}
          className={[
            "absolute inset-0 transition-opacity duration-700",
            i === active ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <Image
            src={slide.imagePath}
            alt={slide.label}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority={i === 0}
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-6 pb-6 pt-12">
            <p className="text-base font-semibold text-white">{slide.label}</p>
            <p className="mt-0.5 text-sm text-white/70">{slide.caption}</p>
          </div>
        </div>
      ))}

      <div
        className="absolute bottom-4 right-5 flex items-center gap-1.5"
        role="tablist"
        aria-label="슬라이드 선택"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={i === active}
            aria-label={slide.label}
            onClick={() => goTo(i)}
            className={[
              "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              i === active ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}