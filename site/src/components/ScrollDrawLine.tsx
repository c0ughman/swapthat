"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useLayoutEffect, type RefObject } from "react";

function parseViewBox(vb: string): { minX: number; minY: number; w: number; h: number } {
  const nums = vb
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  if (nums.length >= 4 && nums.every((n) => !Number.isNaN(n))) {
    return { minX: nums[0], minY: nums[1], w: nums[2], h: nums[3] };
  }
  return { minX: 0, minY: 0, w: 1000, h: 1000 };
}

interface ScrollDrawLineProps {
  path?: string;
  viewBox?: string;
  thickness?: number;
  className?: string;
  scrollTargetRef?: RefObject<HTMLElement | null>;
  /**
   * When set, scroll progress uses distance to this element’s top (within the scroll target)
   * instead of the full target height — stroke completes as the path meets this anchor (e.g. CTA top).
   */
  scrollEndAnchorRef?: RefObject<HTMLElement | null>;
  /**
   * When set, the stroke stays at 0 until the viewport bottom reaches this element’s top
   * (then progress grows from there). Use with scrollEndAnchorRef for span start → end.
   */
  scrollStartAnchorRef?: RefObject<HTMLElement | null>;
  /**
   * Linear stroke: fraction drawn = min(1, scrollP / progressDivisor). Scroll progress is not capped
   * at 1, so divisors above 1 need more scroll to finish the line (uniform speed, slower overall).
   * Default 0.5.
   */
  progressDivisor?: number;
  /** Added to scroll progress numerator so the stroke finishes this many px of scroll sooner. Default 0. */
  scrollAdvancePx?: number;
  /**
   * `meet` letterboxes when the host is taller than the viewBox aspect — the stroke only occupies
   * the top band and disappears lower on the page. `slice` scales to cover full height (may crop sides).
   */
  preserveAspectRatio?: string;
  /**
   * Width of the centered SVG wrapper (CSS length). With `slice`, a narrower value crops the
   * viewBox horizontally without distorting stroke caps (unlike non-uniform scaleX on the path).
   */
  containerWidth?: string;
  /**
   * Uniform scale for path + tip in user space (1 = default). Use with a larger `viewBox` so nothing
   * clips. Set `geometryScaleOrigin` to the center used when designing the path (often viewBox center
   * before expansion), not the center of an expanded viewBox.
   */
  geometryScale?: number;
  geometryScaleOrigin?: { x: number; y: number };
  /** Optional horizontal ellipse at the path end (viewBox coords) — reads as a slightly wider tip. */
  endTip?: { cx: number; cy: number; rx: number; ry: number };
}

export default function ScrollDrawLine({
  path = `
    M 700 -80
    C 850 150, 800 400, 550 480
    C 300 560, 200 750, 350 900
    C 500 1050, 750 1000, 700 1200
  `,
  viewBox = "0 0 1000 1200",
  thickness = 265,
  className = "",
  scrollTargetRef,
  scrollEndAnchorRef,
  scrollStartAnchorRef,
  progressDivisor = 0.5,
  scrollAdvancePx = 0,
  preserveAspectRatio = "xMidYMid slice",
  containerWidth = "min(72rem, calc(100% - 2.5rem))",
  geometryScale = 1,
  geometryScaleOrigin,
  endTip,
}: ScrollDrawLineProps) {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  // Lenis smooth scroll often does not emit native window "scroll" — drive with rAF + listeners.
  useLayoutEffect(() => {
    const el = scrollTargetRef?.current ?? fallbackRef.current;
    if (!el) return;

    const update = () => {
      const vh = window.visualViewport?.height ?? document.documentElement.clientHeight;
      const startEl = scrollStartAnchorRef?.current;
      const endEl = scrollEndAnchorRef?.current;

      if (startEl && endEl) {
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();
        // endRect.top - startRect.top is the document-space gap: scroll cancels in the difference.
        // p=0 when viewport bottom touches startEl top; p=1 when it reaches endEl top.
        const traveled = Math.max(0, vh - startRect.top);
        const span = Math.max(1, endRect.top - startRect.top);
        progress.set(Math.max(0, (traveled + scrollAdvancePx) / span));
        return;
      }

      // Fallback: drive off the scroll container itself.
      const rect = el.getBoundingClientRect();
      if (endEl) {
        const endRect = endEl.getBoundingClientRect();
        const traveled = Math.max(0, vh - rect.top);
        const span = Math.max(1, endRect.top - rect.top);
        progress.set(Math.max(0, (traveled + scrollAdvancePx) / span));
      } else {
        const traveled = Math.max(0, vh - rect.top);
        const span = Math.max(1, rect.height);
        progress.set(Math.max(0, (traveled + scrollAdvancePx) / span));
      }
    };

    let rafId = 0;
    let running = false;
    const loop = () => {
      update();
      rafId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
    };

    // The loop reads getBoundingClientRect() every frame (forced reflow), so only run
    // it while the section is near the viewport. A large rootMargin keeps the stroke
    // in sync just before it scrolls in; offscreen the loop is fully paused. `update()`
    // fires once on each visibility change so the resting state is always correct.
    const io = new IntersectionObserver(
      ([entry]) => {
        update();
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(el);

    const onResize = () => update();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [scrollTargetRef, scrollEndAnchorRef, scrollStartAnchorRef, progress, scrollAdvancePx]);

  // Uniform speed along the path (linear in scroll progress before clamping to full stroke).
  const dashOffset = useTransform(progress, (p) => {
    const raw = Math.min(1, Math.max(0, p / progressDivisor));
    return 1 - raw; // 1 = hidden, 0 = fully drawn
  });

  const tipOpacity = useTransform(progress, (p) => {
    const raw = Math.min(1, Math.max(0, p / progressDivisor));
    if (raw < 0.76) return 0;
    return Math.min(1, (raw - 0.76) / 0.24);
  });

  const { minX, minY, w: vbW, h: vbH } = parseViewBox(viewBox);
  const defaultOrigin = { x: minX + vbW / 2, y: minY + vbH / 2 };
  const ox = geometryScaleOrigin?.x ?? defaultOrigin.x;
  const oy = geometryScaleOrigin?.y ?? defaultOrigin.y;
  const s = geometryScale;
  const pathGroupTransform =
    Math.abs(s - 1) > 1e-6 ? `translate(${ox} ${oy}) scale(${s}) translate(${-ox} ${-oy})` : undefined;

  const lineContent = (
    <>
      <motion.path
        d={path}
        stroke="var(--blue)"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        style={{ strokeDashoffset: dashOffset }}
      />
      {endTip && (
        <motion.ellipse
          cx={endTip.cx}
          cy={endTip.cy}
          rx={endTip.rx}
          ry={endTip.ry}
          fill="var(--blue)"
          style={{ opacity: tipOpacity }}
        />
      )}
    </>
  );

  return (
    <div
      ref={fallbackRef}
      className={`absolute pointer-events-none z-[5] overflow-visible ${className}`}
      style={{
        top: "-192px", // was -240px, scaled ×0.8 for font-size:80% base
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: containerWidth,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={viewBox}
        fill="none"
        preserveAspectRatio={preserveAspectRatio}
      >
        {pathGroupTransform ? <g transform={pathGroupTransform}>{lineContent}</g> : lineContent}
      </svg>
    </div>
  );
}
