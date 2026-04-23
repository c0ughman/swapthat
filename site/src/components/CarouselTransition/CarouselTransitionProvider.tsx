"use client";

import {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  PAGES,
  CARD_VW,
  CARD_VW_MOBILE,
  CARD_RADIUS,
  WHEEL,
  TIMING,
  EASE,
  PAN_EASE,
  CARD_SHADOW,
  THUMBNAIL_ASPECT_RATIO,
  THUMBNAIL_ASPECT_RATIO_MOBILE,
} from "./config";
import CarouselCard from "./CarouselCard";

/** Matches Tailwind `md:` — carousel wheel uses portrait +90° thumbnails only here */
const CAROUSEL_MOBILE_MQ = "(max-width: 767px)";

function useCarouselIsMobileViewport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(CAROUSEL_MOBILE_MQ);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(CAROUSEL_MOBILE_MQ).matches,
    () => false
  );
}

type Phase = "idle" | "shrinking" | "panning" | "expanding";

interface CarouselTransitionContextValue {
  triggerTransition: (targetPath: string) => void;
  phase: Phase;
}

export const CarouselTransitionContext =
  createContext<CarouselTransitionContextValue | null>(null);

const R = WHEEL.radius;
const A_RAD = (WHEEL.angleDeg * Math.PI) / 180;

function wheelPos(thetaRad: number) {
  return {
    x: R * Math.sin(thetaRad),
    y: R * (Math.cos(thetaRad) - 1),
    rotate: -(thetaRad * 180) / Math.PI,
  };
}

function getCarouselLayout(currentIdx: number, targetIdx: number) {
  const total = PAGES.length;
  const diff = (targetIdx - currentIdx + total) % total;
  const thirdIdx = [0, 1, 2].find(
    (i) => i !== currentIdx && i !== targetIdx
  )!;

  if (diff === 1) {
    return {
      ordered: [thirdIdx, currentIdx, targetIdx] as const,
      wheelTo: -A_RAD,
      incomingPageIdx: thirdIdx,
      incomingBaseAngle: 2 * A_RAD,
    };
  } else {
    return {
      ordered: [targetIdx, currentIdx, thirdIdx] as const,
      wheelTo: A_RAD,
      incomingPageIdx: thirdIdx,
      incomingBaseAngle: -2 * A_RAD,
    };
  }
}

const BASE_ANGLES = [-A_RAD, 0, A_RAD];
const CONTENT_SCALE = CARD_VW / 100;
const CONTENT_RADIUS = CARD_RADIUS / CONTENT_SCALE;

