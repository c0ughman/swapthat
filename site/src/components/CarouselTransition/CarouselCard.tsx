"use client";

import Image from "next/image";
import type { PageDef } from "./config";
import { CARD_VW, THUMBNAIL_ASPECT_RATIO } from "./config";
import { Q } from "@/lib/imageQuality";

export type CarouselCardVariant = "wheel" | "fullscreen";

interface CarouselCardProps {
  page: PageDef;
  variant: CarouselCardVariant;
  /** When true, use the mobile thumbnail (no rotation needed — it's already the right orientation) */
  isMobileViewport: boolean;
}

export default function CarouselCard({
  page,
  variant,
  isMobileViewport,
}: CarouselCardProps) {
  const src = isMobileViewport ? page.mobileThumbnail : page.thumbnail;

  if (variant === "fullscreen") {
    return (
      <div className="relative h-full w-full">
        <Image
          src={src}
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

  /* Wheel card — same layout for both desktop and mobile; no rotation hack needed */
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={page.label}
        fill
        className="object-contain"
        sizes={`${CARD_VW}vw`}
        quality={Q.section}
        loading="lazy"
      />
    </div>
  );
}
