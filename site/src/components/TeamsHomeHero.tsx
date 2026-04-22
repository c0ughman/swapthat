"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { StarBurst } from "@/components/DecorativeSVGs";
import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { cartoon3dPath } from "@/lib/cartoonAssets";

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
/** Eyebrow, subcopy, CTAs, pills — above sticker layer. */
const HERO_RAISED_COPY_Z = 30;

/** Light halo so text reads on top of busy sticker art. */
const HERO_TEXT_GLOW =
  "[text-shadow:0_1px_2px_rgba(255,255,255,0.97),0_2px_12px_rgba(255,255,255,0.82),0_0_26px_rgba(255,255,255,0.58)]";
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

type ScatterItem = { src: string; left: string; top: string; wave?: boolean };

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

type CornerQuadrant = "tl" | "tr" | "bl" | "br";

/**
 * Stickers sit on the two perpendicular rays from the corner (L-shape): one along the horizontal edge,
 * one along the vertical — not filled toward a center.
 */
/** `stepH` / `stepV` are % of viewport width / height so gaps match ~uniformly in px when derived from one pixel step. */
function cornerLShapePoints(
  count: number,
  quadrant: CornerQuadrant,
  corner: { l: number; t: number },
  stepH: number,
  stepV: number
): { left: number; top: number }[] {
  if (count <= 0) return [];
  const nh = Math.ceil(count / 2);
  const nv = count - nh;
  const pts: { left: number; top: number }[] = [];

  for (let i = 0; i < nh; i++) {
    const d = i * stepH;
    if (quadrant === "tl") pts.push({ left: corner.l + d, top: corner.t });
    else if (quadrant === "tr") pts.push({ left: corner.l - d, top: corner.t });
    else if (quadrant === "bl") pts.push({ left: corner.l + d, top: corner.t });
    else pts.push({ left: corner.l - d, top: corner.t });
  }
  for (let j = 1; j <= nv; j++) {
    const d = j * stepV;
    if (quadrant === "tl") pts.push({ left: corner.l, top: corner.t + d });
    else if (quadrant === "tr") pts.push({ left: corner.l, top: corner.t + d });
    else if (quadrant === "bl") pts.push({ left: corner.l, top: corner.t - d });
    else pts.push({ left: corner.l, top: corner.t - d });
  }
  return pts;
}

