/**
 * SL 철강 로고 심볼 — 철근 7개 묶음 단면 (육각 클로즈팩)
 *
 * 구성: 중심 1개 + 외곽 6개 (정육각형 배치)
 * 결속선: 얇은 육각형 외곽선으로 바인딩 와이어 표현
 */

interface Props {
  /** 심볼 크기 (정사각형) */
  size?: number;
  /** 철근 채우기 색 */
  fill?: string;
  /** 심볼 배경과 같은 색 — 철근 사이 gap 표현용 */
  gap?: string;
  className?: string;
}

export default function SLSteelLogo({
  size = 40,
  fill = "#2C5F8A",
  gap = "#0F2640",
  className,
}: Props) {
  // 뷰박스 중심
  const cx = 22;
  const cy = 22;
  const r = 5.6;          // 철근 한 개 반지름
  const d = r * 2 + 0.4; // 중심간 거리 (살짝 여백)

  // 외곽 6개 철근 위치 (60° 간격, 12시 방향부터)
  const outer = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
  });

  // 결속선(바인딩 와이어) — 외곽 6점을 잇는 육각형 폴리곤
  const wirePoints = outer.map((p) => `${p.x},${p.y}`).join(" ");

  // 철근 단면 내부 텍스처 — 실제 이형철근 단면의 리브 암시용 내부 원
  const innerR = r * 0.42;

  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="SL 철강 로고"
      className={className}
    >
      {/* ── 결속 와이어 (외곽 철근을 묶는 선) ── */}
      <polygon
        points={wirePoints}
        fill="none"
        stroke={fill}
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeLinejoin="round"
      />

      {/* ── 외곽 철근 6개 ── */}
      {outer.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={r} fill={fill} stroke={gap} strokeWidth="1.4" />
          {/* 리브 암시 내부 원 */}
          <circle cx={p.x} cy={p.y} r={innerR} fill={fill} fillOpacity="0" stroke={fill} strokeOpacity="0.5" strokeWidth="0.8" />
        </g>
      ))}

      {/* ── 중심 철근 (강조) ── */}
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={gap} strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r={innerR} fill={fill} fillOpacity="0" stroke={fill} strokeOpacity="0.7" strokeWidth="0.9" />
    </svg>
  );
}
