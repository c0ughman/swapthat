"use client";

export function WavyCircle({ className = "", color = "var(--blue)", size = 120 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={`${className}`}
    >
      <path
        d="M60 10C70 10 80 15 85 20C95 28 100 35 105 45C110 55 110 65 105 75C100 85 95 92 85 100C75 108 65 110 55 108C45 106 35 100 28 92C20 84 15 74 12 64C10 54 12 44 18 35C24 26 32 18 42 13C50 10 55 10 60 10Z"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
        className="animate-spin-slow origin-center"
      />
    </svg>
  );
}

export function ZigzagLine({ className = "", color = "var(--coral)", width = 200 }: { className?: string; color?: string; width?: number }) {
  return (
    <svg
      width={width}
      height="20"
      viewBox="0 0 200 20"
      fill="none"
      className={className}
    >
      <path
        d="M0 10L10 2L20 18L30 2L40 18L50 2L60 18L70 2L80 18L90 2L100 18L110 2L120 18L130 2L140 18L150 2L160 18L170 2L180 18L190 2L200 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function DotGrid({ className = "", color = "var(--foreground)", cols = 6, rows = 6, size = 3 }: { className?: string; color?: string; cols?: number; rows?: number; size?: number }) {
  const gap = 20;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gap + size}
          cy={r * gap + size}
          r={size}
          fill={color}
          opacity="0.1"
        />
      );
    }
  }
  return (
    <svg
      width={cols * gap}
      height={rows * gap}
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      className={className}
    >
      {dots}
    </svg>
  );
}

export function AbstractShape({ className = "", color = "var(--blue)" }: { className?: string; color?: string }) {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className={className}>
      <path
        d="M100 20C140 20 170 40 180 80C190 120 170 160 130 175C90 190 50 170 30 130C10 90 30 40 70 25C80 22 90 20 100 20Z"
        fill={color}
        opacity="0.08"
      />
      <path
        d="M100 40C130 40 155 55 162 85C169 115 155 145 125 157C95 169 65 155 50 125C35 95 50 55 80 43C87 40 93 40 100 40Z"
        stroke={color}
        strokeWidth="1"
        opacity="0.15"
        fill="none"
      />
    </svg>
  );
}

export function CrossPattern({ className = "", color = "var(--coral)" }: { className?: string; color?: string }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className={className}>
      <line x1="40" y1="10" x2="40" y2="70" stroke={color} strokeWidth="2" opacity="0.2" />
      <line x1="10" y1="40" x2="70" y2="40" stroke={color} strokeWidth="2" opacity="0.2" />
      <circle cx="40" cy="40" r="8" stroke={color} strokeWidth="1.5" opacity="0.15" fill="none" />
    </svg>
  );
}

export function StarBurst({ className = "", color = "var(--blue)", size = 40 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill={color} className={className}>
      <path d="M20 0L22.5 17.5L40 20L22.5 22.5L20 40L17.5 22.5L0 20L17.5 17.5Z" />
    </svg>
  );
}
