"use client";

import { motion, useInView } from "framer-motion";
import { useContext, useRef, ReactNode, useEffect, useState } from "react";
import { CarouselTransitionContext } from "./CarouselTransition/CarouselTransitionProvider";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  /** When true, uses opacity-only animation for lower GPU cost */
  light?: boolean;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  light = false,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  /** Positive bottom rootMargin so sections animate (and images load) before they’re fully on screen */
  const isInView = useInView(ref, { once: true, margin: "0px 0px 25% 0px", amount: 0.08 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Capture at mount: if this component mounted during a carousel transition,
  // skip the reveal animation — the page should appear already loaded.
  const ctx = useContext(CarouselTransitionContext);
  const [skipForTransition] = useState<boolean>(() => ctx?.arrivedViaTransition ?? false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const directionMap = {
    up: { y: 16, x: 0 },
    down: { y: -16, x: 0 },
    left: { y: 0, x: 16 },
    right: { y: 0, x: -16 },
  };

  const initial = light
    ? { opacity: 0 }
    : { opacity: 0, ...directionMap[direction] };
  const animate = isInView
    ? light
      ? { opacity: 1 }
      : { opacity: 1, y: 0, x: 0 }
    : {};

  // During/after a carousel transition: skip the reveal animation entirely
  if (prefersReducedMotion || skipForTransition) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      layout={false}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
