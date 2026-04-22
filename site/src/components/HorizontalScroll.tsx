"use client";

import { useRef, useLayoutEffect, Children } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  /** Outer wrapper background (default matches page `bg-background`). */
  className?: string;
}

export default function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelCount = Children.count(children);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => {
          const panels = Array.from(track.children) as HTMLElement[];
          const totalWidth = panels.reduce((w, el) => w + el.offsetWidth, 0);
          return -(totalWidth - outer.clientWidth);
        },
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          // Animation completes over (panelCount-1) viewport-heights of scroll —
          // faster than the full sticky hold, so panels snap across quickly then rest on the last one
          end: () => `+=${(panelCount - 1) * window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, outer);

    return () => ctx.revert();
  }, [panelCount]);

  return (
    // Explicit height like stacking cards: outer holds scroll space, sticky holds content
    // (panelCount - 1) * 100vh = 200vh for 3 panels → 100vh of sticky travel
    <div
      ref={outerRef}
      className={`relative z-[10] ${className ?? "bg-background"}`}
      style={{ height: `calc(100vh + ${(panelCount - 1) * 225}vh)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={trackRef} className="flex h-full will-change-transform">
          {children}
        </div>
      </div>
    </div>
  );
}
