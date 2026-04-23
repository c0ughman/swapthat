"use client";

import { motion } from "framer-motion";
import { StarBurst } from "@/components/DecorativeSVGs";
import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { useTransitionArrival } from "./CarouselTransition/useTransitionArrival";

// Pixel dimensions scaled ×0.8 to match font-size: 80% base (replacing zoom: 0.8)
const SISTEMA_HERO_IMAGES = [
  { src: "/philosophy/1.webp", w: 213, h: 160, rotate: -8, left: "76%", top: "86%" },
  { src: "/philosophy/2.webp", w: 203, h: 153, rotate: 12, left: "65%", top: "68%" },
  { src: "/philosophy/3.webp", w: 222, h: 167, rotate: -5, left: "54%", top: "50%" },
  { src: "/philosophy/4.webp", w: 209, h: 156, rotate: 8, left: "43%", top: "32%" },
  { src: "/philosophy/5.webp", w: 218, h: 164, rotate: -3, left: "32%", top: "12%" },
];

/** Home (`/`) hero: equipos first; light squircle, collage, CTAs hacia contacto y Sistema. */
export function SistemaLandingHero() {
  const primaryHref = "/contacto/equipos";
  const secondaryHref = "/sistema";
  const { skippedInitialAnimation, arrivalAnimationReady } = useTransitionArrival();

  return (
    <section className="relative flex h-screen flex-col overflow-hidden bg-blue pt-[calc(5rem+10px)] pb-[clamp(5.5rem,24vw,8rem)] md:pb-8 lg:pb-10">
      <div className="pointer-events-none absolute top-1/4 right-0 hidden h-2/3 w-1/3 rounded-l-[6rem] bg-white/[0.07] lg:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-64 rounded-tr-[4rem] bg-blue-dark/35 md:h-56 md:w-80" />

      <motion.div
        initial={skippedInitialAnimation ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative mx-5 flex-1 overflow-hidden rounded-[2.5rem] border border-white/25 bg-white shadow-[0_28px_90px_-20px_rgba(0,0,0,0.28)] md:mx-8 md:rounded-[3rem] lg:mx-10"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue/[0.14] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-coral/[0.12] blur-2xl" />

        <div className="relative z-10 flex h-full items-center px-6 py-8 sm:px-8 md:px-14 lg:px-16">
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
                className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-blue px-6 py-3.5 text-left text-sm font-bold leading-tight text-white shadow-lg shadow-blue/25 transition-all duration-300 hover:bg-blue-dark sm:text-center md:px-7 lg:w-auto lg:whitespace-nowrap xl:px-8"
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
                className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-foreground/18 px-6 py-3.5 text-center text-sm font-bold leading-tight text-foreground transition-all duration-300 hover:bg-foreground/[0.06] md:px-7 lg:w-auto lg:whitespace-nowrap xl:px-8"
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

      {/* Mobile: photos on a deep semicircle arc (curve obvious, not a flat line) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-[clamp(8rem,36vw,12rem)] md:hidden">
        <div className="relative mx-auto h-full w-full max-w-[min(100%,28rem)] -translate-x-[10px]">
          {SISTEMA_HERO_IMAGES.map((img, i) => {
            // Bottom semicircle: θ ∈ [π, 2π] — large radius + deep sag reads as an arc
            const t = SISTEMA_HERO_IMAGES.length === 1 ? 0.5 : i / (SISTEMA_HERO_IMAGES.length - 1);
            const theta = Math.PI + t * Math.PI;
            const radiusPct = 48;
            const leftPct = 50 + radiusPct * Math.cos(theta);
            const depthPx = 52;
            const basePx = 10;
            // Edges at base+depth, center at base (lowest point of arc)
            const bottomPx = basePx + depthPx * (1 + Math.sin(theta));
            const w = Math.round(img.w * 0.58);
            const h = Math.round(img.h * 0.58);
            // Left images lean right, right images lean left — symmetric, small but noticeable
            const tilt = (0.5 - t) * 24;
            const z = 5 - Math.abs(i - 2);
            return (
              <motion.div
                key={img.src}
                className="absolute overflow-hidden rounded-xl shadow-xl shadow-black/35"
                style={{
                  width: w,
                  height: h,
                  left: `${leftPct}%`,
                  bottom: `${bottomPx}px`,
                  x: "-50%",
                  rotate: tilt,
                  transformOrigin: "center bottom",
                  zIndex: z,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={(!skippedInitialAnimation || arrivalAnimationReady) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  duration: 0.5,
                  delay: skippedInitialAnimation ? 0.2 + i * 0.08 : 0.85 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <Image
                  src={img.src}
                  alt=""
                  width={w}
                  height={h}
                  className="h-full w-full object-cover"
                  sizes="140px"
                  quality={Q.section}
                  loading="eager"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Desktop collage photos */}
      <div
        className="pointer-events-none absolute inset-0 z-[30] hidden md:block"
        style={{ transform: "translate(40px, -40px)" }}
      >
        {SISTEMA_HERO_IMAGES.map((img, i) => (
          <motion.div
            key={i}
            layout={false}
            className="absolute overflow-hidden rounded-xl shadow-2xl shadow-black/25"
            style={{
              width: img.w,
              height: img.h,
              left: img.left,
              top: img.top,
              rotate: img.rotate,
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={(!skippedInitialAnimation || arrivalAnimationReady) ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.6,
              delay: skippedInitialAnimation ? 0.2 + i * 0.1 : 0.9 + i * 0.1,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover"
              sizes={`${img.w}px`}
              quality={Q.photo}
              loading="eager"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
