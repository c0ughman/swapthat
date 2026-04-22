"use client";

import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { FiveStars } from "@/components/FiveStars";

// Pixel values scaled ×0.8 to compensate for font-size:80% replacing zoom:0.8
const CIRCLE_RADIUS = 288; // was 360
const PHIL_IMGS = [
  { collageX: 96,  collageY: -94,  baseAngle: -90,  w: 148, h: 196, src: "/philosophy/1.webp" },
  { collageX: 247, collageY: -86,  baseAngle: -18,  w: 126, h: 164, src: "/philosophy/2.webp" },
  { collageX: 139, collageY: 30,   baseAngle: 54,   w: 170, h: 134, src: "/philosophy/3.webp" },
  { collageX: 258, collageY: 108,  baseAngle: 126,  w: 116, h: 152, src: "/philosophy/4.webp" },
  { collageX: 62,  collageY: 98,   baseAngle: 198,  w: 134, h: 174, src: "/philosophy/5.webp" },
];

function philX(p: number, i: number, timeRotDeg = 0): number {
  const { collageX, baseAngle } = PHIL_IMGS[i];
  const t = Math.min(1, Math.max(0, p / 0.25));
  const rot = Math.min(1, Math.max(0, (p - 0.15) / 0.85)) * -90 + timeRotDeg;
  const angle = ((baseAngle + rot) * Math.PI) / 180;
  return collageX + (CIRCLE_RADIUS * Math.cos(angle) - collageX) * t;
}

function philY(p: number, i: number, timeRotDeg = 0): number {
  const { collageY, baseAngle } = PHIL_IMGS[i];
  const t = Math.min(1, Math.max(0, p / 0.25));
  const rot = Math.min(1, Math.max(0, (p - 0.15) / 0.85)) * -90 + timeRotDeg;
  const angle = ((baseAngle + rot) * Math.PI) / 180;
  return collageY + (CIRCLE_RADIUS * Math.sin(angle) - collageY) * t;
}

const PHIL_ROTATION_SPEED = -15;

/** Filosofía subtitle corner — compact row (was 96; −20px). */
const PHIL_SUBTITLE_STICKER_PX = 76;

/** Horizontal strip + container shifts (`-translate-x`, `translate-y`) so it clears the paragraph. */
const PHILOSOPHY_CORNER_STICKERS: { src: string; className: string }[] = [
  { src: "/stickers/st-1aec-2.webp", className: "left-0 bottom-0 z-[3] -rotate-[3deg]" },
  { src: "/stickers/playful-smiley.webp", className: "left-[2.65rem] bottom-0 z-[2] rotate-[2deg] sm:left-[2.75rem]" },
  { src: "/stickers/ripe-apple.webp", className: "left-[5.3rem] bottom-0 z-[1] -rotate-[2deg] sm:left-[5.5rem]" },
];

type TeamsPhilosophyOrbitSectionProps = {
  /** `/sistema`: black / white typography instead of blue gradient. */
  sistemaVariant?: boolean;
};

