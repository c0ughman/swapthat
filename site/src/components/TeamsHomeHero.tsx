"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { StarBurst } from "@/components/DecorativeSVGs";
import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { SHOW_PLACEHOLDER_CONTENT } from "@/lib/placeholderContent";
import { useTransitionArrival } from "./CarouselTransition/useTransitionArrival";

const HERO_SLIDESHOW_IMGS = ["/philosophy/1.webp", "/philosophy/2.webp", "/philosophy/3.webp", "/philosophy/4.webp", "/philosophy/5.webp"];

// Pixel values scaled ×0.8 to compensate for font-size:80% replacing zoom:0.8
const HERO_STICKER_PX = Math.round(77 * 1.1 * 1.2 * 0.8);
/** Larger render for the animal / “cat” meme sticker (1.2× base, then +50% vs that). */
const HERO_CAT_STICKER_SRC = "/stickers/st-1aec-3.webp";
const HERO_CAT_STICKER_PX = Math.round(HERO_STICKER_PX * 1.2 * 1.5);
/** Headline block only; stickers paint above this. */
const HERO_TITLE_Z = 10;
/** Sticker wave: above `HERO_TITLE_Z`, below eyebrow / body / CTAs. */
const HERO_STICKER_Z = 20;
/** Sticker wave strip below the squircle (≈ bottom 20% of viewport height). */
const HERO_STICKER_BAND_VH = 20;
/** Inner headline scale inside the 1.25× content wrapper (+10% on current headline size). */
const SISTEMA_HEADLINE_INNER_SCALE = 0.84 * 1.2 * 1.3 * 1.3 * 1.1;
/** Visual scale for `/sistema` copy + image only — stickers stay unscaled. */
const SISTEMA_CONTENT_SCALE = 1.25;
/** `/sistema` scatter stickers render 20% larger than the equipos hero base. */
const SISTEMA_STICKER_SCALE = 1.2;
const SISTEMA_STICKER_PX = Math.round(HERO_STICKER_PX * SISTEMA_STICKER_SCALE);
/** Visual-only shrink — scatter placement still uses `SISTEMA_STICKER_PX`. */
const SISTEMA_STICKER_RENDER_SCALE = 0.9;
/** Sticker centers may sit outside the sides — stay under the header, never past the bottom. */
const SISTEMA_SCATTER_BOUNDS = { l: -10, r: 110, t: 2, b: 96 } as const;
const SISTEMA_SCATTER_GRID = { cols: 6, rows: 7 } as const;
/** Eyebrow, subcopy, CTAs, pills — above sticker layer. */
const HERO_RAISED_COPY_Z = 30;
/** `/sistema` flanking photo sets — above stickers (`HERO_STICKER_Z`), with jump hero art. */
const SISTEMA_HERO_FLANK_Z = 45;
/** Light halo so text reads on top of busy sticker art. */
const HERO_TEXT_GLOW =
  "[text-shadow:0_1px_2px_rgba(255,255,255,0.97),0_2px_12px_rgba(255,255,255,0.82),0_0_26px_rgba(255,255,255,0.58)]";

type SistemaHeroSidePlaceholder = {
  width: number;
  height: number;
  rotateDeg: number;
  bgClass: string;
};

/**
 * ⚠️ MISSING / PLACEHOLDER: empty cards flanking the jump render (left = "Antes",
 * right = "Después"). Replace with the real before/after transformation photos
 * of a real member before launch.
 */
const SISTEMA_HERO_LEFT_PLACEHOLDERS: SistemaHeroSidePlaceholder[] = [
  { width: 108, height: 136, rotateDeg: -2.5, bgClass: "bg-neutral-100" },
  { width: 108, height: 136, rotateDeg: 2.5, bgClass: "bg-neutral-200" },
];

const SISTEMA_HERO_RIGHT_PLACEHOLDERS: SistemaHeroSidePlaceholder[] = [
  { width: 108, height: 136, rotateDeg: 2.5, bgClass: "bg-neutral-200" },
  { width: 108, height: 136, rotateDeg: -2.5, bgClass: "bg-neutral-100" },
];

