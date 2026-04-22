"use client";

import { useContext } from "react";
import { CarouselTransitionContext } from "./CarouselTransitionProvider";

export function useCarouselTransition() {
  const ctx = useContext(CarouselTransitionContext);
  if (!ctx) {
    throw new Error(
      "useCarouselTransition must be used within CarouselTransitionProvider"
    );
  }
  return ctx;
}
