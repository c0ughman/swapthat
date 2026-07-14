"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarBurst } from "@/components/DecorativeSVGs";
import { Q } from "@/lib/imageQuality";

const HERO_BG_IMAGES = [
  "/philosophy/1.webp",
  "/philosophy/2.webp",
  "/philosophy/3.webp",
  "/philosophy/4.webp",
  "/philosophy/5.webp",
] as const;
const HERO_BG_INTERVAL_MS = 4500;

const WHITE = "#fdfaf6";
const GRAY_WAVE = "#d5d0c6";

function WhiteTopWave() {
  return (
    <svg
      className="pointer-events-none absolute left-0 right-0 top-0 h-[4.5rem] w-full -translate-y-[calc(100%-1px)] sm:h-[5rem] md:h-[5.5rem]"
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,160 C220,40 520,200 760,120 C1000,40 1240,180 1440,80 L1440,220 L0,220 Z"
        fill={WHITE}
      />
    </svg>
  );
}

function GrayCornerWave({ side }: { side: "left" | "right" }) {
  const pos =
    side === "left"
      ? "left-0 -translate-x-[14%] -rotate-[12deg] origin-bottom-left"
      : "right-0 translate-x-[14%] rotate-[12deg] origin-bottom-right scale-x-[-1]";
  return (
    <div
      className={`absolute bottom-0 h-[clamp(7rem,28vw,13rem)] w-[clamp(15rem,55vw,28rem)] ${pos}`}
      aria-hidden
    >
      <svg
        className="h-full w-full drop-shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        viewBox="0 0 480 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,95 C70,35 150,120 230,70 C310,28 390,105 480,55 L480,200 Z"
          fill={GRAY_WAVE}
        />
      </svg>
    </div>
  );
}

export function TeamsAltHero() {
  const [slideIndex, setSlideIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const id = setInterval(
      () => setSlideIndex((i) => (i + 1) % HERO_BG_IMAGES.length),
      HERO_BG_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative grid h-[100dvh] min-h-[40rem] w-full grid-rows-[1fr_auto] overflow-x-hidden bg-white"
    >
      {/* Rotating background */}
      <div className="relative min-h-0 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            >
              <Image
                src={HERO_BG_IMAGES[slideIndex]!}
                alt=""
                fill
                className="object-cover object-[center_72%] md:object-[center_32%]"
                priority={slideIndex === 0}
                quality={Q.hero}
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-white/15 mix-blend-multiply" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/25 to-transparent" />
        </motion.div>
      </div>

      {/* White layer (back) + gray corners overlapping its base + blue strip (front) */}
      <div className="relative shrink-0 overflow-visible">
        <div className="relative z-[1] bg-[#fdfaf6]">
          <WhiteTopWave />
          <div className="relative mx-auto w-full max-w-[80rem] px-6 pb-10 pt-7 sm:px-8 sm:pb-11 sm:pt-8 md:px-10 md:pb-10 md:pt-9 lg:px-14">
          <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2 md:gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-1 w-12 rounded-full bg-amarillo" />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--amarillo)_58%,var(--chocolatito))]">
                  Para equipos corporativos
                </span>
              </div>
              <h1 className="text-[2.4rem] font-bold leading-[0.95] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                Muévete con Andrea
                <br />
                <span className="italic font-light text-blue">for Teams</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray font-medium md:mt-5 md:text-lg">
                Hábitos saludables para equipos corporativos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="md:pt-6 md:text-right"
            >
              <div className="mb-4 h-0.5 w-28 bg-gradient-to-r from-blue/50 to-coral/40 md:ml-auto" />
              <p className="mb-5 max-w-sm text-sm leading-relaxed text-foreground/70 md:mb-6 md:ml-auto md:text-lg">
                Charlas, workshops y sesiones de bienestar que se quedan. Menos exigencia, más
                estructura consciente.
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap md:justify-end">
                <Link
                  href="/contacto/equipos"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue/25 transition-colors hover:bg-blue-dark md:text-base"
                >
                  Quiero una charla para mi equipo
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/sistema"
                  className="inline-flex items-center justify-center rounded-full border-2 border-amarillo bg-white px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-amarillo/15 md:text-base"
                >
                  Coaching 1-on-1
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 md:mt-5 md:justify-end">
                {["Bienestar real", "Sin culpa", "Equipos que rinden más"].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3.5 py-1.5 text-[0.72rem] font-medium text-foreground shadow-sm"
                  >
                    <StarBurst size={10} color="currentColor" />
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
          </div>
        </div>

        {/* Gray — above white, behind blue; large rotated corner waves */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-2.5 z-[2] h-0 overflow-visible"
          aria-hidden
        >
          <GrayCornerWave side="left" />
          <GrayCornerWave side="right" />
        </div>

        {/* Blue — ~10px, in front of gray */}
        <div className="relative z-[3] h-2.5 shrink-0 overflow-visible bg-blue">
          <svg
            className="absolute inset-x-0 bottom-full h-3 w-full"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
          >
            <path
              d="M0,38 C240,8 480,32 720,18 C960,4 1200,28 1440,12 L1440,48 L0,48 Z"
              fill="var(--blue)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
