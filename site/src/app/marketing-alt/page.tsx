"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { useTransitionArrival } from "@/components/CarouselTransition/useTransitionArrival";
import BlobShape from "@/components/BlobShape";
import Marquee from "@/components/Marquee";
import { DotGrid } from "@/components/DecorativeSVGs";
import Image from "next/image";
import Link from "next/link";

const PROBLEM_HEADLINE_CHARS: { char: string; italic: boolean }[] = [
  ..."El problema no es invertir en marketing. ".split("").map((char) => ({ char, italic: false })),
  ..."Es hacerlo sin sistema.".split("").map((char) => ({ char, italic: true })),
];

/** Custom X PNG — 70% of ServiceCardCornerOverlays base (≈30% smaller than 7.92/10.08rem) */
const MKT_X_STICKER_BASE =
  "pointer-events-none absolute z-[5] h-[5.544rem] w-[5.544rem] md:h-[7.056rem] md:w-[7.056rem]";
const MKT_X_STICKER_IMG =
  "h-full w-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.028)]";

function ProblemHeadlineChar({
  item,
  i,
  total,
  scrollYProgress,
}: {
  item: { char: string; italic: boolean };
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = i / total;
  const end = (i + 1) / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const blurPx = useTransform(scrollYProgress, [start, end], [12, 0]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

  return (
    <motion.span
      className={item.italic ? "italic font-light" : undefined}
      style={{ display: "inline", opacity, filter, willChange: "filter, opacity" }}
    >
      {item.char}
    </motion.span>
  );
}

function ProblemHeadlineScroll({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const total = PROBLEM_HEADLINE_CHARS.length;
  return (
    <h2 className="text-4xl md:text-5xl font-bold leading-[1] tracking-tight mb-8 text-white [contain:layout]">
      {PROBLEM_HEADLINE_CHARS.map((item, i) => (
        <ProblemHeadlineChar key={i} item={item} i={i} total={total} scrollYProgress={scrollYProgress} />
      ))}
    </h2>
  );
}

function useProblemSectionHeadlineProgress(sectionRef: RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      const sectionTop = rect.top + scrollY;
      const H = el.offsetHeight;
      const vh = window.innerHeight;
      const startScroll = sectionTop - vh;
      const endScroll = sectionTop + H - vh;
      const span = endScroll - startScroll;
      if (span <= 0) {
        progress.set(0);
        return;
      }
      const raw = (scrollY - startScroll) / span;
      const p = Math.min(1, Math.max(0, raw * 2));
      progress.set(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);
  return progress;
}

/**
 * marketing-alt hero — two horizontal rungs that together fill the viewport:
 *   • Top 70vh on cream/beige: portrait video • H1 + subtitle + buttons • 3 floating bubbles (<¼ vw)
 *   • Bottom 30vh on white: three columns with coral titles and short copy
 */
function HeroSection() {
  const { skippedInitialAnimation, arrivalAnimationReady } = useTransitionArrival();
  const bubblesVisible = !skippedInitialAnimation || arrivalAnimationReady;

  const bottomColumns = [
    {
      title: "Estrategia",
      body: "Sistema, mensaje y narrativa con foco en resultados de negocio.",
    },
    {
      title: "Contenido",
      body: "Creativos y narrativas pensadas para performance, no solo para el feed.",
    },
    {
      title: "Meta Ads",
      body: "Campañas con estructura, pruebas y escalamiento consciente.",
    },
  ];

  return (
    <section className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* ── Top rung — 70vh, pinkish beige ───────────────────────────── */}
      <div
        className="relative flex items-center"
        style={{
          height: "70vh",
          background:
            "radial-gradient(ellipse 50% 40% at 78% 12%, rgba(232, 93, 117, 0.14), transparent 62%), #f5ebe8",
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 pt-[calc(5rem+10px)] pb-4 flex items-center gap-5 lg:gap-10">
          {/* Video + copy — shifted right on desktop; bubbles stay at the rim */}
          <div className="flex min-w-0 flex-1 items-center gap-5 md:pl-[200px] lg:gap-10">
          {/* Col 1 — portrait video */}
          <motion.div
            layout={false}
            initial={skippedInitialAnimation ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="shrink-0"
          >
            <div className="relative w-[34vw] sm:w-[26vw] md:w-[22vw] lg:w-[20vw] xl:w-[18vw] h-[min(48vh,420px)] md:h-[min(52vh,460px)] lg:h-[min(56vh,500px)] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)] lg:rounded-[2rem]">
              <video
                src="/360marketing.mp4"
                autoPlay
                muted
                playsInline
                loop
                suppressHydrationWarning
                className="block h-full w-full object-cover object-top"
                aria-label="Marketing video"
              />
            </div>
          </motion.div>

          {/* Col 2 — H1, subtitle, two buttons */}
          <div className="flex-1 min-w-0 flex flex-col">
            <motion.div
              layout={false}
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="w-14 h-0.5 bg-coral" />
              <span className="text-base font-semibold uppercase tracking-[0.2em] text-coral">
                Para marcas
              </span>
            </motion.div>

            <div className="relative mb-6 w-fit max-w-full">
              {/* Floating bubbles — hug top-right corner of the headline */}
              <motion.div
                className="pointer-events-none absolute z-10 hidden md:block top-0 right-0 translate-x-[0.35rem] -translate-y-[1.75rem] lg:translate-x-2 lg:-translate-y-8"
                aria-hidden
                initial={skippedInitialAnimation ? { opacity: 0 } : false}
                animate={skippedInitialAnimation ? (bubblesVisible ? { opacity: 1 } : { opacity: 0 }) : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative flex w-[10.5rem] flex-col items-end justify-center gap-2.5 lg:w-[11.25rem] lg:gap-3">
                  <div className="flex w-full items-end justify-between gap-2">
                    <div className="-translate-y-1">
                      <div className="inline-block origin-center scale-[0.82] lg:scale-[0.88]">
                        <motion.div
                          className="inline-flex w-fit flex-col items-center gap-1.5 rounded-full bg-white px-4 py-3 text-coral shadow-[0_4px_16px_-2px_color-mix(in srgb,var(--coral) 11%,transparent),0_0_18px_color-mix(in srgb,var(--coral) 5%,transparent)] lg:gap-2 lg:px-5 lg:py-4"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.65"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto block h-9 w-9 shrink-0 lg:h-10 lg:w-10"
                            aria-hidden
                          >
                            <path d="M3 3v18h18" />
                            <path d="M18 17V9" />
                            <path d="M13 17V5" />
                            <path d="M8 17v-3" />
                          </svg>
                          <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight tracking-wide lg:text-[10px]">
                            Estrategia
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="inline-block origin-center scale-[0.82] lg:scale-[0.88]">
                      <motion.div
                        className="inline-flex w-fit flex-col items-center gap-1.5 rounded-full bg-white px-4 py-3 text-coral shadow-[0_4px_16px_-2px_color-mix(in srgb,var(--coral) 11%,transparent),0_0_18px_color-mix(in srgb,var(--coral) 5%,transparent)] lg:gap-2 lg:px-5 lg:py-4"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.65"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mx-auto block h-9 w-9 shrink-0 lg:h-10 lg:w-10"
                          aria-hidden
                        >
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="6" />
                          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                        </svg>
                        <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight tracking-wide lg:text-[10px]">
                          Contenido
                        </span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="inline-block origin-center scale-[0.82] lg:scale-[0.88]">
                    <motion.div
                      className="inline-flex w-fit flex-col items-center gap-1.5 rounded-full bg-white px-4 py-3 text-coral shadow-[0_4px_16px_-2px_color-mix(in srgb,var(--coral) 11%,transparent),0_0_18px_color-mix(in srgb,var(--coral) 5%,transparent)] lg:gap-2 lg:px-5 lg:py-4"
                      animate={{ y: [0, -5.5, 0] }}
                      transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut", delay: 0.65 }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.65"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto block h-9 w-9 shrink-0 lg:h-10 lg:w-10"
                        aria-hidden
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight tracking-wide lg:text-[10px]">
                        Meta Ads
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                layout={false}
                initial={skippedInitialAnimation ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-coral text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[0.95] tracking-tight"
              >
                Marketing &{" "}
                <span className="relative inline-block">
                  <span className="gradient-text-coral italic font-light">Performance</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" fill="none" preserveAspectRatio="none">
                    <motion.path
                      d="M0 4C15 1 35 7 50 4C65 1 85 7 100 4"
                      stroke="var(--coral)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={skippedInitialAnimation ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.78, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                </span>
              </motion.h1>
            </div>

            <motion.p
              layout={false}
              initial={skippedInitialAnimation ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="text-lg md:text-xl lg:text-2xl text-gray leading-relaxed mb-8 max-w-2xl"
            >
              Estrategia, contenido y Meta Ads para crecer con orden y resultados reales.
            </motion.p>

            <motion.div
              layout={false}
              initial={skippedInitialAnimation ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/contacto/marketing#formulario"
                className="group inline-flex items-center justify-center gap-2.5 bg-coral text-white px-8 py-4 rounded-full text-base md:text-lg font-medium hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/20"
              >
                Hablemos de tu marca
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/contacto/marketing#formulario"
                className="inline-flex items-center justify-center gap-2.5 border-2 border-foreground/10 px-8 py-4 rounded-full text-base md:text-lg font-medium hover:border-coral/30 transition-all duration-300"
              >
                Explorar servicios
              </Link>
            </motion.div>
          </div>
          </div>
        </div>
      </div>

      {/* ── Bottom rung — 30vh, white, 3 columns ─────────────────────── */}
      <div className="relative bg-white flex items-center" style={{ height: "30vh" }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {bottomColumns.map((col, i) => (
              <motion.div
                key={col.title}
                initial={skippedInitialAnimation ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-coral mb-3">
                  {col.title}
                </h3>
                <p className="text-sm md:text-base text-gray leading-relaxed">
                  {col.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineScrollProgress = useProblemSectionHeadlineProgress(sectionRef);
  const prefersReducedMotion = useReducedMotion();

  const problems = [
    "Crean contenido sin una estrategia clara",
    "Lanzan campañas sin una narrativa sólida",
    "Invierten en ads sin entender qué convierte",
    "Dependen de picos en lugar de procesos",
  ];

  const results = [
    "Resultados inestables",
    "Equipos cansados",
    "Decisiones reactivas",
    "Dinero mal invertido",
  ];

  return (
    <div className="relative w-full pb-32 sm:pb-36 md:pb-40 lg:pb-44 xl:pb-48 2xl:pb-52">
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-coral py-28 sm:py-32 md:py-36 lg:py-40 xl:py-44 2xl:py-48"
        style={{
          borderRadius: "0 0 9999px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-7 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-4 block">
              El problema
            </span>
            {prefersReducedMotion ? (
              <h2 className="text-4xl md:text-5xl font-bold leading-[1] tracking-tight mb-8 text-white">
                El problema no es invertir en marketing.{" "}
                <span className="italic font-light">Es hacerlo sin sistema.</span>
              </h2>
            ) : (
              <ProblemHeadlineScroll scrollYProgress={headlineScrollProgress} />
            )}
            <AnimatedSection light>
              <p className="text-lg text-white/80 mb-6">Muchas marcas:</p>
              <ul className="space-y-4 mb-8">
                {problems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-white shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.1} direction="left" light>
            <div className="relative overflow-visible rounded-3xl border border-white/20 bg-white/10 p-8 text-white md:p-10">
              <div
                className={`${MKT_X_STICKER_BASE} right-0 top-0 translate-x-[calc(40%-120px)] translate-y-[calc(-36%_-_15px)] rotate-[5deg]`}
                aria-hidden
              >
                <Image
                  src="/icons/x.webp"
                  alt=""
                  width={114}
                  height={114}
                  className={MKT_X_STICKER_IMG}
                />
              </div>
              <div className="relative z-10">
                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white/70">El resultado</h3>
                <div className="grid grid-cols-2 gap-4">
                  {results.map((item, i) => (
                    <div key={i} className="rounded-2xl border border-white/20 bg-white/10 p-5">
                      <p className="text-sm text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-white/20 pt-6 text-sm text-white/60">
                  El marketing sin sistema no escala. <span className="font-semibold text-white">Se agota.</span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      </section>
      <p
        className="pointer-events-none absolute bottom-0 z-10 max-w-[min(78vw,16rem)] text-right text-3xl font-normal leading-[1.08] tracking-tight text-black sm:max-w-[min(82vw,20rem)] sm:text-4xl sm:leading-[1.05] sm:pr-1 md:max-w-[min(86vw,28rem)] md:text-5xl md:pr-2 md:leading-[1] lg:max-w-[min(88vw,34rem)] lg:pr-3 xl:max-w-[min(90vw,40rem)] xl:pr-4 2xl:max-w-[44rem] 2xl:pr-5 right-3 pb-4 pl-3 sm:right-4 sm:pb-5 sm:pl-4 md:right-6 md:pb-6 md:pl-5 lg:right-8 lg:pb-7 lg:pl-6 xl:right-10 xl:pb-8 xl:pl-7 2xl:right-12 2xl:pb-10 2xl:pl-8"
      >
        <span className="font-bold">La solución</span> es un{" "}
        <span className="italic font-light text-black">márketing medible,</span>{" "}
        <span className="font-bold">con estructura</span>
      </p>
    </div>
  );
}

const MKT_STACK_BG = [
  "color-mix(in srgb, var(--coral) 32%, white)",
  "color-mix(in srgb, var(--coral) 50%, white)",
  "color-mix(in srgb, var(--coral) 68%, white)",
  "color-mix(in srgb, var(--coral) 84%, white)",
  "var(--coral)",
];
const MKT_STACK_GLOW = [
  "color-mix(in srgb, var(--coral) 20%, transparent)",
  "color-mix(in srgb, var(--coral) 26%, transparent)",
  "color-mix(in srgb, var(--coral) 31%, transparent)",
  "color-mix(in srgb, var(--coral) 36%, transparent)",
  "color-mix(in srgb, var(--coral) 42%, transparent)",
];
const MKT_STACK_TEXT = "#ffffff";
const MKT_STACK_TEXT_SHADOW = [
  "0 1px 2px rgba(0,0,0,0.06)",
  "0 1px 1px rgba(0,0,0,0.05)",
  "none",
  "none",
  "none",
];
const MKT_STACK_CARDS = [
  { title: "Mensaje", desc: "Claro, consistente y conectado a lo que vendes." },
  { title: "Contenido", desc: "Creativos y narrativas pensadas para performance, no solo para el feed." },
  { title: "Paid media", desc: "Campañas con estructura, pruebas y escalamiento consciente." },
  { title: "Métricas de negocio", desc: "Decisiones con datos que importan al negocio, no vanidad." },
  { title: "Sistema", desc: "Claro, medible, predecible y sostenible — menos ruido, más intención." },
];

function MktStackCardTitle({ topic, i }: { topic: (typeof MKT_STACK_CARDS)[0]; i: number }) {
  if (i === 4) {
    return (
      <>
        Sistema
        <br />
        completo
      </>
    );
  }
  if (i === 0) return <>Mensaje y narrativa</>;
  if (i === 2) return <>Paid media</>;
  return <>{topic.title}</>;
}

const MKT_STACK_ICON_SRC = [
  "/icons/mensaje.webp",
  "/icons/contenido.webp",
  "/icons/media.webp",
  "/icons/medible.webp",
  "/icons/sistema.webp",
] as const;

function MktStackCardIcon({ i }: { i: number }) {
  const src = MKT_STACK_ICON_SRC[i];
  return (
    <Image
      src={src}
      alt=""
      width={420}
      height={420}
      className="h-[7.5rem] w-[7.5rem] shrink-0 object-contain opacity-95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.09)] md:h-[8.4375rem] md:w-[8.4375rem]"
    />
  );
}

function PerformanceWithStructureStackingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const smoothProgress = scrollYProgress;

  const PX = 0.8;
  const N = 5;
  const OFF = Math.round(56 * PX);
  const FINAL_YS = [0, 1 * OFF, 2 * OFF, 3 * OFF, (N - 1) * OFF];
  const ANIMATION_COMPLETE_AT = 0.88;
  const START_X = Math.round(-90 * PX);
  const START_Y = Math.round(880 * PX);
  const CTRL_X = 0;
  const CTRL_Y = Math.round(280 * PX);

  const cardTransform = (i: number) => (p: number) => {
    const pScaled = Math.min(1, p / ANIMATION_COMPLETE_AT);
    const GAP = 0.16;
    const t = Math.max(0, Math.min(1, (pScaled - i * GAP) / (1 - (N - 1) * GAP)));
    const endY = FINAL_YS[i];

    if (t <= 0) {
      const dx = 2 * (CTRL_X - START_X);
      const dy = 2 * (CTRL_Y - START_Y);
      const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
      return { x: START_X, y: START_Y, rotate: angleDeg };
    }
    if (t >= 1) return { x: 0, y: endY, rotate: 0 };

    const mt = 1 - t;
    const x = mt * mt * START_X + 2 * mt * t * CTRL_X + t * t * 0;
    const y = mt * mt * START_Y + 2 * mt * t * CTRL_Y + t * t * endY;

    const dx = 2 * mt * (CTRL_X - START_X) + 2 * t * (0 - CTRL_X);
    const dy = 2 * mt * (CTRL_Y - START_Y) + 2 * t * (endY - CTRL_Y);
    const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;

    return { x, y, rotate: angleDeg };
  };

  const sx0 = useTransform(smoothProgress, (p) => cardTransform(0)(p).x);
  const sy0 = useTransform(smoothProgress, (p) => cardTransform(0)(p).y);
  const sr0 = useTransform(smoothProgress, (p) => cardTransform(0)(p).rotate);
  const sx1 = useTransform(smoothProgress, (p) => cardTransform(1)(p).x);
  const sy1 = useTransform(smoothProgress, (p) => cardTransform(1)(p).y);
  const sr1 = useTransform(smoothProgress, (p) => cardTransform(1)(p).rotate);
  const sx2 = useTransform(smoothProgress, (p) => cardTransform(2)(p).x);
  const sy2 = useTransform(smoothProgress, (p) => cardTransform(2)(p).y);
  const sr2 = useTransform(smoothProgress, (p) => cardTransform(2)(p).rotate);
  const sx3 = useTransform(smoothProgress, (p) => cardTransform(3)(p).x);
  const sy3 = useTransform(smoothProgress, (p) => cardTransform(3)(p).y);
  const sr3 = useTransform(smoothProgress, (p) => cardTransform(3)(p).rotate);
  const sx4 = useTransform(smoothProgress, (p) => cardTransform(4)(p).x);
  const sy4 = useTransform(smoothProgress, (p) => cardTransform(4)(p).y);
  const sr4 = useTransform(smoothProgress, (p) => cardTransform(4)(p).rotate);
  const sxValues = [sx0, sx1, sx2, sx3, sx4];
  const syValues = [sy0, sy1, sy2, sy3, sy4];
  const srValues = [sr0, sr1, sr2, sr3, sr4];

  const CARD_W = Math.round(288 * PX);
  const CARD_H = Math.round(288 * PX);
  const SCROLL_HEIGHT = "400vh";
  const STICKY_HEIGHT = "500vh";

  return (
    <>
      <div className="md:hidden px-6 py-14 bg-coral/5">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coral mb-4 block">Enfoque</span>
        <h2 className="text-3xl font-bold leading-tight text-foreground mb-3">
          Performance con <span className="gradient-text-coral italic">estructura</span>
        </h2>
        <p className="text-foreground/70 text-[15px] leading-relaxed mb-6">
          No trabajo con tácticas aisladas. Trabajo con sistemas de crecimiento.
        </p>
        <Link
          href="/contacto/marketing"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-coral/20 transition-colors hover:bg-coral-dark"
        >
          Hablemos de tu marca
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div style={{ height: STICKY_HEIGHT }} className="relative -mt-[240px] md:-mt-[240px]">
        <div
          ref={containerRef}
          style={{ height: SCROLL_HEIGHT }}
          className="relative pointer-events-none"
          aria-hidden
        />
        <div
          className="sticky top-0 h-screen overflow-hidden flex items-center bg-transparent relative z-[2]"
          style={{ marginTop: `calc(-1 * ${SCROLL_HEIGHT})` }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center gap-6 md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div className="hidden md:block relative z-10">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coral mb-5 block">
                Enfoque
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground mb-6">
                Performance con{" "}
                <span className="gradient-text-coral italic">estructura</span>
              </h2>
              <p className="text-foreground/70 leading-relaxed max-w-md text-[15px]">
                No trabajo con tácticas aisladas. Trabajo con sistemas de crecimiento.
              </p>
              <Link
                href="/contacto/marketing"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-coral underline-offset-4 transition-colors hover:text-coral-dark hover:underline md:text-base"
              >
                Hablemos de tu marca
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative" style={{ width: CARD_W, height: CARD_H + (N - 1) * OFF }}>
                {MKT_STACK_CARDS.map((topic, i) => (
                  <motion.div
                    key={i}
                    style={{
                      x: sxValues[i],
                      y: syValues[i],
                      rotate: srValues[i],
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: CARD_W,
                      height: CARD_H,
                      zIndex: i + 1,
                      backgroundColor: MKT_STACK_BG[i],
                      boxShadow: `0 14px 28px -8px rgba(0,0,0,0.14), 0 8px 16px -6px rgba(0,0,0,0.1), 0 ${12 + i * 6}px ${36 + i * 12}px ${MKT_STACK_GLOW[i]}`,
                    }}
                    className="rounded-3xl overflow-hidden flex flex-col h-full min-h-0 p-5 pt-6 relative text-left"
                  >
                    <h3
                      className="shrink-0 font-bold leading-tight tracking-tight text-xl md:text-2xl max-w-full pr-1"
                      style={{ color: MKT_STACK_TEXT, textShadow: MKT_STACK_TEXT_SHADOW[i] }}
                    >
                      <MktStackCardTitle topic={topic} i={i} />
                    </h3>
                    <div className="flex-1 flex items-center justify-center min-h-0 py-3" aria-hidden>
                      <MktStackCardIcon i={i} />
                    </div>
                    <p
                      className="shrink-0 text-[13px] leading-relaxed"
                      style={{ color: MKT_STACK_TEXT, textShadow: MKT_STACK_TEXT_SHADOW[i] }}
                    >
                      {topic.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ApproachSection() {
  return (
    <section className="relative bg-coral/5 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PerformanceWithStructureStackingSection />
      </div>
    </section>
  );
}

function ResultsSection() {
  const results = [
    {
      headline: "+340% en ROAS",
      desc: "Reestructuramos las campañas de Meta y en 60 días triplicamos el retorno sobre inversión publicitaria sin aumentar el presupuesto.",
      tag: "Meta Ads",
    },
    {
      headline: "De 0 a 80K seguidores",
      desc: "Estrategia de contenido construida sobre mensaje claro y creativos pensados para convertir, no solo para el feed.",
      tag: "Content Strategy",
    },
    {
      headline: "CPL reducido un 60%",
      desc: "Testing estructurado de ángulos y formatos hasta dar con la combinación que realmente convierte en costo por lead.",
      tag: "Ad Campaign",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <BlobShape color="var(--coral)" size={500} className="-top-40 -right-40" opacity={0.04} />
      <BlobShape color="var(--coral)" size={300} className="bottom-0 -left-20" opacity={0.03} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <AnimatedSection light>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
            <div className="max-w-xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4 block">
                Resultados
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-6 text-foreground">
                Así se ve<br />cuando funciona
              </h2>
              <p className="text-lg text-gray leading-relaxed">
                No trabajamos con promesas. Trabajamos con estructura, datos y
                creatividad aplicada. Esto es lo que pasa cuando los tres se alinean.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill="var(--amarillo)">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/40 text-sm">Clientes satisfechos, resultados reales</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05} light>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-16 md:mb-20">
            <div className="col-span-2 aspect-[16/9] rounded-[1.75rem] bg-gray-light/30 border border-gray-light flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center gap-3 text-foreground/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-xs tracking-wide uppercase">Imagen principal</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex-1 rounded-[1.75rem] bg-gray-light/30 border border-gray-light flex items-center justify-center min-h-[140px]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/20">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div className="flex-1 rounded-[1.75rem] bg-gray-light/30 border border-gray-light flex items-center justify-center min-h-[140px]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/20">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5">
          {results.map((r, i) => (
            <AnimatedSection key={i} delay={0.1 + i * 0.07} light>
              <div className="bg-white border border-gray-light rounded-[1.75rem] p-8 flex flex-col gap-5 h-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="var(--amarillo)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight leading-none text-foreground">
                  {r.headline}
                </p>
                <p className="text-gray text-sm leading-relaxed flex-1">
                  {r.desc}
                </p>
                <span className="self-start text-xs font-semibold uppercase tracking-wider text-coral border border-coral/30 px-3 py-1.5 rounded-full">
                  {r.tag}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketingDarkBandTopCurve() {
  return (
    <div className="w-full shrink-0 leading-none" aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-14 w-full md:h-[4.25rem]"
      >
        <path fill="white" d="M0 0h1440v28Q720 72 0 28z" />
      </svg>
    </div>
  );
}

function MarketingDarkBandBottomCurve() {
  return (
    <div className="w-full shrink-0 leading-none" aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-14 w-full md:h-[4.25rem]"
      >
        <path fill="white" d="M0 28Q720 0 1440 28L1440 72L0 72z" />
      </svg>
    </div>
  );
}

function MarketingClientLogosSection() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection delay={0.05} light>
          <h2 className="mb-8 text-center text-3xl font-bold leading-[1.08] tracking-tight text-foreground md:mb-10 md:text-left md:text-4xl lg:text-5xl">
            <span className="not-italic">Algunos de </span>
            <span className="gradient-text-coral font-light italic">nuestros clientes</span>
          </h2>
          <Image
            src="/home/clientes.webp"
            alt="Algunos de nuestros clientes"
            width={2376}
            height={908}
            className="mx-auto h-auto w-full max-w-full rounded-none object-contain object-center"
            sizes="(max-width: 1280px) 90vw, 960px"
            quality={95}
            loading="eager"
          />
        </AnimatedSection>
      </div>
    </section>
  );
}

function ServiceCardCornerOverlays({ serviceIndex }: { serviceIndex: number }) {
  const baseWrap =
    "pointer-events-none absolute z-[5] h-[7.92rem] w-[7.92rem] md:h-[10.08rem] md:w-[10.08rem]";
  const imgClass = "object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.028)]";

  const overlays: { src: string; className: string; rotate: string }[][] = [
    [
      {
        src: "/icons/contenido.webp",
        className: `${baseWrap} bottom-0 left-0 -translate-x-[42%] translate-y-[38%]`,
        rotate: "-rotate-[6deg]",
      },
    ],
    [
      {
        src: "/icons/estrategia.webp",
        className: `${baseWrap} right-0 top-0 translate-x-[40%] -translate-y-[36%]`,
        rotate: "rotate-[5deg]",
      },
    ],
    [
      {
        src: "/icons/media.webp",
        className: `${baseWrap} left-0 top-0 -translate-x-[40%] -translate-y-[36%]`,
        rotate: "-rotate-[5deg]",
      },
      {
        src: "/icons/medible.webp",
        className: `${baseWrap} bottom-0 right-0 translate-x-[40%] translate-y-[36%]`,
        rotate: "rotate-[7deg]",
      },
    ],
  ];

  const list = overlays[serviceIndex] ?? [];
  if (list.length === 0) return null;

  return (
    <>
      {list.map((o, i) => (
        <div key={`${o.src}-${i}`} className={`${o.className} ${o.rotate}`} aria-hidden>
          <Image
            src={o.src}
            alt=""
            width={162}
            height={162}
            className={`h-full w-full ${imgClass}`}
          />
        </div>
      ))}
    </>
  );
}

function ServicesSection() {
  const services = [
    {
      num: "01",
      title: "Content Creation estratégico",
      subtitle: "Contenido pensado para convertir, no solo para verse bien.",
      desc: "Diseño contenido como parte del sistema de venta, no como un fin en sí mismo.",
      items: [
        "Definición de mensaje y posicionamiento",
        "Estrategia de contenido alineada a objetivos de negocio",
        "Creativos optimizados para paid media",
        "Narrativas claras, testables y escalables",
      ],
      tagline: "El contenido no es decoración. Es parte del performance.",
    },
    {
      num: "02",
      title: "Ad Campaign Strategy",
      subtitle: "Campañas con hipótesis claras y estructura.",
      desc: "Antes de lanzar anuncios, diseño la estrategia detrás.",
      items: [
        "Estructura de campañas alineada a funnel y objetivos",
        "Definición de audiencias y mensajes",
        "Testing estratégico de creativos y copies",
        "Claridad sobre qué se está probando y por qué",
      ],
      tagline: "No se trata de lanzar más campañas. Se trata de lanzar mejores decisiones.",
    },
    {
      num: "03",
      title: "Meta Ads Management",
      subtitle: "Gestión consciente de inversión publicitaria.",
      desc: "Gestiono campañas de Meta Ads con foco en eficiencia, aprendizaje y escalabilidad.",
      items: [
        "Setup y optimización de campañas",
        "Análisis continuo de performance",
        "Iteración basada en data real",
        "Escalamiento sin quemar presupuesto",
      ],
      tagline: "No se trata de gastar más. Se trata de entender qué funciona y replicarlo.",
    },
  ];

  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-foreground pb-[3.6rem] pt-0 text-background md:pb-[4.8rem]"
    >
      <MarketingDarkBandTopCurve />
      <BlobShape color="var(--coral)" size={400} className="-top-40 right-0" opacity={0.1} />

      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8 pt-24 md:pt-32">
        <AnimatedSection light>
          <div className="mb-16 text-center">
            <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.2em] text-coral-light">
              Servicios
            </span>
            <h2 className="text-4xl font-bold leading-[1] tracking-tight text-background md:text-5xl lg:text-6xl">
              ¿Qué hago?
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {services.map((service, i) => (
            <AnimatedSection key={i} delay={i * 0.08} light>
              <div className="group relative overflow-visible rounded-3xl border border-white/10 bg-white/5 p-8 shadow-none transition-all duration-500 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/25 md:p-10">
                <ServiceCardCornerOverlays serviceIndex={i} />

                <span className="pointer-events-none absolute -right-4 -top-4 z-0 select-none text-[10rem] font-bold leading-none text-coral/10">
                  {service.num}
                </span>

                <div className="relative z-10 grid gap-8 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-sm font-bold text-coral-light">{service.num}</span>
                      <span className="h-0.5 w-8 bg-coral-light" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-background">{service.title}</h3>
                    <p className="mb-2 font-medium text-coral-light">{service.subtitle}</p>
                    <p className="text-sm text-white/70">{service.desc}</p>
                    <Link
                      href="/contacto/marketing"
                      className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-coral-light underline-offset-4 transition-colors hover:text-background hover:underline md:text-base"
                    >
                      Hablemos de tu marca
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>

                  <div className="lg:col-span-3">
                    <ul className="mb-6 space-y-3">
                      {service.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 rounded-xl p-3 text-white/85 transition-colors hover:bg-white/5"
                        >
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-coral-light" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-white/10 pt-4 text-sm italic text-white/55">
                      {service.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWhomSection() {
  return (
    <section className="relative overflow-hidden bg-foreground pb-0 pt-[3.6rem] text-background md:pt-[4.8rem]">
      <BlobShape color="var(--coral)" size={400} className="-top-40 right-0" opacity={0.1} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <AnimatedSection light>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-coral-light mb-4 block">
                ¿Es para tu marca?
              </span>
              <h2 className="text-4xl md:text-5xl font-bold leading-[1] tracking-tight mb-8">
                Para quién es este trabajo
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.05} light>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-coral-light mb-4 uppercase tracking-wider">Trabajo con marcas que:</h4>
                  <ul className="space-y-3">
                    {[
                      "Ya venden o están listas para escalar",
                      "Quieren crecer con orden, no con urgencia",
                      "Valoran la estrategia tanto como la ejecución",
                      "Buscan un partner estratégico, no solo un gestor de ads",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-coral-light shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.1} direction="left" light>
            <div className="relative overflow-visible rounded-3xl border border-white/10 bg-white/5 p-8">
              <div
                className={`${MKT_X_STICKER_BASE} bottom-0 right-0 translate-x-[calc(40%-70px)] translate-y-[calc(36%+15px)] rotate-[7deg]`}
                aria-hidden
              >
                <Image
                  src="/icons/x.webp"
                  alt=""
                  width={114}
                  height={114}
                  className={MKT_X_STICKER_IMG}
                />
              </div>
              <div className="relative z-10">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
                  No es para marcas que:
                </h4>
                <ul className="mb-8 space-y-3">
                  {[
                    "Quieren resultados inmediatos sin proceso",
                    "Cambian de dirección cada semana",
                    'Buscan "solo anuncios que vendan" sin mirar el sistema completo',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/50">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <MarketingDarkBandBottomCurve />
    </section>
  );
}

function ProcessSteps({ steps }: { steps: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [svgData, setSvgData] = useState<{ pts: { x: number; y: number }[]; w: number; h: number } | null>(null);

  useEffect(() => {
    const calc = () => {
      const c = containerRef.current;
      if (!c) return;
      const cr = c.getBoundingClientRect();
      const pts = nodeRefs.current
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top };
        })
        .filter((p): p is { x: number; y: number } => p !== null);
      if (pts.length >= 2) setSvgData({ pts, w: cr.width, h: cr.height });
    };
    const t = setTimeout(calc, 700);
    window.addEventListener("resize", calc);
    return () => { clearTimeout(t); window.removeEventListener("resize", calc); };
  }, []);

  return (
    <div>
      <div ref={containerRef} className="relative">

        {svgData && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={svgData.w}
            height={svgData.h}
            style={{ overflow: "visible" }}
            aria-hidden
          >
            <defs>
              <linearGradient
                id="diagGrad"
                gradientUnits="userSpaceOnUse"
                x1={svgData.pts[0].x} y1={svgData.pts[0].y}
                x2={svgData.pts[svgData.pts.length - 1].x}
                y2={svgData.pts[svgData.pts.length - 1].y}
              >
                <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--coral)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polyline
              points={svgData.pts.map((p) => `${p.x},${p.y}`).join(" ")}
              stroke="url(#diagGrad)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}

        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="group relative flex items-center gap-4 md:gap-6 py-2 md:py-5 cursor-default [--step-indent:24px] md:[--step-indent:38px]"
            style={{ paddingLeft: `calc(${i} * var(--step-indent))` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              ref={(el) => { nodeRefs.current[i] = el; }}
              className="relative z-10 shrink-0 w-14 h-14 md:w-[3.75rem] md:h-[3.75rem] rounded-full bg-coral flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                boxShadow: "0 4px 18px color-mix(in srgb,var(--coral) 32%,transparent)",
                opacity: 1 - i * 0.06,
              }}
            >
              <span className="relative z-10 text-white font-bold text-base md:text-lg tabular-nums">
                {i + 1}
              </span>
            </div>

            <span className="shrink-0 w-5 h-px bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300" aria-hidden />

            <p
              className="text-[1.05rem] md:text-[1.15rem] font-medium leading-snug group-hover:text-foreground transition-colors duration-300"
              style={{ color: `rgba(26,26,26,${1 - i * 0.07})` }}
            >
              {step}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-[72px] max-w-[min(100%,26rem)] -ml-1 sm:-ml-0.5 mr-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <p className="text-[0.95rem] text-gray leading-relaxed mb-2">
          Marketing que se entiende, que se mide y que se sostiene en el tiempo — sin quemar equipos ni presupuesto.
        </p>
        <p className="text-base font-semibold text-foreground">
          Crecimiento con cabeza, no por reacción.
        </p>
      </motion.div>
    </div>
  );
}

const FLOAT_DURATIONS = [4.2, 3.6, 3.9, 4.5];
const FLOAT_DELAYS = [0, 0.35, 0.65, 0.9];
const FLOAT_AMOUNTS = [6, 5, 5.5, 4.5];

function ProcessAndWhySection() {

  const steps = [
    "Entiendo tu negocio y contexto",
    "Diseño el sistema de marketing y performance",
    "Definimos prioridades claras",
    "Ejecutamos, medimos y ajustamos",
    "Escalamos lo que funciona",
    "Eliminamos lo que no",
  ];

  const pillItems = ["Estrategia", "Contenido", "Paid media", "Toma de decisiones consciente"];

  return (
    <section className="mt-[136px] py-32 md:py-40 bg-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 45% at 90% 5%, color-mix(in srgb,var(--coral) 7%,transparent), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-[56px]">

        <AnimatedSection light>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-0.5 bg-coral" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
              Proceso &amp; Diferencia
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1] tracking-tight">
              Cómo trabajo y{" "}
              <span className="relative inline-block">
                <span className="gradient-text-coral italic font-light">por qué importa</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 100 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M0 4C15 1 35 7 50 4C65 1 85 7 100 4"
                    stroke="var(--coral)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.91, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-gray max-w-[260px] lg:text-right leading-relaxed shrink-0">
              No solo ejecuto campañas.<br />
              <span className="text-foreground font-semibold">Pienso el sistema completo.</span>
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 xl:gap-24 items-start">
          <div className="order-2 lg:order-1 min-w-0">
            <ProcessSteps steps={steps} />
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24">

            <AnimatedSection direction="left" light>
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-8 rounded-[3rem]"
                  style={{
                    background:
                      "radial-gradient(ellipse 75% 80% at 50% 50%, color-mix(in srgb,var(--coral) 11%,transparent), transparent 70%)",
                  }}
                  aria-hidden
                />
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg border border-gray-light/30 bg-cream">
                  <Image
                    src="/andreacoachsevilla-55.webp"
                    alt="Andrea, consultora de marketing y performance"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 36vw"
                    priority={false}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, color-mix(in srgb,var(--coral) 82%,transparent) 0%, color-mix(in srgb,var(--coral) 38%,transparent) 45%, transparent 100%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-7 pb-7">
                    <p className="text-white/50 text-[10px] uppercase tracking-[0.25em] mb-1.5">Andrea</p>
                    <p className="text-white font-semibold text-lg leading-snug">
                      Crecimiento con cabeza.{" "}
                      <span className="gradient-text-coral italic font-light">No por reacción.</span>
                    </p>
                  </div>
                </div>
                <DotGrid
                  className="absolute -bottom-4 -left-4 hidden lg:block"
                  cols={4}
                  rows={4}
                  color="var(--coral)"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25} light>
              <div className="mt-[56px] px-1">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-coral mb-3.5">
                  Trabajo donde se cruzan
                </p>
                <div className="flex flex-wrap gap-3">
                  {pillItems.map((item, i) => (
                    <motion.div
                      key={i}
                      className="inline-flex items-center gap-2.5 rounded-full bg-white px-[1.15rem] py-2.5 text-coral shadow-[0_3.5px_12px_-2px_color-mix(in srgb,var(--coral) 12%,transparent),0_0_14px_color-mix(in srgb,var(--coral) 6%,transparent)] border border-coral/10"
                      animate={{ y: [0, -FLOAT_AMOUNTS[i % 4] * 0.805, 0] }}
                      transition={{
                        duration: FLOAT_DURATIONS[i % 4],
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: FLOAT_DELAYS[i % 4],
                      }}
                    >
                      <span className="w-[7px] h-[7px] rounded-full bg-coral shrink-0" aria-hidden />
                      <span className="text-[0.8625rem] font-semibold leading-tight tracking-wide">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const painPoints = [
    "Estás invirtiendo pero falta claridad",
    "Tu contenido no está alineado a performance",
    "Tus ads podrían ser más eficientes",
    "Tu crecimiento podría ser más ordenado",
  ];

  return (
    <section id="contacto" className="py-24 md:py-32 relative overflow-hidden">
      <BlobShape color="var(--coral)" size={400} className="top-0 right-0" opacity={0.06} />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <AnimatedSection light>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4 block">
            Próximo paso
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-8">
            Si tu marca está lista para{" "}
            <span className="gradient-text-coral italic">crecer mejor</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.05} light>
          <p className="text-lg text-gray mb-4">Si sientes que:</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {painPoints.map((item, i) => (
              <span key={i} className="bg-coral/5 border border-coral/10 text-sm px-4 py-2 rounded-full">
                {item}
              </span>
            ))}
          </div>
          <p className="text-xl text-foreground font-semibold mb-10">
            Probablemente no necesitas más tácticas. Necesitas un sistema.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} light>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto/marketing"
              className="group inline-flex items-center justify-center gap-3 bg-coral text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/20"
            >
              Trabajemos tu marca
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/contacto/marketing"
              className="inline-flex items-center justify-center gap-2 border-2 border-foreground/10 px-10 py-5 rounded-full text-lg font-medium hover:border-coral/30 transition-all duration-300"
            >
              Agendar una conversación
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} light>
          <p className="text-gray mt-16 text-lg italic">
            Crecimiento sin sistema es estrés.{" "}
            <span className="text-foreground font-semibold not-italic">Crecimiento con sistema es libertad.</span>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

function MarqueeBanner() {
  return (
    <div className="py-6 bg-coral text-white overflow-hidden">
      <Marquee
        items={[
          "Estrategia",
          "Contenido",
          "Meta Ads",
          "Performance",
          "Crecimiento",
          "Sistemas",
          "Resultados reales",
        ]}
        className="text-sm font-medium tracking-wider uppercase opacity-80"
        speed={25}
      />
    </div>
  );
}

export default function MarketingAltPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MarqueeBanner />
      <ProblemSection />
      <ApproachSection />
      <ResultsSection />
      <MarketingClientLogosSection />
      <ServicesSection />
      <ForWhomSection />
      <ProcessAndWhySection />
      <CTASection />
    </div>
  );
}
