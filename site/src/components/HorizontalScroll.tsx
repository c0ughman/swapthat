"use client";

import { useRef, useLayoutEffect, useState, useEffect, Children } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HorizontalScrollBottomWaves, {
  WAVE_PARALLAX_BACK,
  WAVE_PARALLAX_FRONT,
  WAVE_LENGTH_MULTIPLIER,
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

  // Mobile squishes the wave strip into a much narrower physical width, sharpening
  // the wavelengths. Widen the strip (longer wavelength) and slow the parallax.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const waveLengthMultiplier = isMobile ? WAVE_LENGTH_MULTIPLIER * 2.4 : WAVE_LENGTH_MULTIPLIER;
  const waveParallaxBack = isMobile ? WAVE_PARALLAX_BACK * 0.12 : WAVE_PARALLAX_BACK;
  const waveParallaxFront = isMobile ? WAVE_PARALLAX_FRONT * 0.12 : WAVE_PARALLAX_FRONT;

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

    // Pin viewport height is captured ONCE so it doesn't track the mobile URL bar
    // collapsing/expanding. Using a live `window.innerHeight` here made the outer
    // height (and therefore the pinned scroll distance) shrink mid-scroll, which
    // yanked the page back up — the jitter. Lock it to the initial value instead.
    const pinViewportH = window.innerHeight;

    const syncOuterHeight = (scrollDistance: number) => {
      outer.style.height = `${scrollDistance + pinViewportH}px`;
    };

    const refreshLayout = () => {
      const { scrollDistance } = getMetrics();
      syncOuterHeight(scrollDistance);
      ScrollTrigger.refresh();
    };

    const { scrollDistance } = getMetrics();
    syncOuterHeight(scrollDistance);

    // Tell GSAP to ignore the mobile address-bar show/hide resize events that would
    // otherwise fire `refresh()` mid-scroll and snap the pin position around.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const scrollTrigger = {
      trigger: outer,
      start: "top top",
      end: () => `+=${getMetrics().scrollDistance}`,
      scrub: true,
      invalidateOnRefresh: true,
      // anticipatePin causes a visible jump on mobile when combined with scrub; the
      // pin engages cleanly without it on touch devices.
      anticipatePin: isMobile ? 0 : 1,
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => getMetrics().scrollX,
        ease: "none",
        scrollTrigger,
      });
      // Waves: the strip is far wider than the viewport, so its resting position is
      // a big negative startX. We must SET that immediately (fromTo) and only scrub
      // the small parallax delta — otherwise the tween animates the whole startX
      // offset across the scroll and the waves appear to race sideways no matter how
      // small the parallax factor is.
      if (showBottomWaves && wavesBack) {
        gsap.fromTo(
          wavesBack,
          { x: () => -(wavesBack.offsetWidth - outer.clientWidth) },
          {
            x: () => {
              const { scrollX } = getMetrics();
              const startX = -(wavesBack.offsetWidth - outer.clientWidth);
              return startX - scrollX * waveParallaxBack;
            },
            ease: "none",
            scrollTrigger,
          },
        );
      }
      if (showBottomWaves && wavesFront) {
        gsap.fromTo(
          wavesFront,
          { x: () => -(wavesFront.offsetWidth - outer.clientWidth) },
          {
            x: () => {
              const { scrollX } = getMetrics();
              const startX = -(wavesFront.offsetWidth - outer.clientWidth);
              return startX - scrollX * waveParallaxFront;
            },
            ease: "none",
            scrollTrigger,
          },
        );
      }
    }, outer);

    // Only the horizontal layout depends on width; height changes (mobile URL bar)
    // must NOT trigger a refresh or the pin jumps. Track the last seen width and
    // bail out of refreshes that aren't caused by a real width change.
    let lastWidth = outer.clientWidth;
    const refreshIfWidthChanged = () => {
      const w = outer.clientWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      refreshLayout();
    };

    const resizeObserver = new ResizeObserver(refreshIfWidthChanged);
    resizeObserver.observe(track);
    for (const panel of Array.from(track.children)) {
      resizeObserver.observe(panel);
    }

    const onWindowResize = () => refreshIfWidthChanged();
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
  }, [panelCount, showBottomWaves, waveParallaxBack, waveParallaxFront, isMobile]);

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
            lengthMultiplier={waveLengthMultiplier}
          />
        ) : null}
      </div>
    </div>
  );
}
