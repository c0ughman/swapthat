/** Thumbnail images are ~2768×1452 → ~1.91:1 aspect ratio */
export const THUMBNAIL_ASPECT_RATIO = 2768 / 1452;

export const PAGES = [
  {
    path: "/",
    label: "Teams & Charlas",
    thumbnail: "/thumbnails/teams.webp",
    mobileThumbnail: "/thumbnails/teams.svg",
    accent: "#6366f1",
  },
  {
    path: "/sistema",
    label: "Swap That System",
    thumbnail: "/thumbnails/sistema.webp",
    mobileThumbnail: "/thumbnails/sistema.svg",
    accent: "#1a1a1a",
  },
  {
    path: "/marketing",
    label: "Marketing & Performance",
    thumbnail: "/thumbnails/marketing.webp",
    mobileThumbnail: "/thumbnails/marketing.svg",
    accent: "#e85d75",
  },
] as const;

export type PageDef = (typeof PAGES)[number];

/** Card width during the carousel view (vw) */
export const CARD_VW = 50;

/** Narrow screens: smaller wheel frame so the card matches thumbnail scale (not oversized) */
export const CARD_VW_MOBILE = 28;

/** Border radius on cards during carousel view (px) */
export const CARD_RADIUS = 18;

/**
 * Revolver geometry.
 * Cards sit on the rim of a large circle whose center is far below the viewport.
 * A large radius means the visible arc at the top is gentle.
 */
export const WHEEL = {
  /** Radius of the circle (vw). Large = gentle arc. */
  radius: 200,
  /** Angular spacing between adjacent cards (degrees). */
  angleDeg: 16,
} as const;

export const TIMING = {
  shrink: 700,
  pan: 900,
  expand: 600,
} as const;

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Snappy spring-like ease for the revolver pan — fast start, overshoot feel */
export const PAN_EASE: [number, number, number, number] = [0.16, 1.2, 0.3, 1];

/** Card drop shadow for depth */
export const CARD_SHADOW = "0 12px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)";