/** Filosofía + scroll/auto-rotating image orbit (also used on home). */
export function TeamsPhilosophyOrbitSection({ sistemaVariant = false }: TeamsPhilosophyOrbitSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const timeRot = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      timeRot.set(timeRot.get() + PHIL_ROTATION_SPEED * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, timeRot]);

  const px0 = useTransform([smoothProgress, timeRot], ([p, tr]) => philX(p as number, 0, tr as number));
  const py0 = useTransform([smoothProgress, timeRot], ([p, tr]) => philY(p as number, 0, tr as number));
  const px1 = useTransform([smoothProgress, timeRot], ([p, tr]) => philX(p as number, 1, tr as number));
  const py1 = useTransform([smoothProgress, timeRot], ([p, tr]) => philY(p as number, 1, tr as number));
  const px2 = useTransform([smoothProgress, timeRot], ([p, tr]) => philX(p as number, 2, tr as number));
  const py2 = useTransform([smoothProgress, timeRot], ([p, tr]) => philY(p as number, 2, tr as number));
  const px3 = useTransform([smoothProgress, timeRot], ([p, tr]) => philX(p as number, 3, tr as number));
  const py3 = useTransform([smoothProgress, timeRot], ([p, tr]) => philY(p as number, 3, tr as number));
  const px4 = useTransform([smoothProgress, timeRot], ([p, tr]) => philX(p as number, 4, tr as number));
  const py4 = useTransform([smoothProgress, timeRot], ([p, tr]) => philY(p as number, 4, tr as number));

  const pxValues = [px0, px1, px2, px3, px4];
  const pyValues = [py0, py1, py2, py3, py4];

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="flex min-h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative z-20 p-8">
            <span
              className={`mb-2 block text-sm font-semibold uppercase tracking-[0.2em] ${
                sistemaVariant ? "text-foreground" : "text-blue"
              }`}
            >
              Filosofía
            </span>
            <FiveStars variant="section" className="-translate-x-[3px]" />
            <h2 className="mb-8 text-4xl font-bold leading-[1] tracking-tight md:text-5xl lg:text-6xl">
              Menos exigencia. <span className="italic font-light">Más estructura</span>{" "}
              <span className={sistemaVariant ? "italic font-light" : "gradient-text-blue"}>consciente.</span>
            </h2>
            <div className="relative">
              <p className="relative z-10 max-w-2xl pb-28 pl-0 pr-2 text-lg leading-relaxed text-gray sm:pb-32 sm:pr-4 md:text-xl">
                Swap That for Teams es la misma filosofía en formato{" "}
                <strong className="font-semibold text-foreground/90">charlas y talleres</strong> para empresas: hábitos y
                herramientas prácticas—movimiento como regulación, manejo del estrés, foco y energía—para equipos con
                jornadas exigentes que buscan <strong className="font-semibold text-foreground/90">algo real</strong>, no
                otro beneficio más en la lista.
              </p>
              <div
                className="pointer-events-none absolute bottom-0 left-0 w-[14.5rem] max-w-[calc(100%+2rem)] overflow-visible -translate-x-[80px] translate-y-[-10px] sm:w-[15rem] sm:translate-y-[-2px]"
                aria-hidden
              >
                {PHILOSOPHY_CORNER_STICKERS.map((s, i) => (
                  <div
                    key={s.src}
                    className={`absolute drop-shadow-[0_3px_10px_rgba(0,0,0,0.12)] ${s.className} ${
                      i === 0 ? "-translate-y-[20px]" : ""
                    }`}
                    style={{ width: PHIL_SUBTITLE_STICKER_PX, height: PHIL_SUBTITLE_STICKER_PX }}
                  >
                    <Image
                      src={s.src}
                      alt=""
                      width={PHIL_SUBTITLE_STICKER_PX}
                      height={PHIL_SUBTITLE_STICKER_PX}
                      className="h-full w-full object-contain"
                      quality={Q.section}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden h-screen lg:block">
            <div
              className="pointer-events-none absolute left-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0 text-center"
              style={{ top: "calc(50% - 70px)" }}
            >
              <div className="translate-x-[30px] translate-y-[50px]">
                <div className="h-auto w-[176px] shrink-0 leading-none md:w-[218px]">
                  <Image
                    src="/logo-stacked-blue.webp"
                    alt="Swap That"
                    width={272}
                    height={272}
                    className="h-auto w-full object-contain"
                    quality={Q.brand}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            {PHIL_IMGS.map((img, i) => (
              <motion.div
                key={i}
                style={{
                  x: pxValues[i],
                  y: pyValues[i],
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: -img.w / 2,
                  marginTop: -img.h / 2,
                  width: img.w,
                  height: img.h,
                  zIndex: 5,
                }}
                className="overflow-hidden rounded-2xl shadow-lg"
              >
                <Image
                  src={img.src}
                  alt=""
                  width={img.w}
                  height={img.h}
                  className="h-full w-full object-cover"
                  sizes={`${img.w}px`}
                  quality={Q.photo}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
