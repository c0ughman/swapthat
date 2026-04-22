"use client";

import Image from "next/image";
import type { PageDef } from "./config";
import { CARD_VW, CARD_VW_MOBILE, THUMBNAIL_ASPECT_RATIO } from "./config";
import { Q } from "@/lib/imageQuality";

export type CarouselCardVariant = "wheel" | "fullscreen";

interface CarouselCardProps {
  page: PageDef;
  variant: CarouselCardVariant;
  /** When true, wheel cards rotate the whole thumbnail frame 90° CW (portrait card, no crop) */
  isMobileViewport: boolean;
}

export default function CarouselCard({
  page,
  variant,
  isMobileViewport,
}: CarouselCardProps) {
  if (variant === "fullscreen") {
    return (
      <div className="relative h-full w-full">
        <Image
          src={page.thumbnail}
          alt={page.label}
          fill
          className="object-contain"
          sizes="100vw"
          quality={Q.section}
          loading="lazy"
        />
      </div>
    );
  }

  /* Desktop wheel: landscape frame, image only */
  if (!isMobileViewport) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={page.thumbnail}
          alt={page.label}
          fill
          className="object-contain"
          sizes="55vw"
          quality={Q.section}
          loading="lazy"
        />
      </div>
    );
  }

  /* Mobile wheel: rotate the whole frame + image 90° CW so the card reads portrait like the placeholders */
  const w = `${CARD_VW}vw`;
  const h = `${CARD_VW / THUMBNAIL_ASPECT_RATIO}vw`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: w,
          height: h,
          transform: "translate(-50%, -50%) rotate(90deg)",
          transformOrigin: "center center",
        }}
      >
        <Image
          src={page.thumbnail}
          alt={page.label}
          fill
          className="object-contain"
          sizes="30vw"
          quality={Q.section}
          loading="lazy"
        />
      </div>
    </div>
  );
}
