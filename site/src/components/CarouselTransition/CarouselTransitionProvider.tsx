"use client";

import { createContext, useCallback, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Lightweight page-transition provider.
 *
 * Replaces the old 3D carousel/wheel with a simple, performant "fade + slight
 * rise" on every route change. Navigation is plain `router.push` — no custom
 * orchestration, no thumbnails, no panning.
 *
 * The context keeps the same shape the rest of the app already consumes
 * (`triggerTransition`, `phase`, `arrivedViaTransition`) so nothing downstream
 * had to change. `phase` is always "idle" and `arrivedViaTransition` is always
 * false now, which simply means hero/section components play their normal
 * mount-time entrance animations.
 */
type Phase = "idle";

interface CarouselTransitionContextValue {
  triggerTransition: (targetPath: string) => void;
  phase: Phase;
  arrivedViaTransition: boolean;
}

export const CarouselTransitionContext =
  createContext<CarouselTransitionContextValue | null>(null);

/** Fade + slight upward rise, replayed on each pathname change. */
const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
};

export default function CarouselTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const triggerTransition = useCallback(
    (targetPath: string) => {
      if (targetPath === pathname) return;
      router.push(targetPath);
    },
    [pathname, router],
  );

  return (
    <CarouselTransitionContext.Provider
      value={{ triggerTransition, phase: "idle", arrivedViaTransition: false }}
    >
      <motion.div
        key={pathname}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="enter"
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </CarouselTransitionContext.Provider>
  );
}
