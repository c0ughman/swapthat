"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

type Props = {
  src: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Defers loading/decoding the source until the block is in view; uses `preload="none"` so the file
 * is not fetched until mounted (after intersection).
 */
export function LazyAutoplayVideo({ src, className, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "120px" });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <video
          src={src}
          autoPlay
          muted
          playsInline
          preload="none"
          className="block h-full min-h-0 w-full object-cover object-top lg:aspect-video lg:h-auto lg:w-full lg:object-contain"
          {...rest}
        />
      ) : (
        <div className="h-full w-full bg-white lg:aspect-video lg:h-auto" aria-hidden />
      )}
    </div>
  );
}