/** `/sistema` hero: each sticker once; four L-shapes along corner edges (no sine line, no triangle fill). */
function buildSistemaCornerStickerItems(viewportW: number, viewportH: number): ScatterItem[] {
  const list = [...HERO_STICKER_SRCS];
  const n = list.length;
  if (n === 0) return [];

  const w = Math.max(320, viewportW);
  const h = Math.max(480, viewportH);
  /** Same nominal gap in px on both arms; % steps differ so spacing stays visually even (~≤10% variance vs ideal). */
  const gapPx = 46;
  const stepH = (gapPx / w) * 100;
  const stepV = (gapPx / h) * 100;

  const corners = {
    tl: { l: 5.4, t: 6.2 },
    tr: { l: 94.6, t: 6.2 },
    bl: { l: 5.4, t: 85.8 },
    br: { l: 94.6, t: 85.8 },
  } as const;

  const base = Math.floor(n / 4);
  const rem = n % 4;
  const planned: { quadrant: CornerQuadrant; count: number }[] = [
    { quadrant: "tl", count: base + (rem > 0 ? 1 : 0) },
    { quadrant: "tr", count: base + (rem > 1 ? 1 : 0) },
    { quadrant: "bl", count: base + (rem > 2 ? 1 : 0) },
    { quadrant: "br", count: base + (rem > 3 ? 1 : 0) },
  ];

  const positions: { left: string; top: string }[] = [];
  for (const { quadrant, count } of planned) {
    if (count <= 0) continue;
    const c = corners[quadrant];
    const pts = cornerLShapePoints(count, quadrant, c, stepH, stepV);
    for (const p of pts) {
      positions.push({
        left: `${Math.min(99, Math.max(1, p.left)).toFixed(1)}%`,
        top: `${Math.min(97, Math.max(3, p.top)).toFixed(1)}%`,
      });
    }
  }

  return list.map((src, i) => ({
    src,
    left: positions[i]?.left ?? "50%",
    top: positions[i]?.top ?? "50%",
    wave: false,
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

function StickerFloat({ item, i, scale = 1 }: { item: ScatterItem; i: number; scale?: number }) {
  const basePx = item.src === HERO_CAT_STICKER_SRC ? HERO_CAT_STICKER_PX : HERO_STICKER_PX;
  const px = Math.round(basePx * scale);
  const { ox, oy } = item.wave ? { ox: 0, oy: 0 } : stickerOutwardOffset(item.left, item.top);
  return (
    <div
      className="absolute"
      style={{
        left: item.left,
        top: item.top,
        transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
      }}
    >
      <motion.div
        className="flex shrink-0 items-center justify-center"
        style={{ width: px, height: px, opacity: 1 }}
        initial={{ opacity: 0, scale: 0.58, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 13,
          mass: 0.72,
          bounce: 0.38,
          delay: i * 0.045,
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
          quality={Q.section}
          loading="eager"
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
  const sistemaCornerStickerItems = useMemo(
    () => buildSistemaCornerStickerItems(viewportSize.w, viewportSize.h),
    [viewportSize.w, viewportSize.h]
  );

  const heroTextAlign = swapThatSystemHero ? "max-lg:text-center lg:text-left" : "text-center";
  const heroItemsMain = swapThatSystemHero ? "max-lg:items-center lg:items-start" : "items-center";
  const heroJustify = swapThatSystemHero ? "max-lg:justify-center lg:justify-start" : "justify-center";
  /** One shared inset so eyebrow, headline, and body share the same left edge. */
  const sistemaCopyGutterClass =
    "px-5 sm:px-8 lg:pl-[100px] lg:pr-6";

  const headlineFontSize = swapThatSystemHero
    ? "clamp(3.4rem, 8.8vw, 6.9rem)"
    : "clamp(2.8rem, 7.1vw, 5.65rem)";
  /** Sistema: larger type on small screens; desktop keeps `headlineFontSize` via md: */
  const sistemaHeadlineSizeClass =
    "text-[clamp(2.2rem,9vw,3.2rem)] sm:text-[clamp(2.8rem,9.5vw,3.9rem)] md:text-[clamp(3.4rem,8.8vw,6.9rem)]";

  const eyebrowLineClass = swapThatSystemHero ? "bg-black" : "bg-blue";
  const eyebrowLabelClass = swapThatSystemHero ? "text-black" : "text-blue";
  const paraAccentClass = swapThatSystemHero ? "italic font-light text-black" : "italic font-light text-blue";
  const subDividerClass = swapThatSystemHero
    ? "h-0.5 w-[9rem] max-lg:mx-auto max-lg:origin-center lg:origin-left shrink-0 bg-gradient-to-r from-black/35 to-black/15"
    : "h-0.5 w-[9rem] shrink-0 bg-gradient-to-r from-blue/45 to-coral/35";
  const primaryCtaClass = swapThatSystemHero
    ? `group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-[0.75rem] font-bold text-white shadow-md shadow-black/18 ${HERO_BTN_HALO} transition-all duration-300 hover:bg-neutral-900 sm:w-auto sm:px-6 sm:py-3 sm:text-[0.8125rem]`
    : `group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-blue px-5 py-2.5 text-[0.75rem] font-bold text-white shadow-md shadow-blue/22 ${HERO_BTN_HALO} transition-all duration-300 hover:bg-blue-dark sm:w-auto sm:px-6 sm:py-3 sm:text-[0.8125rem]`;
  const secondaryCtaClass = swapThatSystemHero
    ? `inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-black/25 bg-white/80 px-5 py-2.5 text-[0.75rem] font-bold text-black ${HERO_BODY_GLOW} ${HERO_BTN_HALO} backdrop-blur-[2px] transition-all duration-300 hover:bg-black/[0.06] sm:w-auto sm:px-6 sm:py-3 sm:text-[0.8125rem]`
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
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: swapThatSystemHero ? 20 : 40 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        className={`relative pb-0 font-bold tracking-tight text-foreground ${heroTextAlign} ${HERO_TEXT_GLOW} ${
          swapThatSystemHero ? `leading-[0.88] ${sistemaHeadlineSizeClass}` : ""
        }`}
        style={swapThatSystemHero ? undefined : { fontSize: headlineFontSize }}
      >
        Entrena
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -10, y: -12 }}
        animate={{ opacity: 0, scale: 1, rotate: -10, y: 28 }}
        transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
        className={
          swapThatSystemHero
            ? "relative z-20 shrink-0 overflow-hidden shadow-none ring-0 pointer-events-none self-start"
            : "relative z-20 shrink-0 overflow-hidden shadow-none ring-0 pointer-events-none self-center"
        }
        style={{
          width: 121,
          height: 85,
          marginTop: swapThatSystemHero ? "-2.15rem" : "-1.7rem",
          marginBottom: swapThatSystemHero ? "-2.15rem" : "-1.7rem",
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
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: swapThatSystemHero ? -8 : -16 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className={`relative pt-0 font-bold tracking-tight text-foreground ${heroTextAlign} ${HERO_TEXT_GLOW} ${
          swapThatSystemHero
            ? `${sistemaHeadlineSizeClass} max-md:-mb-2 leading-[0.78]`
            : "leading-[0.95]"
        }`}
        style={swapThatSystemHero ? undefined : { fontSize: headlineFontSize }}
      >
        <span className={paraAccentClass} style={{ fontSize: "1.08em" }}>
          para volver
        </span>
        <br />
        a ti.
      </motion.h1>
    </>
  );

  return (
    <section
      className={
        swapThatSystemHero
          ? "relative flex h-screen min-w-0 flex-col overflow-x-clip overflow-y-visible bg-foreground pt-[calc(3.5rem+20px)] pb-2 sm:pb-4 md:pb-8 lg:pb-10"
          : "relative flex h-screen min-w-0 flex-col overflow-hidden bg-foreground pt-[calc(3.5rem+10px)] pb-5 md:pb-8 lg:pb-10"
      }
    >
      <div
        className={
          swapThatSystemHero
            ? "pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-black/[0.08] blur-3xl"
            : "pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-blue/15 blur-3xl"
        }
      />
      <div
        className={
          swapThatSystemHero
            ? "pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/[0.06] blur-3xl"
            : "pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-coral/10 blur-3xl"
        }
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        className={`relative z-[2] mx-5 mt-0 flex min-h-0 min-w-0 flex-1 flex-col rounded-[2.5rem] border border-beige-dark/55 bg-white shadow-[0_14px_44px_-12px_rgba(26,26,26,0.11)] md:mx-8 md:rounded-[3rem] lg:mx-10 ${
          swapThatSystemHero
            ? "max-md:mb-[50px] overflow-visible pt-10 md:pt-11"
            : "overflow-hidden pt-8"
        }`}
      >
        <div
          className={
            swapThatSystemHero
              ? "pointer-events-none absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-black/[0.07] blur-3xl"
              : "pointer-events-none absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-blue/[0.14] blur-3xl"
          }
        />
        <div
          className={
            swapThatSystemHero
              ? "pointer-events-none absolute -bottom-20 -left-20 z-0 h-72 w-72 rounded-full bg-black/[0.05] blur-3xl"
              : "pointer-events-none absolute -bottom-20 -left-20 z-0 h-72 w-72 rounded-full bg-coral/[0.12] blur-3xl"
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
              ? "flex min-h-0 min-w-0 flex-1 translate-y-[50px] flex-col gap-0 lg:min-h-0 lg:flex-row lg:items-center"
              : "translate-y-[50px]"
          }
        >
          <div
            className={
            swapThatSystemHero
              ? `relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col justify-center max-lg:text-center lg:text-left -translate-y-[50px] lg:translate-x-[50px] ${sistemaCopyGutterClass}`
              : "contents"
            }
          >
        <div
          className={`relative flex shrink-0 overflow-visible ${
            swapThatSystemHero ? "max-lg:items-center max-lg:justify-center lg:items-start lg:justify-start px-0" : "justify-center px-6 md:px-10"
          } ${swapThatSystemHero ? "" : "pt-8"}`}
          style={{
            transform: swapThatSystemHero ? "translateY(-22px)" : "translateY(-35px)",
            zIndex: HERO_RAISED_COPY_Z,
          }}
        >
          <div
            className={`flex w-full max-w-4xl flex-col ${heroItemsMain} ${heroTextAlign} ${
              swapThatSystemHero ? "lg:max-w-[min(100%,32rem)] xl:max-w-[36rem]" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`mb-0.5 flex items-center gap-2 ${heroJustify} ${
                swapThatSystemHero ? "lg:-translate-x-[10px]" : ""
              }`}
            >
              <span className={`h-0.5 w-7 shrink-0 ${eyebrowLineClass}`} />
              <span
                className={`text-[0.8125rem] font-semibold uppercase tracking-[0.2em] ${eyebrowLabelClass} ${HERO_TEXT_GLOW}`}
              >
                Swap That System
              </span>
            </motion.div>
          </div>
        </div>

        <div
          className={`relative flex shrink-0 overflow-visible ${
            swapThatSystemHero ? "max-lg:items-center max-lg:justify-center lg:items-start lg:justify-start px-0" : "justify-center px-4 sm:px-6 md:px-10"
          }`}
          style={{
            transform: swapThatSystemHero ? "translateY(-22px)" : "translateY(-35px)",
            zIndex: HERO_TITLE_Z,
          }}
        >
          <div
            className={`flex w-full max-w-4xl flex-col ${heroItemsMain} ${heroTextAlign} ${
              swapThatSystemHero ? "lg:max-w-[min(100%,32rem)] xl:max-w-[36rem]" : ""
            }`}
          >
            {swapThatSystemHero ? (
              <div className="relative z-10 w-full">
                <div
                  className={`flex w-full flex-col ${heroItemsMain} ${heroJustify} leading-[0.85]`}
                  style={{ transform: "translateY(-24px) scale(0.918)" }}
                >
                  {headlineInner}
                </div>
              </div>
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
              ? "items-start justify-start px-0 pt-3 pb-4 md:pb-5"
              : "items-center px-6 py-3 pb-4 md:px-10 md:pb-5"
          }`}
          style={{
            transform: swapThatSystemHero ? "translateY(-22px)" : "translateY(-35px)",
            zIndex: HERO_RAISED_COPY_Z,
          }}
        >
          <div
            className={
              swapThatSystemHero
                ? "flex w-full max-w-4xl flex-col max-lg:items-center max-lg:text-center lg:items-start lg:text-left lg:max-w-[min(100%,32rem)] xl:max-w-[36rem]"
                : "flex w-full max-w-4xl flex-col items-center text-center"
            }
            >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className={
                swapThatSystemHero
                  ? "relative mt-[clamp(-2.75rem,-7.5vw,-1.35rem)] flex w-full flex-col max-lg:items-center lg:items-start gap-1.5"
                  : "relative mt-[clamp(-2rem,-5.5vw,-0.75rem)] flex w-full flex-col items-center gap-2.5"
              }
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
                className={subDividerClass}
              />

              <div
                className={`max-w-md space-y-1.5 ${swapThatSystemHero ? "max-lg:text-center lg:text-left" : "text-center"}`}
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className={`text-[0.8125rem] leading-snug text-foreground/88 md:text-[0.875rem] ${HERO_BODY_GLOW}`}
                >
                  Incluso cuando tu vida no está ordenada.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className={`text-[0.75rem] leading-snug text-foreground/72 md:text-[0.8125rem] ${HERO_BODY_GLOW}`}
                >
                  Un sistema de entrenamiento, hábitos y mindset para mujeres activas que quieren entrenar a su
                  ritmo.
                </motion.p>
              </div>
            </motion.div>

            <div
              className={`relative flex w-full flex-col pb-0 ${
                swapThatSystemHero
                  ? "mt-4 items-stretch self-stretch"
                  : "mt-5 items-center self-center"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className={
                  swapThatSystemHero
                    ? "flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center lg:justify-start"
                    : "flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
                }
              >
                <Link href={contactHref} className={primaryCtaClass}>
                  Quiero entrenar a mi ritmo
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                {secondaryHref ? (
                  <Link href={secondaryHref} className={secondaryCtaClass}>
                    Quiero sentirme bien
                  </Link>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className={`mt-4 flex w-full flex-wrap gap-1.5 ${
                  swapThatSystemHero ? "max-lg:justify-center lg:justify-start" : "justify-center"
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
              className="relative z-40 -mx-1 flex w-full min-h-[min(24vh,160px)] shrink-0 items-center justify-center overflow-visible pr-0 sm:min-h-[min(34vh,280px)] sm:pr-0 lg:mx-0 lg:min-h-0 lg:min-w-0 lg:w-[min(58%,min(100vw,720px))] lg:max-w-[min(58vw,780px)] lg:flex-1 lg:justify-end lg:overflow-visible lg:pr-0"
              aria-hidden
            >
              <div className="flex h-full w-full max-w-[min(100%,780px)] items-center justify-end px-0 sm:px-0 lg:min-h-0 lg:pl-0 lg:pr-0">
                <Image
                  src={cartoon3dPath("jump.png")}
                  alt=""
                  width={1350}
                  height={1350}
                  className="h-[min(46vh,320px)] w-auto max-w-[min(100%,870px)] scale-[1.05] object-contain object-bottom object-right origin-bottom-right drop-shadow-[0_20px_50px_rgba(0,0,0,0.14)] select-none will-change-transform sm:h-[min(62vh,520px)] md:h-[min(80vh,860px)] lg:-translate-x-[80px] lg:-translate-y-[50px] lg:h-[min(100vh,1290px)] lg:max-w-[min(100%,min(98vw,1100px))] xl:max-w-[min(100%,min(98vw,1150px))]"
                  quality={Q.hero}
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  draggable={false}
                />
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>

      {swapThatSystemHero ? (
        <div
          className="pointer-events-none absolute inset-0 z-[50] translate-y-[50px] overflow-visible select-none"
          aria-hidden
        >
          <div className="relative h-full w-full">
            {sistemaCornerStickerItems
              .filter((_, idx) => viewportSize.w < 640 ? idx % 5 < 2 : true)
              .map((item, i) => (
                <StickerFloat
                  key={`sistema-corner-${i}-${item.src}`}
                  item={item}
                  i={i}
                  scale={viewportSize.w < 640 ? 0.52 : 1}
                />
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
