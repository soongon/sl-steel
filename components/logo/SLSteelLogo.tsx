/**
 * SL 철강 로고 심볼 — 철근 7개 묶음 단면 (육각 클로즈팩)
 *
 * 구성: 중심 1개(액센트 오렌지 강조) + 외곽 6개 (정육각형 배치)
 * 결속 밴드: 다발 전체를 감싸는 원형 스트랩으로 바인딩 표현
 */

interface Props {
  /** 심볼 크기 (정사각형) */
  size?: number;
  /** 철근 채우기 색 */
  fill?: string;
  /** 심볼 배경과 같은 색 — 철근 사이 gap 표현용 */
  gap?: string;
  /** 중심 철근 강조 색 (Industrial Orange) */
  accent?: string;
  className?: string;
}

export default function SLSteelLogo({
  size = 40,
  fill = "#2C5F8A",
  gap = "#0F2640",
  accent = "#F28C28",
  className,
}: Props) {
  // 뷰박스 중심
  const cx = 22;
  const cy = 22;
  const r = 5.6;          // 철근 한 개 반지름
  const d = r * 2 + 0.4;  // 중심간 거리 (살짝 여백)
  const bandR = d + r + 1.8; // 결속 밴드 반지름 (다발 외곽 + 여유)

  // 외곽 6개 철근 위치 (60° 간격, 12시 방향부터)
  const outer = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
  });

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
      {/* ── 결속 밴드 (다발을 감싸는 원형 스트랩) ── */}
      <circle
        cx={cx}
        cy={cy}
        r={bandR}
        fill="none"
        stroke={fill}
        strokeWidth="1.4"
        strokeOpacity="0.45"
      />

      {/* ── 외곽 철근 6개 ── */}
      {outer.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} fill={fill} stroke={gap} strokeWidth="1.4" />
      ))}

      {/* ── 중심 철근 (액센트 강조) ── */}
      <circle cx={cx} cy={cy} r={r} fill={accent} stroke={gap} strokeWidth="1.4" />
    </svg>
  );
}
