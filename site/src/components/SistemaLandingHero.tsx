"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StarBurst } from "@/components/DecorativeSVGs";
import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { useTransitionArrival } from "./CarouselTransition/useTransitionArrival";

type HeroSlide = { src: string; flip?: boolean };

/** Shuffled: start on 2, original 3 last (mirrored). */
const SISTEMA_HERO_SLIDES: HeroSlide[] = [
  { src: "/philosophy/2.webp" },
  { src: "/philosophy/1.webp" },
  { src: "/philosophy/5.webp" },
  { src: "/philosophy/4.webp" },
  { src: "/philosophy/3.webp", flip: true },
];

const HERO_SLIDE_INTERVAL_MS = 4500;

/**
 * One hero slide. When it becomes active it wipes in from the right edge over
 * whatever was showing; once active it sits fully revealed underneath the next
 * incoming wipe. Re-mounts its wipe layer on each activation (via `revealKey`)
 * so the clip animation replays every cycle.
 */
function SlideLayer({
  slide,
  active,
  priority,
  cycle,
}: {
  slide: HeroSlide;
  active: boolean;
  priority: boolean;
  /** Parent's slide index — changes every cycle so the active wipe replays. */
  cycle: number;
}) {
  const img = (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={active ? { scale: 1.08, x: slide.flip ? 10 : -10 } : { scale: 1.0, x: 0 }}
      transition={{ duration: HERO_SLIDE_INTERVAL_MS / 1000 + 1, ease: "linear" }}
    >
      <Image
        src={slide.src}
        alt=""
        fill
        className={`object-cover object-[center_35%] ${slide.flip ? "-scale-x-100" : ""}`}
        sizes="(max-width: 768px) 100vw, 1280px"
        quality={Q.hero}
        priority={priority}
      />
    </motion.div>
  );

  return (
    <motion.div
      key={active ? `active-${cycle}` : "idle"}
      className="absolute inset-0"
      style={{ zIndex: active ? 2 : 1 }}
      initial={active ? { clipPath: "inset(0 0 0 100%)" } : false}
      animate={{ clipPath: "inset(0 0 0 0%)" }}
      transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
      aria-hidden={!active}
    >
      {img}
    </motion.div>
  );
}

