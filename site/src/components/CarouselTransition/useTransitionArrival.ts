"use client";

import { useContext, useState, useEffect } from "react";
import { CarouselTransitionContext } from "./CarouselTransitionProvider";

/**
 * Use in hero/arrival components to detect whether this page was mounted
 * via a carousel transition and to know when the transition has completed.
 *
 * - `skippedInitialAnimation`: captured once at mount. True when this component
 *   was mounted while a transition was in flight. Use this to render in the
 *   "already loaded" state (skip mount-time animations).
 *
 * - `arrivalAnimationReady`: flips to true when the carousel overlay disappears
 *   (phase → idle). Use this to trigger arrival-specific animations (sticker
 *   pop, image spread, bubble fade-in, etc.).
 */
export function useTransitionArrival() {
  const ctx = useContext(CarouselTransitionContext);

  // Capture at first render — did this component mount during a transition?
  const [skippedInitialAnimation] = useState<boolean>(
    () => ctx?.arrivedViaTransition ?? false
  );

  const [arrivalAnimationReady, setArrivalAnimationReady] = useState(false);

  useEffect(() => {
    if (!skippedInitialAnimation) return;
    if (!ctx) return;
    if (ctx.phase === "idle") {
      setArrivalAnimationReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.phase, skippedInitialAnimation]);

  return { skippedInitialAnimation, arrivalAnimationReady };
}
