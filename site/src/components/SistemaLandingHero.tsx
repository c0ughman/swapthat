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
 * One hero slide. Simple cross-fade between slides (opacity only), with a slow
 * Ken Burns drift on the active image underneath.
 */
function SlideLayer({
  slide,
  active,
  priority,
  objectPosition,
}: {
  slide: HeroSlide;
  active: boolean;
  priority: boolean;
  objectPosition: string;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: active ? 2 : 1 }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      aria-hidden={!active}
    >
      {/* Ken Burns: active slide drifts/zooms slowly for a living, premium feel */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={active ? { scale: 1.08, x: slide.flip ? 10 : -10 } : { scale: 1.0, x: 0 }}
        transition={{ duration: HERO_SLIDE_INTERVAL_MS / 1000 + 1, ease: "linear" }}
      >
        {/* Mobile: the panel is narrower than these portrait photos, so object-cover
            already shows the full image height — vertical object-position alone does
            nothing. This wrapper scales the image up from its bottom edge so the
            lower-middle of the subject fills the frame and the top is pushed out. */}
        <div className="absolute inset-0 origin-bottom scale-[1.45] md:scale-100 md:origin-center">
          <Image
            src={slide.src}
            alt=""
            fill
            className={`object-cover ${slide.flip ? "-scale-x-100" : ""}`}
            style={{ objectPosition }}
            sizes="(max-width: 768px) 100vw, 1280px"
            quality={Q.hero}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            loading={priority ? "eager" : undefined}
            // First slide is the LCP image: serve the raw .webp (already small) so
            // there's no image-optimizer round-trip — the priority preload then
            // points straight at the file and it lands as fast as the page.
            unoptimized={priority}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Home (`/`) hero: equipos first; image carousel in the main panel, CTAs hacia contacto y Sistema. */
export function SistemaLandingHero() {
  const primaryHref = "/contacto/equipos";
  const secondaryHref = "/sistema";
  const { skippedInitialAnimation } = useTransitionArrival();
  const [slideIndex, setSlideIndex] = useState(0);

  // Mobile crops these portrait photos into a tall panel — focus the lower-middle
  // of the frame (not dead center). Desktop keeps the upper-third framing.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const heroObjectPosition = isMobile ? "center 75%" : "center 35%";

  useEffect(() => {
    const id = setInterval(
      () => setSlideIndex((i) => (i + 1) % SISTEMA_HERO_SLIDES.length),
      HERO_SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex h-[calc(100vh+140px)] flex-col overflow-hidden bg-blue pt-[calc(5rem+10px)] pb-[clamp(5.5rem,24vw,8rem)] md:h-screen md:pb-8 lg:pb-10">
      <div className="pointer-events-none absolute top-1/4 right-0 hidden h-2/3 w-1/3 rounded-l-[6rem] bg-white/[0.07] lg:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-64 rounded-tr-[4rem] bg-blue-dark/35 md:h-56 md:w-80" />

      <motion.div
        initial={skippedInitialAnimation ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative mx-5 flex-1 overflow-hidden rounded-[2.5rem] border border-white/25 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.28)] md:mx-8 md:rounded-[3rem] lg:mx-10"
      >
        {/* Cycling background — same photos as before, full-bleed in the panel */}
        <div className="absolute inset-0 bg-chocolatito" aria-hidden>
          {SISTEMA_HERO_SLIDES.map((slide, i) => (
            <SlideLayer
              key={slide.src}
              slide={slide}
              active={i === slideIndex}
              priority={i === 0}
              objectPosition={heroObjectPosition}
            />
          ))}
          {/* 20px strip — fills the gap left of the shifted gradient only.
              z-[3] so it stays ABOVE the wiping slide layers (which use z 1–2). Desktop only. */}
          <div className="absolute inset-y-0 left-0 z-[3] hidden w-[25px] bg-chocolatito md:block" aria-hidden />
          {/* Desktop: two plateaus, tilted 25° up, shifted 20px right via background-position */}
          <div
            className="absolute inset-0 z-[3] hidden md:block"
            style={{
              background:
                "linear-gradient(65deg, var(--chocolatito) 0%, var(--chocolatito) 36%, color-mix(in srgb, var(--chocolatito) 0%, transparent) calc(58% - 10px))",
              backgroundSize: "120% 120%",
              backgroundPosition: "20px center",
            }}
            aria-hidden
          />
          {/* Mobile: strong bottom-up white gradient — image reads at the top (and
              faintly mid), lower portion fades to solid white where the copy sits. */}
          <div
            className="absolute inset-0 z-[3] md:hidden"
            style={{
              background:
                "linear-gradient(to top, var(--chocolatito) 0%, var(--chocolatito) 60%, color-mix(in srgb, var(--chocolatito) 88%, transparent) 72%, transparent 90%)",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-white/10 via-transparent to-transparent" />
          {/* Vignette — darkens corners subtly so the image reads richer, more cinematic */}
          <div
            className="pointer-events-none absolute inset-0 z-[3]"
            style={{
              background:
                "radial-gradient(120% 90% at 70% 35%, transparent 55%, rgba(0,0,0,0.16) 100%)",
            }}
            aria-hidden
          />
          {/* Fine film grain — kills the flat/digital look, reads as premium print texture */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "160px 160px",
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex h-full min-h-[min(100%,28rem)] items-end px-6 py-8 max-md:pb-6 sm:px-8 md:items-center md:min-h-0 md:px-14 lg:px-16">
          <div className="w-full max-w-2xl text-white">
            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-1 w-8 rounded-full bg-amarillo" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--amarillo)_58%,var(--chocolatito))]">
                Para equipos corporativos
              </span>
            </motion.div>

            <motion.h1
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-5 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
            >
              Muévete con Andrea
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
              className="mb-2 text-base leading-relaxed text-white/90 md:text-lg"
            >
              Hábitos saludables para equipos corporativos.
            </motion.p>
            <motion.p
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-8 text-sm leading-relaxed text-white/75 md:text-base"
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
                className="group inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-blue px-6 py-5 text-center text-[clamp(0.875rem,3.4vw,1rem)] font-bold leading-tight text-white shadow-lg shadow-blue/25 transition-all duration-300 hover:bg-blue-dark md:px-7 md:py-3.5 md:text-sm lg:w-auto xl:px-8"
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
                className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-foreground/18 bg-white/80 px-6 py-5 text-center text-[clamp(0.875rem,3.4vw,1rem)] font-bold leading-tight text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-white/95 md:py-3.5 md:text-sm md:px-7 lg:w-auto lg:whitespace-nowrap xl:px-8"
              >
                Coaching 1-on-1
              </Link>
            </motion.div>

            <motion.div
              initial={skippedInitialAnimation ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-8 hidden flex-wrap gap-3 md:flex"
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