function SistemaHeroSideImageSet({
  title,
  placeholders,
  align,
  skippedInitialAnimation,
}: {
  title: string;
  placeholders: SistemaHeroSidePlaceholder[];
  align: "left" | "right";
  skippedInitialAnimation: boolean;
}) {
  return (
    <div
      className={`hidden min-w-0 shrink-0 flex-col md:flex ${
        align === "left"
          ? "items-end translate-x-5 lg:translate-x-9 xl:translate-x-12"
          : "items-start -translate-x-5 lg:-translate-x-9 xl:-translate-x-12"
      } w-[min(15vw,142px)] -translate-y-[100px] self-end mb-6 lg:mb-10 lg:w-[min(13vw,164px)] xl:w-[min(11.5vw,178px)]`}
    >
      <div className="flex w-full flex-col gap-4 lg:gap-[1.125rem]">
        {placeholders.map((slot, i) => (
          <motion.div
            key={`${align}-${i}`}
            initial={skippedInitialAnimation ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.82 + i * 0.1,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className={`relative w-full overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06] ${slot.bgClass}`}
            style={{
              aspectRatio: `${slot.width} / ${slot.height}`,
              rotate: `${slot.rotateDeg}deg`,
            }}
          >
            {i === 0 ? (
              <span
                className={`absolute inset-x-0 top-0 z-[2] px-3 py-2.5 text-[0.9375rem] font-bold uppercase tracking-[0.14em] text-blue md:text-[1rem] lg:text-[1.0625rem] ${
                  align === "left" ? "text-right" : "text-left"
                }`}
              >
                {title}
              </span>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Extra lift for small copy (slightly softer). */
const HERO_BODY_GLOW =
  "[text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_2px_10px_rgba(255,255,255,0.75),0_0_20px_rgba(255,255,255,0.48)]";
/** White outer glow on filled / outline buttons. */
const HERO_BTN_HALO =
  "shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_3px_16px_rgba(255,255,255,0.45),0_8px_26px_rgba(255,255,255,0.22)]";

export const HERO_STICKER_SRCS = [
  "/stickers/st-1aec-2.webp",
  "/stickers/st-1aec-3.webp",
  "/stickers/blueberry-cluster.webp",
  "/stickers/frothy-mug-floral.webp",
  "/stickers/playful-smiley.webp",
  "/stickers/ripe-apple.webp",
  "/stickers/wa-114932.webp",
  "/stickers/wa-114932-2.webp",
  "/stickers/wa-114932-3.webp",
  "/stickers/wa-114933-3.webp",
  "/stickers/wa-115225.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-2.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-3.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-4.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-5.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-6.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-7.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-8.webp",
  "/stickers/0d827d9703620429cda1e20e26e3769f-9.webp",
] as const;

type ScatterItem = {
  src: string;
  left: string;
  top: string;
  wave?: boolean;
  rotateDeg?: number;
  /** Extra translateY (px) on the anchor, e.g. lower hero band. */
  offsetYpx?: number;
};

/**
 * Home hero: wavy line through the squircle — each sticker source appears twice for density.
 */
function buildWaveStickerItems(): ScatterItem[] {
  const list = [...HERO_STICKER_SRCS, ...HERO_STICKER_SRCS];

  const items: ScatterItem[] = [];
  const n = list.length;
  if (n === 0) return items;

  const waves = 2.65;
  const waves2 = 5.4;
  const amp = 11;
  const amp2 = 4.5;
  const midY = 50;

  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const left = 2.5 + t * 95;
    const rawTop =
      midY - amp * Math.sin(t * Math.PI * 2 * waves) - amp2 * Math.sin(t * Math.PI * 2 * waves2);
    const top = Math.min(94, Math.max(7, rawTop));
    items.push({
      src: list[i]!,
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      wave: true,
    });
  }

  return items;
}

/** Deterministic 0..1 — SSR-safe placement RNG. */
function sistemaScatterRnd(seed: number, channel: number) {
  const v = Math.sin((seed + 1) * 17.73 + channel * 53.91 + 23.7 * (channel + seed)) * 31237.11;
  return v - Math.floor(v);
}

function deterministicShuffle<T>(arr: T[], salt: number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(sistemaScatterRnd(i + salt, 7) * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function buildInterleavedSrcQueue(salt: number): string[] {
  const roundA = deterministicShuffle([...HERO_STICKER_SRCS], salt + 11);
  const roundB = deterministicShuffle([...HERO_STICKER_SRCS], salt + 29);
  const roundC = deterministicShuffle([...HERO_STICKER_SRCS], salt + 47);
  const roundD = deterministicShuffle([...HERO_STICKER_SRCS], salt + 61);
  const roundE = deterministicShuffle([...HERO_STICKER_SRCS], salt + 73);
  const queue: string[] = [];
  for (let i = 0; i < roundA.length; i++) {
    queue.push(roundA[i]!, roundB[i]!, roundC[i]!, roundD[i]!, roundE[i]!);
  }
  return queue;
}

/** Favor top edge — user wants density higher in the frame. */
function pickSistemaEdgeSide(seed: number): 0 | 1 | 2 | 3 {
  const r = sistemaScatterRnd(seed, 3);
  if (r < 0.22) return 0;
  if (r < 0.44) return 1;
  if (r < 0.74) return 2;
  return 3;
}

function getSistemaStickerContentCore(viewportW: number) {
  /** Tight bounds around centered copy + jump image (not the full squircle). */
  return viewportW >= 1024
    ? { l: 33, t: 7, r: 67, b: 91 }
    : { l: 17, t: 6, r: 83, b: 92 };
}

type PlacedSistemaSticker = { left: number; top: number; src: string; rot: number };

/**
 * `/sistema` hero: random scatter hugging open margins around copy + image.
 * Each source may appear up to 5×; duplicates stay on opposite sides and at least ~2.25× apart.
 */
function buildSistemaRandomScatterItems(viewportW: number, viewportH: number): ScatterItem[] {
  const w = Math.max(320, viewportW);
  const h = Math.max(520, viewportH * 1.28);

  const core = getSistemaStickerContentCore(viewportW);
  /** Only exclude sticker centers that would overlap content — edges can graze the column. */
  const halfW = (SISTEMA_STICKER_PX * 0.46 / w) * 100;
  const halfH = (SISTEMA_STICKER_PX * 0.46 / h) * 100;
  const ex = {
    l: core.l - halfW,
    t: core.t - halfH,
    r: core.r + halfW,
    b: core.b + halfH,
  };

  const minDistPx = SISTEMA_STICKER_PX * 0.84;
  const dupMinDistPx = SISTEMA_STICKER_PX * 2.25;
  /** Target gap between unrelated neighbors — pick the valid spot closest to this. */
  const idealNeighborPx = SISTEMA_STICKER_PX * 1.08;
  // Fewer copies per sticker source = lighter sistema hero (fewer DOM nodes +
  // lazy-image requests) with no meaningful change to how dense it looks.
  const maxCopiesPerSrc = 4;
  const midX = (ex.l + ex.r) / 2;
  const midY = (ex.t + ex.b) / 2;
  const gridSpanL = SISTEMA_SCATTER_BOUNDS.r - SISTEMA_SCATTER_BOUNDS.l;
  const gridSpanT = SISTEMA_SCATTER_BOUNDS.b - SISTEMA_SCATTER_BOUNDS.t;

  function scatterGridKey(l: number, t: number): string {
    const gx = Math.min(
      SISTEMA_SCATTER_GRID.cols - 1,
      Math.max(
        0,
        Math.floor(((l - SISTEMA_SCATTER_BOUNDS.l) / gridSpanL) * SISTEMA_SCATTER_GRID.cols)
      )
    );
    const gy = Math.min(
      SISTEMA_SCATTER_GRID.rows - 1,
      Math.max(
        0,
        Math.floor(((t - SISTEMA_SCATTER_BOUNDS.t) / gridSpanT) * SISTEMA_SCATTER_GRID.rows)
      )
    );
    return `${gx}-${gy}`;
  }

  function gridCellBlocked(gx: number, gy: number): boolean {
    const l =
      SISTEMA_SCATTER_BOUNDS.l +
      ((gx + 0.5) / SISTEMA_SCATTER_GRID.cols) * gridSpanL;
    const t =
      SISTEMA_SCATTER_BOUNDS.t +
      ((gy + 0.5) / SISTEMA_SCATTER_GRID.rows) * gridSpanT;
    return inBlocked(l, t);
  }

  function inBlocked(l: number, t: number): boolean {
    return l > ex.l && l < ex.r && t > ex.t && t < ex.b;
  }

  /** No stickers in a row above the copy column — upper margin belongs on the sides. */
  function inTopCenterBand(l: number, t: number): boolean {
    return t < ex.t + halfH * 0.55 && l > ex.l && l < ex.r;
  }

  function distPx(l1: number, t1: number, l2: number, t2: number): number {
    const dx = ((l1 - l2) / 100) * w;
    const dy = ((t1 - t2) / 100) * h;
    return Math.hypot(dx, dy);
  }

  function zoneImbalance(): { h: number; v: number } {
    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;
    for (const p of placed) {
      if (p.left < midX) left++;
      else right++;
      if (p.top < midY) top++;
      else bottom++;
    }
    return { h: right - left, v: bottom - top };
  }

  function isValid(l: number, t: number, src: string, placed: PlacedSistemaSticker[]): boolean {
    if (
      inBlocked(l, t) ||
      inTopCenterBand(l, t) ||
      l < SISTEMA_SCATTER_BOUNDS.l ||
      l > SISTEMA_SCATTER_BOUNDS.r ||
      t < SISTEMA_SCATTER_BOUNDS.t ||
      t > SISTEMA_SCATTER_BOUNDS.b ||
      t + halfH > 99.5
    ) {
      return false;
    }

    const sameSrc = placed.filter((p) => p.src === src);
    const onLeft = l < midX;
    const onTop = t < midY;

    for (const p of placed) {
      const need = p.src === src ? dupMinDistPx : minDistPx;
      if (distPx(l, t, p.left, p.top) < need) return false;
    }

    if (sameSrc.length === 1) {
      const first = sameSrc[0]!;
      if ((first.left < midX) === onLeft) return false;
    } else if (sameSrc.length === 2) {
      const first = sameSrc[0]!;
      if ((first.top < midY) === onTop) return false;
    } else if (sameSrc.length === 3) {
      const second = sameSrc[1]!;
      if ((second.top < midY) === onTop) return false;
    } else if (sameSrc.length === 4) {
      const third = sameSrc[2]!;
      if ((third.left < midX) === onLeft) return false;
    }

    return true;
  }

  function nearestNeighborPx(l: number, t: number, others: PlacedSistemaSticker[]): number {
    if (others.length === 0) return idealNeighborPx;
    let min = Infinity;
    for (const p of others) {
      min = Math.min(min, distPx(l, t, p.left, p.top));
    }
    return min;
  }

  /** Higher = better fit in the target spacing band (~1.08× sticker size). */
  function spacingScore(l: number, t: number, others: PlacedSistemaSticker[]): number {
    const nearest = nearestNeighborPx(l, t, others);
    const bandLow = idealNeighborPx * 0.92;
    const bandHigh = idealNeighborPx * 1.28;
    const deviation = Math.abs(nearest - idealNeighborPx);
    let score = -deviation;
    if (nearest < bandLow) score -= (bandLow - nearest) * 2.2;
    if (nearest > bandHigh) score -= (nearest - bandHigh) * 1.35;

    const key = scatterGridKey(l, t);
    const [gxStr, gyStr] = key.split("-");
    const gx = Number(gxStr);
    const gy = Number(gyStr);
    if (gridCellBlocked(gx, gy)) return score - 500;

    const cellCount = gridCounts.get(key) ?? 0;
    score -= cellCount * 14;
    if (others.length > 0) {
      const avgPerCell = others.length / Math.max(1, gridCounts.size);
      score += Math.max(0, avgPerCell - cellCount) * 10;
    }

    return score;
  }

  /** Bias attempts toward the edges of the content column so scatter wraps it, not two far gutters. */
  function sampleNearContentEdge(seed: number): { l: number; t: number } {
    const side = pickSistemaEdgeSide(seed);
    const jitter = sistemaScatterRnd(seed, 4);
    const along = sistemaScatterRnd(seed, 5);
    const hugSide = 0.42 + jitter * 1.35;
    const alongPad = halfW * 0.35;
    /** Skew vertical runs toward the upper margin (lower % = higher on screen). */
    const alongTopBias = Math.pow(along, 0.68);

    if (side === 0) {
      return {
        l: ex.l - halfW * hugSide,
        t: core.t + alongTopBias * (core.b - core.t),
      };
    }
    if (side === 1) {
      return {
        l: ex.r + halfW * hugSide,
        t: core.t + alongTopBias * (core.b - core.t),
      };
    }
    if (side === 2) {
      const upperLeft = sistemaScatterRnd(seed, 6) < 0.5;
      const upperSpan = Math.max(5, ex.t - SISTEMA_SCATTER_BOUNDS.t);
      const upperT = SISTEMA_SCATTER_BOUNDS.t + alongTopBias * upperSpan;
      if (upperLeft) {
        return {
          l: ex.l - halfW * hugSide,
          t: upperT,
        };
      }
      return {
        l: ex.r + halfW * hugSide,
        t: upperT,
      };
    }
    return {
      l: core.l - alongPad + along * (core.r - core.l + alongPad * 2),
      t: Math.min(SISTEMA_SCATTER_BOUNDS.b, ex.b + halfH * Math.min(hugSide, 0.88)),
    };
  }

  const queue = buildInterleavedSrcQueue(Math.round(w + h));

  const placed: PlacedSistemaSticker[] = [];
  const gridCounts = new Map<string, number>();
  const srcCount = new Map<string, number>();
  const maxAttempts = 144;

  for (let qi = 0; qi < queue.length; qi++) {
    const src = queue[qi]!;
    if ((srcCount.get(src) ?? 0) >= maxCopiesPerSrc) continue;

    let best: PlacedSistemaSticker | null = null;
    let bestScore = -Infinity;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const seed = qi * 131 + attempt * 17;
      const nearEdge = attempt % 6 !== 0;
      const spanL = SISTEMA_SCATTER_BOUNDS.r - SISTEMA_SCATTER_BOUNDS.l;
      const spanT = SISTEMA_SCATTER_BOUNDS.b - SISTEMA_SCATTER_BOUNDS.t;
      const { l: rawL, t: rawT } = nearEdge
        ? sampleNearContentEdge(seed)
        : {
            l: SISTEMA_SCATTER_BOUNDS.l + sistemaScatterRnd(seed, 0) * spanL,
            t:
              SISTEMA_SCATTER_BOUNDS.t +
              Math.pow(sistemaScatterRnd(seed, 1), 1.25) * spanT,
          };
      const l = Math.min(
        SISTEMA_SCATTER_BOUNDS.r,
        Math.max(SISTEMA_SCATTER_BOUNDS.l, rawL)
      );
      const t = Math.min(
        SISTEMA_SCATTER_BOUNDS.b,
        Math.max(SISTEMA_SCATTER_BOUNDS.t, rawT)
      );
      const { h: hImb, v: vImb } = zoneImbalance();
      if (hImb > 2 && l > midX + 3) continue;
      if (hImb < -2 && l < midX - 3) continue;
      if (vImb > 2 && t > midY + 3) continue;
      if (vImb < -2 && t < midY - 3) continue;
      const rot = (sistemaScatterRnd(seed, 2) - 0.5) * 30;
      if (!isValid(l, t, src, placed)) continue;
      const score = spacingScore(l, t, placed);
      if (score > bestScore) {
        bestScore = score;
        best = { left: l, top: t, src, rot };
      }
    }

    if (best) {
      placed.push(best);
      srcCount.set(src, (srcCount.get(src) ?? 0) + 1);
      const key = scatterGridKey(best.left, best.top);
      gridCounts.set(key, (gridCounts.get(key) ?? 0) + 1);
    }
  }

  return placed.map((p) => ({
    src: p.src,
    left: `${p.left.toFixed(1)}%`,
    top: `${p.top.toFixed(1)}%`,
    wave: true,
    rotateDeg: Math.round(p.rot * 10) / 10,
  }));
}

const STICKER_OUTWARD_NUDGE_PX = 16; // was 20, scaled ×0.8

/** Shift outward toward whichever edge (L/R/T/B) the sticker is closest to, in % space. */
function stickerOutwardOffset(leftPctStr: string, topPctStr: string): { ox: number; oy: number } {
  const L = parseFloat(leftPctStr);
  const T = parseFloat(topPctStr);
  const dLeft = L;
  const dRight = 100 - L;
  const dTop = T;
  const dBottom = 100 - T;
  const min = Math.min(dLeft, dRight, dTop, dBottom);
  const eps = 0.001;
  if (dLeft <= min + eps) return { ox: -STICKER_OUTWARD_NUDGE_PX, oy: 0 };
  if (dRight <= min + eps) return { ox: STICKER_OUTWARD_NUDGE_PX, oy: 0 };
  if (dTop <= min + eps) return { ox: 0, oy: -STICKER_OUTWARD_NUDGE_PX };
  return { ox: 0, oy: STICKER_OUTWARD_NUDGE_PX };
}

/** Stagger sistema sticker pop-in — center rows first, perimeter last (reversed + slower). */
function sistemaStickerEnterDelay(
  leftPct: string,
  topPct: string,
  order: number,
  total: number
): number {
  const L = parseFloat(leftPct);
  const T = parseFloat(topPct);
  const inCenterColumn = L > 28 && L < 72;
  const isCenterRow = inCenterColumn && (T < 24 || T > 78);
  const reversed = Math.max(0, total - 1 - order);

  if (isCenterRow) {
    return 0.18 + (order % 12) * 0.022;
  }

  return Math.min(1.55, 0.52 + reversed * 0.014);
}

function StickerFloat({
  item,
  i,
  scale = 1,
  basePxOverride,
  enterDelay,
}: {
  item: ScatterItem;
  i: number;
  scale?: number;
  /** Optional render size (e.g. sistema scatter uses a larger base). */
  basePxOverride?: number;
  /** Override pop-in delay (seconds). */
  enterDelay?: number;
}) {
  const basePx =
    basePxOverride ??
    (item.src === HERO_CAT_STICKER_SRC ? HERO_CAT_STICKER_PX : HERO_STICKER_PX);
  const px = Math.round(basePx * scale);
  const { ox, oy } = item.wave ? { ox: 0, oy: 0 } : stickerOutwardOffset(item.left, item.top);
  const offY = item.offsetYpx ?? 0;
  return (
    <div
      className="absolute"
      style={{
        left: item.left,
        top: item.top,
        transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy + offY}px))`,
      }}
    >
      <motion.div
        className="flex shrink-0 items-center justify-center"
        style={{ width: px, height: px, opacity: 1, rotate: item.rotateDeg ?? 0 }}
        initial={{ opacity: 0, scale: 0.58, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: enterDelay !== undefined ? 300 : 380,
          damping: enterDelay !== undefined ? 15 : 13,
          mass: enterDelay !== undefined ? 0.9 : 0.72,
          bounce: enterDelay !== undefined ? 0.3 : 0.38,
          delay: enterDelay ?? i * 0.045,
        }}
      >
        <Image
          src={item.src}
          alt=""
          width={px}
          height={px}
          className="h-full w-full object-contain opacity-100"
          style={{ opacity: 1 }}
          draggable={false}
          sizes={`${px}px`}
          quality={Q.icon}
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}

export type TeamsHomeHeroProps = {
  /** Primary CTA (e.g. `#cta` on `/sistema`, `/#contacto` for equipos). */
  contactHref?: string;
  /** Optional second CTA (e.g. `#que-es` on `/sistema`). */
  secondaryHref?: string;
  /**
   * Swap That System (`/sistema`): slightly larger hero H1s, tighter gap from subtitle to CTAs.
   */
  swapThatSystemHero?: boolean;
};

/** Centered hero with rotating images: defaults for equipos; on `/sistema` pass coaching `href`s. */
export function TeamsHomeHero({
  contactHref = "#contacto",
  secondaryHref,
  swapThatSystemHero = false,
}: TeamsHomeHeroProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [viewportSize, setViewportSize] = useState({ w: 1200, h: 800 });
  const { skippedInitialAnimation } = useTransitionArrival();

  useEffect(() => {
    const sync = () =>
      setViewportSize({
        w: window.innerWidth,
        h: Math.max(1, window.innerHeight),
      });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const scatterItems = useMemo(() => buildWaveStickerItems(), []);
  const sistemaScatterItems = useMemo(
    () => buildSistemaRandomScatterItems(viewportSize.w, viewportSize.h),
    [viewportSize.w, viewportSize.h]
  );

  const sistemaInnerTranslateY = swapThatSystemHero ? undefined : "translateY(-35px)";
  const sistemaHeadlineTranslate = swapThatSystemHero
    ? `scale(${SISTEMA_HEADLINE_INNER_SCALE})`
    : "translateY(-38px) scale(0.918)";

  const heroTextAlign = swapThatSystemHero ? "text-center" : "text-center";
  const heroItemsMain = swapThatSystemHero ? "items-center" : "items-center";
  const heroJustify = swapThatSystemHero ? "justify-center" : "justify-center";
  const sistemaCopyGutterClass = "px-5 sm:px-8";

  const headlineFontSize = swapThatSystemHero
    ? "clamp(3.4rem, 8.8vw, 6.9rem)"
    : "clamp(2.8rem, 7.1vw, 5.65rem)";
  /** Sistema: tighter headline scale on all breakpoints. */
  const sistemaHeadlineSizeClass =
    "text-[clamp(1.85rem,6.8vw,2.75rem)] sm:text-[clamp(2.15rem,7.2vw,3.15rem)] md:text-[clamp(2.55rem,5.8vw,4.65rem)]";

  const eyebrowLineClass = swapThatSystemHero ? "bg-black" : "bg-blue";
  const eyebrowLabelClass = swapThatSystemHero ? "text-black" : "text-blue";
  const paraAccentClass = swapThatSystemHero ? "italic font-light text-black" : "italic font-light text-blue";
  const subDividerClass = swapThatSystemHero
    ? "h-0.5 w-[9rem] mx-auto origin-center shrink-0 bg-gradient-to-r from-black/35 to-black/15"
    : "h-0.5 w-[9rem] shrink-0 bg-gradient-to-r from-blue/45 to-coral/35";
  const primaryCtaClass = swapThatSystemHero
    ? `group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-black px-[1.65rem] py-[0.55rem] text-[0.9625rem] font-semibold text-white shadow-md shadow-black/15 ${HERO_BTN_HALO} transition-all duration-300 hover:bg-neutral-900 sm:w-auto sm:px-[1.925rem] sm:py-[0.55rem] sm:text-[0.9625rem] md:gap-2 md:px-[2.2rem] md:py-[0.6875rem] md:text-[0.9625rem]`
    : `group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-blue px-5 py-2.5 text-[0.75rem] font-bold text-white shadow-md shadow-blue/22 ${HERO_BTN_HALO} transition-all duration-300 hover:bg-blue-dark sm:w-auto sm:px-6 sm:py-3 sm:text-[0.8125rem]`;
  const secondaryCtaClass = swapThatSystemHero
    ? `inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/25 bg-white/85 px-[1.65rem] py-[0.55rem] text-[0.9625rem] font-semibold text-black ${HERO_BODY_GLOW} ${HERO_BTN_HALO} shadow-sm backdrop-blur-[2px] transition-all duration-300 hover:bg-black/[0.06] sm:w-auto sm:px-[1.925rem] sm:py-[0.55rem] sm:text-[0.9625rem] md:px-[2.2rem] md:py-[0.6875rem] md:text-[0.9625rem]`
    : `inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-foreground/18 bg-white/75 px-5 py-2.5 text-[0.75rem] font-bold text-foreground ${HERO_BODY_GLOW} ${HERO_BTN_HALO} backdrop-blur-[2px] transition-all duration-300 hover:bg-foreground/[0.06] sm:w-auto sm:px-6 sm:py-3 sm:text-[0.8125rem]`;
  const pillClass = swapThatSystemHero
    ? `flex items-center gap-1 rounded-full border border-black/20 bg-white/75 px-2.5 py-1 text-[0.6875rem] leading-tight text-foreground/90 backdrop-blur-sm sm:text-[0.75rem] ${HERO_BODY_GLOW} shadow-[0_2px_10px_rgba(255,255,255,0.55)]`
    : `flex items-center gap-1 rounded-full border border-blue/22 bg-white/75 px-2.5 py-1 text-[0.6875rem] leading-tight text-foreground/90 backdrop-blur-sm sm:text-[0.75rem] ${HERO_BODY_GLOW} shadow-[0_2px_10px_rgba(255,255,255,0.55)]`;
  const pillIconColor = swapThatSystemHero ? "#171717" : "var(--blue)";

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((i) => (i + 1) % HERO_SLIDESHOW_IMGS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const headlineInner = (
    <>
      <motion.h1
        initial={skippedInitialAnimation ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: swapThatSystemHero ? 0 : 40 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        className={`relative pb-0 font-bold tracking-tight text-foreground ${heroTextAlign} ${HERO_TEXT_GLOW} ${
          swapThatSystemHero ? `leading-[0.88] ${sistemaHeadlineSizeClass}` : ""
        }`}
        style={swapThatSystemHero ? undefined : { fontSize: headlineFontSize }}
      >
        Entrena
      </motion.h1>

      {!swapThatSystemHero ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -10, y: -12 }}
            animate={{ opacity: 0, scale: 1, rotate: -10, y: 28 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative z-20 shrink-0 overflow-hidden shadow-none ring-0 pointer-events-none self-center"
            style={{
              width: 121,
              height: 85,
              marginTop: "-1.7rem",
              marginBottom: "-1.7rem",
            }}
            aria-hidden
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={slideIndex}
                src={HERO_SLIDESHOW_IMGS[slideIndex]}
                alt=""
                width={151}
                height={106}
                className="absolute inset-0 block h-full w-full object-cover opacity-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
                decoding="async"
              />
            </AnimatePresence>
          </motion.div>

          <motion.h1
            initial={skippedInitialAnimation ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: -16 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className={`relative pt-0 font-bold tracking-tight text-foreground ${heroTextAlign} ${HERO_TEXT_GLOW} leading-[0.95]`}
            style={{ fontSize: headlineFontSize }}
          >
            <span className={paraAccentClass} style={{ fontSize: "1.08em" }}>
              para volver
            </span>
            <br />
            a ti.
          </motion.h1>
        </>
      ) : null}
    </>
  );

  const sistemaHeadlineInner = (
    <motion.h1
      initial={skippedInitialAnimation ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
      className={`relative font-normal tracking-tight text-foreground text-center ${HERO_TEXT_GLOW} ${sistemaHeadlineSizeClass} leading-[0.98]`}
      style={{ transform: sistemaHeadlineTranslate }}
    >
      <span className="block">
        <span className="font-bold">Entrena</span> para
      </span>
      <span className="block" style={{ fontSize: "1.05em" }}>
        <span className={`font-normal ${paraAccentClass}`}>volver a </span>
        <span className="font-bold not-italic">ti.</span>
      </span>
    </motion.h1>
  );

  return (
    <section
      className={
        swapThatSystemHero
          ? "relative flex min-h-screen min-w-0 flex-col overflow-x-visible overflow-y-visible bg-foreground pt-[calc(3.5rem+20px)] pb-4 sm:pb-5 md:pb-8 lg:pb-10"
          : "relative flex h-screen min-w-0 flex-col overflow-hidden bg-foreground pt-[calc(3.5rem+10px)] pb-5 md:pb-8 lg:pb-10"
      }
    >
      <div
        className={
          swapThatSystemHero
            ? "pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-black/[0.08] blur-2xl"
            : "pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-blue/15 blur-2xl"
        }
      />
      <div
        className={
          swapThatSystemHero
            ? "pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/[0.06] blur-2xl"
            : "pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-coral/10 blur-2xl"
        }
      />

      <motion.div
        initial={skippedInitialAnimation ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        className={`relative z-[2] mx-5 mt-0 flex min-w-0 flex-col rounded-[2.5rem] border border-beige-dark/55 bg-white shadow-[0_14px_44px_-12px_rgba(26,26,26,0.11)] md:mx-8 md:rounded-[3rem] lg:mx-10 ${
          swapThatSystemHero
            ? "min-h-[min(165vh,1475px)] overflow-visible pt-6 pb-[min(20vh,180px)] md:pt-8 md:pb-[min(22vh,200px)] lg:pt-9"
            : "min-h-0 min-w-0 flex-1 overflow-hidden pt-8"
        }`}
      >
        <div
          className={
            swapThatSystemHero
              ? "pointer-events-none absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-black/[0.07] blur-2xl"
              : "pointer-events-none absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-blue/[0.14] blur-2xl"
          }
        />
        <div
          className={
            swapThatSystemHero
              ? "pointer-events-none absolute -bottom-20 -left-20 z-0 h-72 w-72 rounded-full bg-black/[0.05] blur-2xl"
              : "pointer-events-none absolute -bottom-20 -left-20 z-0 h-72 w-72 rounded-full bg-coral/[0.12] blur-2xl"
          }
        />

        {!swapThatSystemHero ? (
          <div
            className="pointer-events-none absolute inset-y-0 -left-[10%] -right-[10%] w-auto select-none overflow-visible"
            style={{ transform: "translateY(70px)", zIndex: HERO_STICKER_Z }}
            aria-hidden
          >
            <div className="hidden sm:block h-full w-full">
              {scatterItems.map((item, i) => (
                <StickerFloat key={`sq-${item.src}-${i}`} item={item} i={i} />
              ))}
            </div>
            <div className="sm:hidden h-full w-full">
              {scatterItems.filter((_, i) => i % 4 === 0).map((item, i) => (
                <StickerFloat key={`sq-mob-${item.src}-${i}`} item={item} i={i} />
              ))}
            </div>
          </div>
        ) : null}

        <div
          className={
            swapThatSystemHero
              ? "relative z-[30] flex min-h-0 min-w-0 flex-1 flex-col items-center gap-0 origin-top w-full"
              : "translate-y-[50px]"
          }
          style={swapThatSystemHero ? { transform: `scale(${SISTEMA_CONTENT_SCALE})` } : undefined}
        >
          <div
            className={
            swapThatSystemHero
              ? `relative z-[1] flex w-full flex-col items-center justify-start gap-0 text-center pt-0 md:pt-1 -translate-y-2 md:-translate-y-4 ${sistemaCopyGutterClass}`
              : "contents"
            }
          >
        <div
          className={`relative flex shrink-0 overflow-visible ${
            swapThatSystemHero ? "items-center justify-center px-0" : "justify-center px-6 md:px-10"
          } ${swapThatSystemHero ? "" : "pt-8"}`}
          style={{
            transform: sistemaInnerTranslateY,
            zIndex: HERO_RAISED_COPY_Z,
          }}
        >
          <div
            className={`flex w-full max-w-4xl flex-col ${heroItemsMain} ${heroTextAlign} ${
              swapThatSystemHero ? "max-w-[min(100%,44rem)] xl:max-w-[min(100%,48rem)]" : ""
            }`}
          >
            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`${swapThatSystemHero ? "mb-[3px] md:mb-[7px]" : "mb-0.5"} flex items-center gap-2 ${heroJustify}`}
            >
              <span className={`h-0.5 w-7 shrink-0 ${eyebrowLineClass}`} />
              <span
                className={`${
                  swapThatSystemHero
                    ? "text-[0.894rem] md:text-[0.9rem]"
                    : "text-[0.8125rem]"
                } font-semibold uppercase tracking-[0.2em] ${eyebrowLabelClass} ${HERO_TEXT_GLOW}`}
              >
                Swap That System
              </span>
            </motion.div>
          </div>
        </div>

        <div
          className={`relative flex shrink-0 overflow-visible ${
            swapThatSystemHero ? "items-center justify-center px-0 mb-[13px] md:mb-[17px]" : "justify-center px-4 sm:px-6 md:px-10"
          }`}
          style={{
            transform: sistemaInnerTranslateY,
            zIndex: HERO_TITLE_Z,
          }}
        >
          <div
            className={`flex w-full max-w-4xl flex-col ${heroItemsMain} ${heroTextAlign} ${
              swapThatSystemHero ? "max-w-[min(100%,44rem)] xl:max-w-[min(100%,48rem)]" : ""
            }`}
          >
            {swapThatSystemHero ? (
              <div className="relative z-10 w-full">{sistemaHeadlineInner}</div>
            ) : (
              <div
                className="relative flex w-full origin-center flex-col items-center leading-[0.85]"
                style={{ transform: "translateY(-38px) scale(0.918)" }}
              >
                {headlineInner}
              </div>
            )}
          </div>
        </div>

        <div
          className={`relative flex shrink-0 flex-col overflow-visible ${
            swapThatSystemHero
              ? "items-center justify-center px-0 pt-2 pb-2 md:pt-3 md:pb-3 -translate-y-[20px]"
              : "items-center px-6 py-3 pb-4 md:px-10 md:pb-5"
          }`}
          style={{
            transform: sistemaInnerTranslateY,
            zIndex: HERO_RAISED_COPY_Z,
          }}
        >
          <div
            className={
              swapThatSystemHero
                ? "flex w-full max-w-4xl flex-col items-center text-center max-w-[min(100%,44rem)] xl:max-w-[min(100%,48rem)]"
                : "flex w-full max-w-4xl flex-col items-center text-center"
            }
            >
            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className={
                swapThatSystemHero
                  ? "relative mt-2 flex w-full flex-col items-center gap-[15px] md:gap-[17px]"
                  : "relative mt-[clamp(-2rem,-5.5vw,-0.75rem)] flex w-full flex-col items-center gap-2.5"
              }
            >
              <motion.div
                initial={skippedInitialAnimation ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
                className={subDividerClass}
              />

              <div
                className={`max-w-md ${swapThatSystemHero ? "space-y-[13px] md:space-y-[15px]" : "space-y-2 md:space-y-2.5"} ${swapThatSystemHero ? "text-center" : "text-center"}`}
              >
                <motion.p
                  initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className={`${
                    swapThatSystemHero
                      ? "text-[0.894rem] leading-snug text-foreground/88 md:text-[0.963rem]"
                      : "text-[0.8125rem] leading-snug text-foreground/88 md:text-[0.875rem]"
                  } ${HERO_BODY_GLOW}`}
                >
                  Incluso cuando tu vida no está ordenada.
                </motion.p>
                <motion.p
                  initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className={`${
                    swapThatSystemHero
                      ? "text-[0.894rem] leading-snug text-foreground/72 md:text-[0.963rem]"
                      : "text-[0.75rem] leading-snug text-foreground/72 md:text-[0.8125rem]"
                  } ${HERO_BODY_GLOW}`}
                >
                  Un sistema de entrenamiento, hábitos y mindset para mujeres activas que quieren entrenar a su
                  ritmo.
                </motion.p>
              </div>
            </motion.div>

            <div
              className={`relative flex w-full flex-col pb-0 ${
                swapThatSystemHero
                  ? "mt-[21px] md:mt-[25px] items-stretch self-stretch"
                  : "mt-5 items-center self-center"
              }`}
            >
              <motion.div
                initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className={
                  swapThatSystemHero
                    ? "flex w-full min-w-0 max-w-none flex-col items-stretch gap-3.5 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-center md:gap-4"
                    : "flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
                }
              >
                <Link href={contactHref} className={primaryCtaClass}>
                  {swapThatSystemHero ? "Quiero empezar hoy" : "Quiero entrenar a mi ritmo"}
                  <svg
                    width={swapThatSystemHero ? 20 : 15}
                    height={swapThatSystemHero ? 20 : 15}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                {secondaryHref ? (
                  <Link
                    href={secondaryHref}
                    className={secondaryCtaClass}
                    {...(swapThatSystemHero && /^https?:\/\//.test(secondaryHref)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {swapThatSystemHero ? "Descarga la app" : "Quiero sentirme bien"}
                  </Link>
                ) : null}
              </motion.div>

              <motion.div
                initial={skippedInitialAnimation ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className={`${swapThatSystemHero ? "mt-[21px] md:mt-[25px]" : "mt-4 md:mt-5"} flex w-full flex-wrap gap-2 ${
                  swapThatSystemHero ? "justify-center" : "justify-center"
                }`}
              >
                {["Sin presión", "A tu ritmo", "Retomas, no empiezas de cero"].map((pill, i) => (
                  <span key={i} className={pillClass}>
                    <StarBurst size={9} color={pillIconColor} />
                    {pill}
                  </span>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
          </div>

          {swapThatSystemHero ? (
            <div
              className="relative flex w-full shrink-0 flex-1 items-end justify-center overflow-visible px-2 pb-8 pt-0 sm:px-4 md:px-6 md:pb-10 -translate-y-[86px] md:-translate-y-[90px]"
              style={{ zIndex: SISTEMA_HERO_FLANK_Z }}
            >
              <div className="flex w-full max-w-[min(100%,1180px)] items-end justify-center gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                {/* Antes/Después are empty placeholders — hidden until real photos exist */}
                {SHOW_PLACEHOLDER_CONTENT ? (
                  <SistemaHeroSideImageSet
                    title="Antes"
                    placeholders={SISTEMA_HERO_LEFT_PLACEHOLDERS}
                    align="left"
                    skippedInitialAnimation={skippedInitialAnimation}
                  />
                ) : null}
                {/* Center focal point — polaroid of Andrea training */}
                <motion.div
                  className="flex shrink-0 items-end justify-center pb-2 md:pb-4"
                  initial={{ y: 260, opacity: 0, rotate: -4 }}
                  animate={{ y: 0, opacity: 1, rotate: -3 }}
                  transition={{
                    y: { delay: 0.7, type: "spring", stiffness: 90, damping: 16, mass: 1 },
                    opacity: { delay: 0.7, duration: 0.55, ease: "easeOut" },
                    rotate: { delay: 0.7, duration: 0.55, ease: "easeOut" },
                  }}
                >
                  <div className="relative rounded-[0.5rem] bg-white p-3 pb-[3.5rem] shadow-[0_28px_70px_-20px_rgba(26,26,26,0.4)] sm:p-4 sm:pb-[4.5rem] md:p-5 md:pb-[5.5rem]">
                    <div className="relative aspect-[3/4] w-[16rem] overflow-hidden bg-neutral-100 sm:w-[20rem] md:w-[24rem] lg:w-[28rem]">
                      <Image
                        src="/movement.webp"
                        alt="Andrea entrenando"
                        fill
                        className="object-cover object-[center_25%]"
                        sizes="(min-width: 1024px) 28rem, (min-width: 768px) 24rem, 80vw"
                        quality={Q.hero}
                        priority
                        draggable={false}
                      />
                    </div>
                    <p className="absolute inset-x-0 bottom-4 text-center font-serif text-[17px] italic tracking-wide text-foreground/70 sm:bottom-6 sm:text-[19px] md:bottom-8 md:text-[22px]">
                      volver a ti
                    </p>
                  </div>
                </motion.div>
                {SHOW_PLACEHOLDER_CONTENT ? (
                  <SistemaHeroSideImageSet
                    title="Después"
                    placeholders={SISTEMA_HERO_RIGHT_PLACEHOLDERS}
                    align="right"
                    skippedInitialAnimation={skippedInitialAnimation}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {swapThatSystemHero ? (
          <div
            className="pointer-events-none absolute inset-0 z-[20] overflow-visible select-none"
            aria-hidden
          >
            <div className="relative h-full w-full">
              {sistemaScatterItems.map((item, i) => (
                  <StickerFloat
                    key={`sistema-scatter-${i}-${item.src}-${item.left}`}
                    item={item}
                    i={i}
                    enterDelay={sistemaStickerEnterDelay(item.left, item.top, i, sistemaScatterItems.length)}
                    basePxOverride={
                      item.src === HERO_CAT_STICKER_SRC
                        ? Math.round(HERO_CAT_STICKER_PX * SISTEMA_STICKER_SCALE * SISTEMA_STICKER_RENDER_SCALE)
                        : Math.round(SISTEMA_STICKER_PX * SISTEMA_STICKER_RENDER_SCALE)
                    }
                    scale={viewportSize.w < 640 ? 0.86 : 1}
                  />
                ))}
            </div>
          </div>
        ) : null}
      </motion.div>

    </section>
  );
}
