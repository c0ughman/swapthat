"use client";

import { useRef, useLayoutEffect, Children } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HorizontalScrollBottomWaves, {
  WAVE_PARALLAX_BACK,
  WAVE_PARALLAX_FRONT,
} from "@/components/HorizontalScrollBottomWaves";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  /** Outer wrapper background (default matches page `bg-background`). */
  className?: string;
  /** Decorative bottom wave strip — default on (home hero scroll). */
  showBottomWaves?: boolean;
}

export default function HorizontalScroll({
  children,
  className,
  showBottomWaves = true,
}: HorizontalScrollProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wavesBackRef = useRef<HTMLDivElement>(null);
  const wavesFrontRef = useRef<HTMLDivElement>(null);
  const panelCount = Children.count(children);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const wavesBack = wavesBackRef.current;
    const wavesFront = wavesFrontRef.current;
    if (!outer || !track) return;

    /** Pixels of horizontal travel — matches vertical scroll distance 1:1 while pinned. */
    const getMetrics = () => {
      const panels = Array.from(track.children) as HTMLElement[];
      const totalWidth = panels.reduce((w, el) => w + el.offsetWidth, 0);
      const scrollDistance = Math.max(0, totalWidth - outer.clientWidth);
      return { scrollDistance, scrollX: -scrollDistance };
    };

    const syncOuterHeight = (scrollDistance: number) => {
      outer.style.height = `${scrollDistance + window.innerHeight}px`;
    };

    const refreshLayout = () => {
      const { scrollDistance } = getMetrics();
      syncOuterHeight(scrollDistance);
      ScrollTrigger.refresh();
    };

    const { scrollDistance } = getMetrics();
    syncOuterHeight(scrollDistance);

    const scrollTrigger = {
      trigger: outer,
      start: "top top",
      end: () => `+=${getMetrics().scrollDistance}`,
      scrub: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => getMetrics().scrollX,
        ease: "none",
        scrollTrigger,
      });
      if (showBottomWaves && wavesBack) {
        gsap.to(wavesBack, {
          x: () => {
            const { scrollX } = getMetrics();
            const startX = -(wavesBack.offsetWidth - outer.clientWidth);
            return startX - scrollX * WAVE_PARALLAX_BACK;
          },
          ease: "none",
          scrollTrigger,
        });
      }
      if (showBottomWaves && wavesFront) {
        gsap.to(wavesFront, {
          x: () => {
            const { scrollX } = getMetrics();
            const startX = -(wavesFront.offsetWidth - outer.clientWidth);
            return startX - scrollX * WAVE_PARALLAX_FRONT;
          },
          ease: "none",
          scrollTrigger,
        });
      }
    }, outer);

    const resizeObserver = new ResizeObserver(refreshLayout);
    resizeObserver.observe(track);
    for (const panel of Array.from(track.children)) {
      resizeObserver.observe(panel);
    }

    const onWindowResize = () => refreshLayout();
    window.addEventListener("resize", onWindowResize);

    const images = track.querySelectorAll("img");
    for (const img of images) {
      if (!img.complete) {
        img.addEventListener("load", refreshLayout, { once: true });
      }
    }

    return () => {
      ctx.revert();
      resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      outer.style.height = "";
    };
  }, [panelCount, showBottomWaves]);

  return (
    <div
      ref={outerRef}
      className={`relative z-[10] min-h-screen ${className ?? "bg-background"}`}
    >
      <div className="relative sticky top-0 isolate h-screen overflow-hidden">
        <div ref={trackRef} className="flex h-full will-change-transform">
          {children}
        </div>
        {showBottomWaves ? (
          <HorizontalScrollBottomWaves
            panelCount={panelCount}
            backRef={wavesBackRef}
            frontRef={wavesFrontRef}
          />
        ) : null}
      </div>
    </div>
  );
}
