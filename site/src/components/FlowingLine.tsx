"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface FlowingLineProps {
  color?: string;
  className?: string;
}

export default function FlowingLine({ color = "var(--blue)", className = "" }: FlowingLineProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`absolute left-1/2 -translate-x-1/2 w-2 pointer-events-none ${className}`}>
      <svg
        width="4"
        height="100%"
        viewBox="0 0 4 800"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M2 0C2 100 2 200 2 300C2 400 2 500 2 600C2 700 2 750 2 800"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
          opacity={0.2}
        />
      </svg>
    </div>
  );
}
