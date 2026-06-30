import { useMemo, type RefObject } from "react";

/** Hex required — CSS vars break in SVG `fill`. */
const WAVE_FILL = "#ffffff";
const WAVE_FILL_BACK = "var(--blue)";

/** Parallax vs panels (1.0 = moves with content). Both kept well below 1 so the
 *  waves drift slowly on scroll, with a wide gap so the two layers move at very
 *  noticeably different speeds. */
export const WAVE_PARALLAX_BACK = 0.35;
export const WAVE_PARALLAX_FRONT = 0.65;

/** Strip is 2× panel span; cycle count scales 2× so wavelength stays the same. */
export const WAVE_LENGTH_MULTIPLIER = 2;

const VIEW_W = 2880 * WAVE_LENGTH_MULTIPLIER;
const VIEW_H = 220;

type Pt = { x: number; y: number };

/** Catmull–Rom → cubic Bézier so the shoreline stays C¹-smooth (no kinks). */
function smoothWavePath(
  width: number,
  height: number,
  opts: {
    cycles: number;
    amplitude: number;
    baseline: number;
    phase: number;
    wobble?: number;
  },
): string {
  const { cycles, amplitude, baseline, phase, wobble = 0.3 } = opts;
  const steps = Math.round(96 * (width / 2880));
  const pts: Pt[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * width;
    const y =
      baseline +
      amplitude * Math.sin(t * Math.PI * 2 * cycles + phase) +
      amplitude * wobble * Math.sin(t * Math.PI * 2 * cycles * 1.85 + phase * 1.35);
    pts.push({ x, y: Math.max(52, Math.min(height - 12, y)) });
  }

  let d = `M 0 ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}

type HorizontalScrollBottomWavesProps = {
  panelCount: number;
  backRef: RefObject<HTMLDivElement | null>;
  frontRef: RefObject<HTMLDivElement | null>;
};

export default function HorizontalScrollBottomWaves({
  panelCount,
  backRef,
  frontRef,
}: HorizontalScrollBottomWavesProps) {
  const trackWidthVw = panelCount * 100 * WAVE_LENGTH_MULTIPLIER;

  const waveFront = useMemo(
    () =>
      smoothWavePath(VIEW_W, VIEW_H, {
        cycles: 4.35 * WAVE_LENGTH_MULTIPLIER,
        amplitude: 55,
        baseline: 140,
        phase: 0.45,
        wobble: 0.28,
      }),
    [],
  );

  const waveBack = useMemo(
    () =>
      smoothWavePath(VIEW_W, VIEW_H, {
        cycles: 4.05 * WAVE_LENGTH_MULTIPLIER,
        amplitude: 57,
        baseline: 148,
        phase: 2.35,
        wobble: 0.34,
      }),
    [],
  );

  const layerClass =
    "pointer-events-none absolute bottom-0 left-0 z-[50] h-[220px] will-change-transform";

  return (
    <>
      <div ref={backRef} className={layerClass} style={{ width: `${trackWidthVw}vw` }} aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
        >
          <path d={waveBack} fill={WAVE_FILL_BACK} />
        </svg>
      </div>
      <div
        ref={frontRef}
        className={`${layerClass} z-[51]`}
        style={{ width: `${trackWidthVw}vw` }}
        aria-hidden
      >
        <svg
          className="absolute inset-0 h-full w-full drop-shadow-[0_-4px_16px_rgba(26,26,26,0.05)]"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
        >
          <path d={waveFront} fill={WAVE_FILL} />
        </svg>
      </div>
    </>
  );
}