export default function CarouselTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [layout, setLayout] =
    useState<ReturnType<typeof getCarouselLayout> | null>(null);
  const hasNavigated = useRef(false);
  const scrollYRef = useRef(0);
  const endPositions = useRef<
    Array<{ x: number; y: number; rotate: number }>
  >([]);
  const [fromPageIdx, setFromPageIdx] = useState(-1);

  const isMobileViewport = useCarouselIsMobileViewport();

  /** Mobile uses portrait frame matching portrait PNGs; desktop uses landscape frame */
  const wheelVw = isMobileViewport ? CARD_VW_MOBILE : CARD_VW;
  const ar = isMobileViewport ? THUMBNAIL_ASPECT_RATIO_MOBILE : THUMBNAIL_ASPECT_RATIO;
  const wheelCardFrame = {
    position: "absolute" as const,
    width: `${wheelVw}vw`,
    left: `${-wheelVw / 2}vw`,
    aspectRatio: ar,
    top: `${(-wheelVw / 2) / ar}vw`,
  };

  const panProgress = useMotionValue(0);

  const currentPageIdx = PAGES.findIndex((p) => p.path === pathname);
  const targetPageIdx = targetPath
    ? PAGES.findIndex((p) => p.path === targetPath)
    : -1;
  const currentAccent =
    currentPageIdx >= 0 ? PAGES[currentPageIdx].accent : "#000";
  const targetAccent =
    targetPageIdx >= 0 ? PAGES[targetPageIdx].accent : "#000";

  const triggerTransition = useCallback(
    (target: string) => {
      if (phase !== "idle") return;
      if (target === pathname) return;

      const curIdx = PAGES.findIndex((p) => p.path === pathname);
      const tarIdx = PAGES.findIndex((p) => p.path === target);
      if (curIdx === -1 || tarIdx === -1) {
        router.push(target);
        return;
      }

      scrollYRef.current = window.scrollY;
      hasNavigated.current = false;
      panProgress.set(0);
      setTargetPath(target);
      setFromPageIdx(curIdx);
      const newLayout = getCarouselLayout(curIdx, tarIdx);
      setLayout(newLayout);
      endPositions.current = BASE_ANGLES.map((base) =>
        wheelPos(base + newLayout.wheelTo)
      );
      router.prefetch(target);
      setPhase("shrinking");
    },
    [phase, pathname, router, panProgress]
  );

  // Navigate at the START of the pan
  useEffect(() => {
    if (phase !== "panning" || !layout) return;

    if (targetPath && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push(targetPath, { scroll: false });
    }

    const controls = animate(panProgress, 1, {
      duration: TIMING.pan / 1000,
      ease: PAN_EASE,
      onComplete: () => {
        setPhase("expanding");
      },
    });

    return () => controls.stop();
  }, [phase, layout, targetPath, router, panProgress]);

  const finishTransition = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase("idle");
    setTargetPath(null);
    setLayout(null);
    setFromPageIdx(-1);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  // Cut to real page at 50% of expand — don't wait for full animation
  useEffect(() => {
    if (phase !== "expanding") return;

    const cutTimer = setTimeout(() => {
      finishTransition();
    }, TIMING.expand * 0.5);

    return () => clearTimeout(cutTimer);
  }, [phase, finishTransition]);

  const showThumbnailInstead = phase === "panning" || phase === "expanding";
  const fromPage = fromPageIdx >= 0 ? PAGES[fromPageIdx] : null;

  // ─── Per-slot wheel transforms ────────────────────────────────────
  function makeSlotTransforms(baseAngle: number) {
    const x = useTransform(panProgress, (p) => {
      if (!layout) return wheelPos(baseAngle).x;
      return wheelPos(baseAngle + layout.wheelTo * p).x;
    });
    const y = useTransform(panProgress, (p) => {
      if (!layout) return wheelPos(baseAngle).y;
      return wheelPos(baseAngle + layout.wheelTo * p).y;
    });
    const rotate = useTransform(panProgress, (p) => {
      if (!layout) return wheelPos(baseAngle).rotate;
      return wheelPos(baseAngle + layout.wheelTo * p).rotate;
    });
    const xVw = useTransform(x, (v) => `${v}vw`);
    const yVw = useTransform(y, (v) => `${v}vw`);
    return { xVw, yVw, rotate };
  }

  /* eslint-disable react-hooks/rules-of-hooks */
  const slot0 = makeSlotTransforms(BASE_ANGLES[0]);
  const slot1 = makeSlotTransforms(BASE_ANGLES[1]);
  const slot2 = makeSlotTransforms(BASE_ANGLES[2]);
  const incomingSlot = makeSlotTransforms(
    layout?.incomingBaseAngle ?? 2 * A_RAD
  );
  /* eslint-enable react-hooks/rules-of-hooks */

  const slots = [slot0, slot1, slot2];
  const isTransitioning = phase !== "idle";

  const sideSlots = layout
    ? [
        { slotIdx: 0, pageIdx: layout.ordered[0] },
        { slotIdx: 2, pageIdx: layout.ordered[2] },
      ]
    : [];

  return (
    <CarouselTransitionContext.Provider value={{ triggerTransition, phase }}>
      {/* ── 1. Background with accent color fade ──────────────────── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="carousel-bg"
            className="fixed inset-0 z-[9997]"
            initial={{ backgroundColor: currentAccent, opacity: 0 }}
            animate={{
              backgroundColor:
                phase === "panning" || phase === "expanding"
                  ? targetAccent
                  : currentAccent,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              backgroundColor: { duration: TIMING.pan / 1000, ease: EASE },
              opacity: { duration: 0.15 },
            }}
          />
        )}
      </AnimatePresence>

      {/* ── 2. Current page card (real content during shrink, thumbnail after) */}
      <motion.div
        initial={false}
        style={{
          ...(isTransitioning
            ? {
                position: "fixed" as const,
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                zIndex: 9998,
                transformOrigin: "center center",
                willChange: "transform",
                backgroundColor:
                  fromPage?.path === "/sistema"
                    ? "#1a1a1a"
                    : "var(--background)",
              }
            : {}),
          ...(phase === "panning"
            ? {
                x: slots[1].xVw,
                y: slots[1].yVw,
                rotate: slots[1].rotate,
              }
            : {}),
        }}
        animate={
          phase === "shrinking"
            ? {
                scale: CONTENT_SCALE,
                borderRadius: CONTENT_RADIUS,
                boxShadow: CARD_SHADOW,
                x: 0,
                y: 0,
                rotate: 0,
              }
            : phase === "expanding"
              ? {
                  scale: CONTENT_SCALE,
                  opacity: 0,
                  boxShadow: CARD_SHADOW,
                  x: `${(endPositions.current[1]?.x ?? 0)}vw`,
                  y: `${(endPositions.current[1]?.y ?? 0)}vw`,
                  rotate: endPositions.current[1]?.rotate ?? 0,
                }
              : phase === "panning"
                ? {
                    scale: CONTENT_SCALE,
                    borderRadius: CONTENT_RADIUS,
                    boxShadow: CARD_SHADOW,
                  }
                : {
                    scale: 1,
                    borderRadius: 0,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }
        }
        transition={{
          duration:
            phase === "shrinking" ? TIMING.shrink / 1000 : 0.01,
          ease: EASE,
        }}
        onAnimationComplete={() => {
          if (phase === "shrinking") setPhase("panning");
        }}
      >
        {showThumbnailInstead && fromPage ? (
          <CarouselCard
            page={fromPage}
            variant="fullscreen"
            isMobileViewport={isMobileViewport}
          />
        ) : (
          <div
            style={
              isTransitioning
                ? { transform: `translateY(-${scrollYRef.current}px)` }
                : undefined
            }
          >
            {children}
          </div>
        )}
      </motion.div>

      {/* ── 3. Thumbnail cards ────────────────────────────────────── */}
      {isTransitioning && layout && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9999 }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
            }}
          >
            {sideSlots.map(({ slotIdx, pageIdx }) => {
              const page = PAGES[pageIdx];
              const isTarget = page.path === targetPath;
              const slot = slots[slotIdx];
              const initPos = wheelPos(BASE_ANGLES[slotIdx]);
              const endPos = endPositions.current[slotIdx] ?? initPos;

              return (
                <motion.div
                  key={page.path}
                  style={{
                    ...wheelCardFrame,
                    overflow: "hidden",
                    willChange: "transform",
                    zIndex: isTarget ? 10 : 1,
                    ...(phase === "panning"
                      ? {
                          x: slot.xVw,
                          y: slot.yVw,
                          rotate: slot.rotate,
                          borderRadius: CARD_RADIUS,
                        }
                      : {}),
                  }}
                  initial={{
                    x: `${initPos.x}vw`,
                    y: `${initPos.y}vw`,
                    rotate: initPos.rotate,
                    scale: 1,
                    opacity: 0,
                    borderRadius: CARD_RADIUS,
                    boxShadow: CARD_SHADOW,
                  }}
                  animate={
                    phase === "shrinking"
                      ? {
                          x: `${initPos.x}vw`,
                          y: `${initPos.y}vw`,
                          rotate: initPos.rotate,
                          scale: 1,
                          opacity: 1,
                          borderRadius: CARD_RADIUS,
                          boxShadow: CARD_SHADOW,
                        }
                      : phase === "expanding" && isTarget
                        ? {
                            x: "0vw",
                            y: "0vw",
                            rotate: 0,
                            scale: 2.05,
                            opacity: 1,
                            borderRadius: 0,
                            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                          }
                        : phase === "expanding"
                          ? {
                              x: `${endPos.x}vw`,
                              y: `${endPos.y}vw`,
                              rotate: endPos.rotate,
                              scale: 1,
                              opacity: 0,
                              borderRadius: CARD_RADIUS,
                              boxShadow: CARD_SHADOW,
                            }
                          : {
                              scale: 1,
                              opacity: 1,
                              borderRadius: CARD_RADIUS,
                              boxShadow: CARD_SHADOW,
                            }
                  }
                  transition={{
                    duration:
                      phase === "shrinking"
                        ? TIMING.shrink / 1000
                        : phase === "expanding"
                          ? TIMING.expand / 1000
                          : 0.3,
                    ease: EASE,
                  }}
                >
                  <CarouselCard
                    page={page}
                    variant="wheel"
                    isMobileViewport={isMobileViewport}
                  />
                </motion.div>
              );
            })}

            {/* Incoming wrap-around card */}
            {(() => {
              const incomingPage = PAGES[layout.incomingPageIdx];
              const incomingInitPos = wheelPos(layout.incomingBaseAngle);
              const incomingEndPos = wheelPos(
                layout.incomingBaseAngle + layout.wheelTo
              );

              return (
                <motion.div
                  key={`incoming-${incomingPage.path}`}
                  style={{
                    ...wheelCardFrame,
                    overflow: "hidden",
                    borderRadius: CARD_RADIUS,
                    willChange: "transform",
                    zIndex: 1,
                    ...(phase === "panning"
                      ? {
                          x: incomingSlot.xVw,
                          y: incomingSlot.yVw,
                          rotate: incomingSlot.rotate,
                        }
                      : {}),
                  }}
                  initial={{
                    x: `${incomingInitPos.x}vw`,
                    y: `${incomingInitPos.y}vw`,
                    rotate: incomingInitPos.rotate,
                    scale: 1,
                    opacity: 0,
                    boxShadow: CARD_SHADOW,
                  }}
                  animate={
                    phase === "panning"
                      ? { scale: 1, opacity: 1, boxShadow: CARD_SHADOW }
                      : phase === "expanding"
                        ? {
                            x: `${incomingEndPos.x}vw`,
                            y: `${incomingEndPos.y}vw`,
                            rotate: incomingEndPos.rotate,
                            scale: 1,
                            opacity: 0,
                            boxShadow: CARD_SHADOW,
                          }
                        : { scale: 1, opacity: 0, boxShadow: CARD_SHADOW }
                  }
                  transition={{
                    duration:
                      phase === "expanding"
                        ? TIMING.expand / 1000
                        : TIMING.pan / 1000,
                    ease: EASE,
                  }}
                >
                  <CarouselCard
                    page={incomingPage}
                    variant="wheel"
                    isMobileViewport={isMobileViewport}
                  />
                </motion.div>
              );
            })()}
          </div>
        </div>
      )}
    </CarouselTransitionContext.Provider>
  );
}