/** Home (`/`) hero: equipos first; image carousel in the main panel, CTAs hacia contacto y Sistema. */
export function SistemaLandingHero() {
  const primaryHref = "/contacto/equipos";
  const secondaryHref = "/sistema";
  const { skippedInitialAnimation } = useTransitionArrival();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setSlideIndex((i) => (i + 1) % SISTEMA_HERO_SLIDES.length),
      HERO_SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex h-screen flex-col overflow-hidden bg-blue pt-[calc(5rem+10px)] pb-[clamp(5.5rem,24vw,8rem)] md:pb-8 lg:pb-10">
      <div className="pointer-events-none absolute top-1/4 right-0 hidden h-2/3 w-1/3 rounded-l-[6rem] bg-white/[0.07] lg:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-64 rounded-tr-[4rem] bg-blue-dark/35 md:h-56 md:w-80" />

      <motion.div
        initial={skippedInitialAnimation ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative mx-5 flex-1 overflow-hidden rounded-[2.5rem] border border-white/25 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.28)] md:mx-8 md:rounded-[3rem] lg:mx-10"
      >
        {/* Cycling background — same photos as before, full-bleed in the panel */}
        <div className="absolute inset-0 bg-neutral-800" aria-hidden>
          {SISTEMA_HERO_SLIDES.map((slide, i) => {
            const active = i === slideIndex;
            return (
              <SlideLayer
                key={slide.src}
                slide={slide}
                active={active}
                priority={i === 0}
                cycle={slideIndex}
              />
            );
          })}
          {/* 20px strip — fills the gap left of the shifted gradient only */}
          <div className="absolute inset-y-0 left-0 w-[25px] bg-white" aria-hidden />
          {/* Two plateaus, tilted 25° up, shifted 20px right via background-position */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(65deg, #ffffff 0%, #ffffff 18%, rgba(255, 255, 255, 0) calc(56% - 10px))",
              backgroundSize: "120% 120%",
              backgroundPosition: "20px center",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
          {/* Vignette — darkens corners subtly so the image reads richer, more cinematic */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 70% 35%, transparent 55%, rgba(0,0,0,0.16) 100%)",
            }}
            aria-hidden
          />
          {/* Fine film grain — kills the flat/digital look, reads as premium print texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "160px 160px",
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex h-full min-h-[min(100%,28rem)] items-center px-6 py-8 sm:px-8 md:min-h-0 md:px-14 lg:px-16">
          <div className="w-full max-w-2xl text-foreground">
            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-0.5 w-8 bg-blue" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue">
                Para equipos corporativos
              </span>
            </motion.div>

            <motion.h1
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-5 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
            >
              Swap that
              <br />
              <span className="italic font-light text-blue">for Teams</span>
            </motion.h1>

            <motion.div
              initial={skippedInitialAnimation ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-6 h-0.5 w-48 origin-left bg-gradient-to-r from-blue/50 to-coral/40"
            />

            <motion.p
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-2 text-base leading-relaxed text-foreground/88 md:text-lg"
            >
              Hábitos saludables para equipos corporativos.
            </motion.p>
            <motion.p
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-8 text-sm leading-relaxed text-foreground/70 md:text-base"
            >
              Charlas, workshops y sesiones de bienestar que se quedan. Menos exigencia, más estructura consciente.
            </motion.p>

            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex w-full min-w-0 flex-col gap-3 md:gap-4 lg:flex-row lg:flex-nowrap lg:items-stretch"
            >
              <Link
                href={primaryHref}
                className="group inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-blue px-5 py-3.5 text-center text-[clamp(0.78rem,2.6vw,0.9rem)] font-bold leading-tight text-white shadow-lg shadow-blue/25 transition-all duration-300 hover:bg-blue-dark md:px-7 md:text-sm lg:w-auto xl:px-8"
              >
                Quiero una charla para mi equipo
                <svg
                  width="16"
                  height="16"
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
                href={secondaryHref}
                className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-foreground/18 bg-white/80 px-6 py-3.5 text-center text-sm font-bold leading-tight text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-white/95 md:px-7 lg:w-auto lg:whitespace-nowrap xl:px-8"
              >
                Coaching 1-on-1
              </Link>
            </motion.div>

            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {["Bienestar real", "Sin culpa", "Equipos que rinden más"].map((pill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full bg-blue px-4 py-2.5 text-xs font-medium text-white shadow-sm shadow-blue/25"
                >
                  <StarBurst size={10} color="white" />
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Link
        href="/contacto/marketing#formulario"
        className="group absolute top-[120px] right-[20px] z-[40] hidden origin-top-right lg:block"
        style={{ transform: "scale(0.88)" }}
      >
        <motion.div
          initial={skippedInitialAnimation ? false : { opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          whileHover={{ scale: 1.03, y: -3 }}
          className="relative flex h-[208px] w-[272px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl bg-coral p-6 shadow-2xl shadow-black/25"
        >
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Para marcas
            </span>
            <h3 className="mt-1.5 text-xl font-bold leading-tight text-white">
              Marketing &<br />
              Performance
            </h3>
          </div>
          <div>
            <p className="mb-3 text-xs leading-relaxed text-white/60">
              Estrategia, contenido y Meta Ads para crecer con orden y resultados reales.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-3">
              Explorar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="pointer-events-none absolute bottom-[-20px] right-[-20px] opacity-20"
            aria-hidden
          >
            <circle cx="60" cy="60" r="55" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="42" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="29" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="16" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="5" fill="white" />
          </svg>
        </motion.div>
      </Link>
    </section>
  );
}
