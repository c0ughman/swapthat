"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type RefObject, type ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import BlobShape from "@/components/BlobShape";
import Marquee from "@/components/Marquee";
import ScrollDrawLine from "@/components/ScrollDrawLine";
import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { SistemaLandingHero } from "@/components/SistemaLandingHero";
import HorizontalScroll from "@/components/HorizontalScroll";

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE — sits between Philosophy and Stacking
// ─────────────────────────────────────────────────────────────────────────────
function MarqueeBanner() {
  return (
    <div className="py-6 bg-blue text-white overflow-hidden">
      <Marquee
        items={[
          "Bienestar corporativo",
          "Hábitos sostenibles",
          "Regulación",
          "Foco",
          "Presencia",
          "Movimiento consciente",
          "Equipos humanos",
        ]}
        className="text-sm font-medium tracking-wider uppercase opacity-80"
        speed={25}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STACKING CARDS — left copy, right arc-animated stacking cards
// ─────────────────────────────────────────────────────────────────────────────
const CARD_COLORS = [
  "#6366f1", // blue
  "#e85d75", // coral
  "#eae6df", // off-white beige (lighter)
  "#b8e986", // tennis ball green
  "#f5a623", // orange yellow
];

const CARD_IS_DARK = ["#6366f1", "#e85d75"];

/** Darker versions for bottom gradient (over cartoon, under text) */
const CARD_COLORS_DARK = [
  "#4a4dc7", // blue
  "#b84d62", // coral
  "#c4c0b8", // beige
  "#8fbe5a", // green
  "#c4851c", // orange
];

/** Drop glow (replaces shadow) — strong, each card's color */
const CARD_GLOW_RGBA = [
  "rgba(99, 102, 241, 0.45)",   // blue
  "rgba(232, 93, 117, 0.45)",   // coral
  "rgba(234, 230, 223, 0.4)",   // beige
  "rgba(184, 233, 134, 0.45)",  // green
  "rgba(245, 166, 35, 0.45)",   // orange
];

/** Text overlay background — fully transparent */
const CARD_COLORS_OVERLAY = [
  "rgba(99, 102, 241, 0)",
  "rgba(232, 93, 117, 0)",
  "rgba(234, 230, 223, 0)",
  "rgba(184, 233, 134, 0)",
  "rgba(245, 166, 35, 0)",
];

const CARD_TOPICS = [
  { title: "Hábitos saludables",         desc: "En jornadas laborales exigentes", image: "" },
  { title: "Movimiento como regulación", desc: "El cuerpo como herramienta de bienestar", image: "" },
  { title: "Manejo del estrés",         desc: "Herramientas prácticas y aplicables", image: "" },
  { title: "Foco, energía y presencia",  desc: "Rendimiento sostenible en el trabajo", image: "" },
  { title: "Bienestar sostenible",       desc: "Sin extremos ni culpa", image: "" },
];

const CARD_CARTOONS = [
  "/cartoons/card-31-blue.webp",
  "/cartoons/card-32-salmon.webp",
  "/cartoons/card-34-white.webp",
  "/cartoons/card-30-green.webp",
  "/cartoons/card-33-yellow.webp",
];

function StackingCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  // Use scroll progress directly — spring can prevent animation from reaching final state
  const smoothProgress = scrollYProgress;

  const N = 5;
  // PX: pixel scale factor — compensates for switching from zoom:0.8 to font-size:80%.
  // All hard-coded px values are multiplied by this so the visual result stays identical.
  const PX = 0.8;
  const CARD_SCALE = 1.15;
  const OFF = Math.round(56 * CARD_SCALE * PX);
  const FINAL_YS = [0, 1 * OFF, 2 * OFF, 3 * OFF, (N - 1) * OFF];

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Animation completes at 88% scroll so cards reach final positions before section ends
  const ANIMATION_COMPLETE_AT = 0.88;

  // Curved path: cards start bottom-left, sweep right along arc into the stack.
  // Control point to the RIGHT of start → initial tangent points up-right → tilt right (train exiting a turn).
  // CTRL_Y must be above ALL final Ys (max stack offset) so every card approaches from above — avoids last card spin.
  const START_X = Math.round(-90 * CARD_SCALE * PX);  // Start left of center
  const START_Y = Math.round(880 * CARD_SCALE * PX);  // Start well below viewport so cards are hidden until animation begins
  const CTRL_X = 0;       // Control above destination → arc sweeps left-to-right, tangent starts up-right
  const CTRL_Y = Math.round(280 * CARD_SCALE * PX);  // Peak above final stack — all cards approach from above, no tangent reversal

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

    // Quadratic Bezier: P0=(start), P1=(ctrl), P2=(0, endY)
    const mt = 1 - t;
    const x = mt * mt * START_X + 2 * mt * t * CTRL_X + t * t * 0;
    const y = mt * mt * START_Y + 2 * mt * t * CTRL_Y + t * t * endY;

    // Tangent: B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
    const dx = 2 * mt * (CTRL_X - START_X) + 2 * t * (0 - CTRL_X);
    const dy = 2 * mt * (CTRL_Y - START_Y) + 2 * t * (endY - CTRL_Y);

    // Rotation = tangent angle (card faces direction of motion, train-on-track)
    // atan2(dx, -dy): 0 when moving straight up, positive when tilted right
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

  const CARD_W = Math.round(288 * CARD_SCALE * PX);
  const CARD_H = Math.round(288 * CARD_SCALE * PX);

  // Scroll target drives animation. Sticky lives in taller outer so it stays visible after animation completes.
  const SCROLL_HEIGHT = "228vh";   // 30% faster (was 325vh)
  const STICKY_HEIGHT = "298vh";   // 30% faster (was 425vh)

  return (
    <>
      {/* ── Mobile text header (above sticky animation) ── */}
      <div className="md:hidden px-6 py-14 bg-background">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue mb-4 block">Temas</span>
        <h2 className="text-3xl font-bold leading-tight text-foreground mb-3">Qué trabajo con los equipos</h2>
        <p className="text-foreground/60 text-[15px] leading-relaxed mb-6">
          El bienestar en el trabajo se construye con hábitos simples, sostenibles y humanos.
        </p>
        <Link
          href="/contacto/equipos"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue/25 transition-all duration-300 hover:bg-blue-dark"
        >
          Quiero una charla para mi equipo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* ── Stacking animation — all screen sizes ── */}
      <div style={{ height: STICKY_HEIGHT }} className="relative">
        <div
          ref={containerRef}
          style={{ height: SCROLL_HEIGHT }}
          className="relative pointer-events-none"
          aria-hidden
        />
        <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-background relative z-[2]" style={{ marginTop: `calc(-1 * ${SCROLL_HEIGHT})` }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center gap-6 md:grid md:grid-cols-2 md:gap-16 md:items-center">

            {/* Left: copy — desktop only (mobile shows text above the sticky zone) */}
            <div className="hidden md:block relative z-10">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue mb-5 block">
                Temas
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground mb-6">
                Qué trabajo con los equipos
              </h2>
              <p className="text-foreground/70 mb-4 text-base font-medium">
                Charlas y workshops enfocados en:
              </p>
              <p className="text-foreground/60 leading-relaxed max-w-md text-[15px] mb-6">
                El bienestar en el trabajo no se construye con beneficios aislados ni con charlas
                motivacionales que se olvidan al día siguiente. Se construye con hábitos simples,
                sostenibles y humanos.
              </p>
              <Link
                href="/contacto/equipos"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-4 transition-colors hover:text-blue-dark hover:underline md:text-base"
              >
                Quiero una charla para mi equipo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Cards wrapper — centered on mobile, right column on desktop */}
            <div className="relative flex items-center justify-center">
              <div
                className="relative"
                style={{ width: CARD_W, height: CARD_H + (N - 1) * OFF }}
              >
                {CARD_TOPICS.map((topic, i) => {
                  const isDark = CARD_IS_DARK.includes(CARD_COLORS[i]);
                  return (
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
                        backgroundColor: CARD_COLORS[i],
                        boxShadow: `0 ${12 + i * 6}px ${36 + i * 12}px ${CARD_GLOW_RGBA[i]}`,
                      }}
                      className={`rounded-3xl overflow-hidden flex flex-col justify-end relative ${
                        isDark ? "text-white" : "text-foreground"
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 z-0">
                        <Image
                          src={CARD_CARTOONS[i]!}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 88vw, 420px"
                          quality={Q.photo}
                          loading="lazy"
                        />
                      </div>
                      <div
                        className="absolute inset-0 z-[1] pointer-events-none"
                        style={{ background: `linear-gradient(to top, ${CARD_COLORS_DARK[i]} 0%, transparent 55%)` }}
                      />
                      <h3
                        className={`absolute top-6 font-bold leading-tight tracking-tight text-2xl md:text-3xl max-w-[85%] z-[2] ${
                          i === 2 ? "left-6 text-left" : "right-6 text-right"
                        }`}
                        style={{
                          color: i === 2 ? "rgba(55,65,81,0.95)" : "rgba(250,249,246,0.85)",
                          textShadow: i === 2 ? "0 0 2px rgba(255,255,255,0.3)" : "0 0 4px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.08)",
                        }}
                      >
                        {i === 0 ? <>Hábitos<br />saludables</> : i === 2 ? <>Manejo del<br />estrés</> : i === 4 ? <>Bienestar<br />sostenible</> : topic.title}
                      </h3>
                      <div className="p-5 flex flex-col gap-1.5 relative z-[2]" style={{ backgroundColor: CARD_COLORS_OVERLAY[i] }}>
                        <p className="text-[13px] leading-relaxed" style={{ color: i === 2 ? "rgba(55,65,81,0.9)" : "#faf9f6", textShadow: i === 2 ? "0 0 2px rgba(255,255,255,0.2)" : "0 0 3px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)" }}>
                          {topic.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Five-star rating (decorative)
// ─────────────────────────────────────────────────────────────────────────────
function FiveStars({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label="Valoración: 5 de 5 estrellas"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-amber-400 md:h-6 md:w-6"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE — light section with image + copy
// ─────────────────────────────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section className="relative flex h-screen max-h-[100dvh] w-screen shrink-0 items-center overflow-hidden bg-background text-foreground max-md:py-4">
      <BlobShape color="var(--blue)" size={300} className="-top-32 -right-32" opacity={0.08} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full max-md:max-h-full max-md:overflow-y-auto max-md:overflow-x-hidden">
        <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-2">
          <div className="max-md:min-h-0">
            <AnimatedSection>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-blue md:mb-3 md:text-sm">
                La experiencia
              </span>
              <h2 className="mb-3 text-2xl font-bold leading-[1.08] tracking-tight md:mb-4 md:text-5xl lg:text-6xl">
                Cómo se siente una charla{" "}
                <span className="italic font-light text-blue">Swap That</span>
              </h2>
              <FiveStars className="mb-3 md:mb-5" />
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="mb-3 space-y-1 text-sm leading-snug text-foreground/60 md:mb-5 md:space-y-2 md:text-lg md:leading-relaxed md:text-xl">
                <p>No es fitness corporativo.</p>
                <p>No es motivación vacía.</p>
                <p>No es &ldquo;tienes que&rdquo;.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="mb-2 text-sm text-foreground/70 md:mb-4 md:text-lg">Es un espacio donde:</p>
              <ul className="space-y-1.5 md:space-y-2.5">
                {[
                  "Se baja el ritmo",
                  "Se entiende el impacto de los hábitos",
                  "Herramientas simples y aplicables",
                  "Se sienten vistas, no exigidas",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 md:gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue md:mt-2" />
                    <span className="text-sm text-foreground/80 md:text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contacto/equipos"
                className="group mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue underline-offset-4 transition-colors hover:text-blue-dark hover:underline md:mt-6 md:text-base"
              >
                Charla para mi equipo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5 md:h-[18px] md:w-[18px]" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>

          {/* Image + quote */}
          <AnimatedSection direction="left">
            <div className="relative max-md:mx-auto max-md:w-[92%]">
              <div className="aspect-[4/3] max-h-[32vh] w-full max-w-md rounded-[1.15rem] overflow-hidden md:aspect-square md:max-h-[55vh] md:max-w-none md:rounded-[1.5rem]">
                <Image
                  src="/experience/charla.webp"
                  alt="Charla Swap That en acción"
                  width={480}
                  height={480}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 92vw, 480px"
                  quality={Q.photo}
                  loading="lazy"
                />
              </div>

              {/* Floating quote card */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -left-2 z-10 max-w-[9.5rem] rounded-lg border border-foreground/10 bg-background/95 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] md:-bottom-4 md:-left-4 md:max-w-[180px] md:rounded-xl md:p-4"
              >
                <p className="text-[0.65rem] font-medium leading-snug text-foreground md:text-xs">
                  &ldquo;Real, humano y práctico.&rdquo;
                </p>
                <p className="mt-1 text-[9px] text-foreground/40 md:mt-1.5 md:text-[10px]">— Participante</p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHARLA TESTIMONIALS — under “Cómo se siente una charla”, light band
// ─────────────────────────────────────────────────────────────────────────────
const CHARLA_TESTIMONIALS = [
  {
    quote:
      "Por fin una charla que no nos dejó con culpa. Herramientas concretas que el equipo sí usó después.",
    name: "Laura Méndez",
    role: "People & Culture · Fintech",
    image: "/instagram/ig-1.webp",
  },
  {
    quote:
      "El tono fue clave: cercano, sin postureo. Se nota que Andrea conoce cómo se vive el día a día en oficina.",
    name: "Diego Ríos",
    role: "Director de Operaciones · Retail",
    image: "/instagram/ig-2.webp",
  },
  {
    quote:
      "Llevábamos años de ‘wellness’ genérico. Esto se sintió diseñado para equipos reales, con ritmos reales.",
    name: "Ana Villar",
    role: "HR Business Partner · Consultoría",
    image: "/instagram/ig-3.webp",
  },
] as const;

/** Shorter lines for narrow horizontal-scroll panels */
const CHARLA_TESTIMONIALS_SHORT: readonly string[] = [
  "Sin culpa. Herramientas que el equipo sí usó después.",
  "Cercano y real: entiende el día a día en oficina.",
  "Diseñado para equipos reales, no discurso genérico.",
];

/** Asymmetric “strange” corners: TL, TR, BR, BL — not uniform squircles */
const TESTIMONIAL_CARD_SHAPES = [
  "rounded-[2.85rem_1.1rem_3.1rem_1.4rem]",
  "rounded-[1.2rem_3.25rem_1.35rem_2.6rem]",
  "rounded-[1.6rem_1.35rem_2.8rem_3rem]",
] as const;

function CharlaTestimonialsSection() {
  return (
    <section className="relative flex h-screen max-h-[100dvh] w-screen shrink-0 flex-col justify-center bg-background text-foreground max-md:justify-start max-md:overflow-y-auto max-md:overflow-x-hidden max-md:py-5">
      <BlobShape color="var(--coral)" size={240} className="-bottom-24 -left-16 max-md:opacity-[0.04]" opacity={0.06} />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-3 max-w-4xl md:mb-4">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-blue md:mb-3 md:text-sm">
              Historias de equipos
            </span>
            <h2 className="text-2xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
              Cuando la charla{" "}
              <span className="italic font-light text-blue">sí deja huella</span>
            </h2>
          </div>
          <p className="mb-3 max-w-3xl text-sm leading-snug text-foreground/50 md:mb-5 md:text-base md:leading-relaxed md:text-lg">
            <span className="md:hidden">Equipos de distintos sectores: menos discurso genérico, más conversación real.</span>
            <span className="hidden md:inline">
              Equipos de distintos sectores han compartido cómo se sintió el espacio: menos discurso genérico,
              más conversación honesta sobre hábitos, ritmo y regulación.
            </span>
          </p>
          <Link
            href="/contacto/equipos"
            className="group mb-5 inline-flex items-center gap-2 text-xs font-semibold text-blue underline-offset-4 transition-colors hover:text-blue-dark hover:underline md:mb-8 md:text-base"
          >
            Charla para mi equipo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5 md:h-[18px] md:w-[18px]" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
          {CHARLA_TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.name} delay={0.08 * i}>
              <article
                className={`flex flex-col border border-foreground/10 bg-background/90 p-4 md:p-6 ${
                  TESTIMONIAL_CARD_SHAPES[i] ?? TESTIMONIAL_CARD_SHAPES[0]
                }`}
              >
                <FiveStars className="mb-2 md:mb-4 [&_svg]:max-md:h-3.5 [&_svg]:max-md:w-3.5" />
                <blockquote className="flex flex-1 flex-col">
                  <p className="text-[0.8125rem] font-medium leading-snug text-foreground/85 md:text-base md:leading-relaxed md:text-lg">
                    <span className="md:hidden">&ldquo;{CHARLA_TESTIMONIALS_SHORT[i]}&rdquo;</span>
                    <span className="hidden md:inline">&ldquo;{t.quote}&rdquo;</span>
                  </p>
                </blockquote>
                <div className="mt-3 flex items-center gap-2 border-t border-foreground/10 pt-3 md:mt-5 md:gap-3 md:pt-5">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[1rem_0.6rem_0.8rem_0.7rem] ring-1 ring-blue/40 ring-offset-2 ring-offset-background md:h-11 md:w-11">
                    <Image
                      src={t.image}
                      alt=""
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                      quality={Q.thumb}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground md:text-base">{t.name}</p>
                    <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40 md:text-xs md:tracking-[0.14em]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO CLOUD — client logos under testimonials (background band + margins)
// ─────────────────────────────────────────────────────────────────────────────
function TrustedByLogoCloudSection() {
  return (
    <section className="relative flex h-screen max-h-[100dvh] w-screen shrink-0 items-center overflow-hidden bg-background px-4 py-8 md:min-h-0 md:px-10 md:py-12 lg:px-12">
      <div className="mx-auto w-full max-w-7xl translate-y-0 md:translate-y-[40px]">
        <div className="grid grid-cols-1 items-start gap-6 md:gap-10 lg:grid-cols-[7fr_3fr] lg:items-center lg:gap-10 xl:gap-12">
          {/* Left ~70%: title + logos (shifted left, modest scale) */}
          <div className="max-lg:translate-x-0 lg:-translate-x-7 xl:-translate-x-10">
            <h2 className="mb-4 text-center text-2xl leading-[1.08] tracking-tight md:mb-8 md:text-5xl lg:mb-8 lg:text-left lg:text-6xl xl:whitespace-nowrap">
              <span className="font-bold text-foreground not-italic">Algunos de </span>
              <span className="font-light italic text-blue">nuestros clientes</span>
            </h2>
            <div className="w-full origin-top scale-[0.92] rounded-[1.6rem] bg-background p-4 shadow-[0_6px_32px_rgba(0,0,0,0.05)] md:origin-left md:scale-100 md:rounded-[2.2rem] md:p-10 lg:max-w-none lg:-translate-x-2 lg:scale-[1.04] lg:p-9">
              <Image
                src="/home/clientes.webp"
                alt="Algunos de nuestros clientes"
                width={2376}
                height={908}
                className="mx-auto h-auto w-full max-w-full object-contain object-center"
                sizes="(max-width: 1280px) 75vw, 960px"
                quality={Q.hero}
                loading="eager"
              />
            </div>
          </div>

          {/* Right ~30%: stars + copy + CTA — right-aligned, nudged right */}
          <div className="flex flex-col items-center gap-3 text-center md:items-end md:gap-5 md:text-right lg:translate-x-4 lg:pl-6 xl:translate-x-7 xl:pl-10">
            <FiveStars className="justify-center md:justify-end" />
            <p className="max-w-md text-base font-semibold leading-snug text-foreground md:text-lg md:text-xl">
              Menos exigencia. Más estructura consciente.
            </p>
            <p className="max-w-md text-sm leading-snug text-foreground/80 md:text-base md:leading-relaxed md:text-[17px]">
              <span className="md:hidden">
                Charlas y talleres con la filosofía Swap That: hábitos y regulación que sí aplican en el trabajo.
              </span>
              <span className="hidden md:inline">
                Swap That for Teams son charlas y talleres que llevan la filosofía Swap That a tu empresa: movimiento,
                regulación, estrés y hábitos concretos—para equipos que quieren algo real, no otro tick de RR.HH.
              </span>
            </p>
            <Link
              href="/contacto/equipos"
              className="mt-1 inline-flex w-fit items-center justify-center gap-2 self-center rounded-full bg-blue px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_40px_rgba(99,102,241,0.25)] transition-colors hover:bg-blue-dark active:scale-[0.98] md:self-end md:px-8 md:py-4 md:text-base"
            >
              Quiero una charla para mi equipo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOR WHOM
// ─────────────────────────────────────────────────────────────────────────────
const FOR_WHOM_ITEMS: { image: string; content: ReactNode }[] = [
  {
    image: "/icons/presion.webp",
    content: (
      <>
        Trabajan bajo <strong className="font-bold text-foreground/85">presión</strong>.
      </>
    ),
  },
  {
    image: "/icons/equipo.webp",
    content: (
      <>
        Quieren <strong className="font-bold text-foreground/85">cuidar</strong> a su gente de forma{" "}
        <strong className="font-bold text-foreground/85">real</strong>.
      </>
    ),
  },
  {
    image: "/icons/perform.webp",
    content: (
      <>
        Entienden que <strong className="font-bold text-foreground/85">bienestar</strong> y{" "}
        <strong className="font-bold text-foreground/85">performance</strong> no son{" "}
        <strong className="font-bold text-foreground/85">opuestos</strong>.
      </>
    ),
  },
  {
    image: "/icons/saludable.webp",
    content: (
      <>
        Buscan <strong className="font-bold text-foreground/85">hábitos</strong> que se puedan{" "}
        <strong className="font-bold text-foreground/85">sostener</strong>.
      </>
    ),
  },
];

function ForWhomSection({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  return (
    <section ref={sectionRef} className="relative z-10 bg-transparent py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-[2]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — heading + subtext */}
          <AnimatedSection>
            <div className="lg:sticky lg:top-32">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue mb-5 block">
                ¿Es para tu equipo?
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-6">
                Para qué tipo de equipos es
              </h2>
              <p className="text-lg leading-relaxed text-white max-w-md">
                Swap That for Teams es para equipos que buscan algo real, no un beneficio más en la lista.
              </p>
            </div>
          </AnimatedSection>

          {/* Right — frosted bars are text-only; illustrations overlaid, alternating left / right */}
          <div className="flex flex-col gap-6 md:gap-7">
            {FOR_WHOM_ITEMS.map((item, i) => {
              const iconRight = i % 2 === 1;
              return (
                <div
                  key={i}
                  className={`relative overflow-visible py-1 ${i % 2 === 1 ? "lg:ml-12" : ""}`}
                >
                  <div
                    className={`relative z-[1] rounded-2xl border border-gray-light/50 bg-background/90 py-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm md:py-6 ${
                      iconRight
                        ? "px-5 pr-[8.5rem] pl-5 md:px-7 md:pr-[10.625rem] md:pl-7"
                        : "px-5 pl-[8.5rem] pr-5 md:px-7 md:pl-[10.625rem] md:pr-7"
                    }`}
                  >
                    <span className="text-[18px] font-medium leading-snug text-foreground/70">
                      {item.content}
                    </span>
                  </div>
                  <div
                    className={`pointer-events-none absolute top-1/2 z-[2] h-[8.925rem] w-[8.925rem] -translate-y-1/2 md:h-[10.2rem] md:w-[10.2rem] ${
                      iconRight
                        ? "right-0 translate-x-[18%] md:translate-x-[14%] -rotate-[5deg]"
                        : "left-0 -translate-x-[18%] md:-translate-x-[14%] rotate-[5deg]"
                    }`}
                    aria-hidden
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className={`object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.09)] ${iconRight ? "object-right" : "object-left"}`}
                      sizes="(max-width: 768px) 143px, 163px"
                      quality={Q.icon}
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const TEAMS_FAQ = [
  {
    q: "¿Qué es una charla Swap That for Teams y cómo se distingue de otras charlas de bienestar?",
    a: "Es un espacio vivo de conversación y práctica sobre hábitos, ritmo y regulación en el trabajo —sin motivación vacía ni discurso genérico. Se piensa para equipos reales, con presión real: menos “tenés que”, más comprensión y herramientas que se pueden usar el lunes.",
  },
  {
    q: "¿Cuánto dura una sesión y qué formato suele funcionar mejor?",
    a: "Lo habitual son bloques de entre 60 y 90 minutos, según el tamaño del grupo y el objetivo (charla única vs. serie corta). También se pueden diseñar workshops más largos o micro-sesiones si tu cultura funciona mejor con encuentros breves y recurrentes.",
  },
  {
    q: "¿Se puede hacer en remoto, presencial o híbrido?",
    a: "Sí. El contenido se adapta al canal: en remoto trabajamos pausas, dinámica y participación para que no sea “otra videollamada más”; presencial permite ir un poco más al cuerpo y al ritmo del grupo. Combinamos lo que encaje con tu oficina y tus franjas horarias.",
  },
  {
    q: "¿Hay un tamaño mínimo o máximo de equipo?",
    a: "No hay una cifra mágica: lo importante es que el espacio siga siendo conversación y no “auditorio”. Para grupos muy grandes se puede plantear una charla plenaria más somera o dividir en turnos/cocinas según necesidad.",
  },
  {
    q: "¿Necesitamos gimnasio, equipamiento o un nivel de fitness concreto?",
    a: "No. No es una clase deportiva ni una exigencia física. El foco es bienestar sostenible y aplicable a jornadas largas: movimiento como regulación, foco, energía y hábitos sin extremos.",
  },
  {
    q: "¿Qué pasa después de la charla? ¿Hay materiales o seguimiento?",
    a: "Se puede acordar un cierre con ideas o recursos para el día a día, y en algunos casos una segunda sesión o check-in breve para aterrizar lo vivido. En la primera conversación previa alineamos expectativas, tono y si queréis algo más documentado o más experiencial.",
  },
  {
    q: "¿Cómo empezamos si queremos llevar esto a nuestra empresa?",
    a: "Escribinos desde el formulario o el contacto indicado en la web. Contanos tamaño aproximado del equipo, si preferís remoto u onsite, ciudad/franja horaria y qué os gustaría que el grupo se llevara. Respondemos con una propuesta de formato y siguientes pasos.",
  },
];

function TeamsFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 scroll-mt-24 bg-transparent pt-12 pb-24 md:pt-16 md:pb-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-12 max-w-3xl md:mb-16">
            <div className="rounded-2xl border border-gray-light/50 bg-background/90 px-6 py-8 text-center shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm md:px-10 md:py-10">
              <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.2em] text-blue">
                Dudas habituales
              </span>
              <h2 className="mb-5 text-3xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[2.75rem]">
                Preguntas{" "}
                <span className="italic font-light text-blue">frecuentes</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray md:text-xl">
                Respuestas claras sobre formato, logística y qué podés esperar antes de reservar una charla para tu equipo.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <ul className="mx-auto max-w-3xl list-none space-y-3 md:space-y-4" role="list">
          {TEAMS_FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const headerId = `faq-header-${i}`;
            return (
              <li key={item.q} className="list-none">
                <AnimatedSection delay={Math.min(i, 5) * 0.05}>
                  <div className="overflow-hidden rounded-2xl border border-foreground/10 shadow-[0_2px_20px_rgba(26,26,26,0.05)]">
                    <h3 className="m-0 text-base font-semibold md:text-lg">
                      <button
                        type="button"
                        id={headerId}
                        className="flex w-full items-center justify-between gap-4 bg-background/85 p-6 text-left text-foreground backdrop-blur-md transition-colors hover:bg-background/95 md:p-7"
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                      >
                        <span className="pr-2 leading-snug">{item.q}</span>
                        <motion.span
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-background/80 text-blue backdrop-blur-sm"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          aria-hidden
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={headerId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-foreground/10 bg-background px-6 pb-6 md:px-7 md:pb-7">
                            <p className="pt-5 text-base leading-relaxed text-gray md:text-[17px]">{item.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              </li>
            );
          })}
        </ul>

        <AnimatedSection delay={0.15}>
          <p className="mx-auto mt-12 max-w-3xl text-center text-sm leading-relaxed text-white md:mt-14">
            ¿No encontrás lo que buscás?{" "}
            <Link href="/contacto/equipos" className="font-semibold text-white underline-offset-4 hover:underline">
              Escribinos
            </Link>{" "}
            y lo vemos en una conversación corta.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────────────────────
function CTASection({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-transparent py-28 md:py-40"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-[2]">
        <div className="relative rounded-[2.5rem] border border-gray-light/60 bg-background/95 px-8 py-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-sm md:px-16 md:py-20 lg:px-20">
          {/* Decorative corner marks */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-blue/20 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-blue/20 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-blue/20 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-blue/20 rounded-br-lg" />

          <div className="text-center">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-6">
                Equipos regulados{" "}
                <span className="gradient-text-blue italic">trabajan mejor</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="w-16 h-px bg-blue/30 mx-auto mb-8" />
              <p className="text-xl text-gray max-w-2xl mx-auto leading-relaxed mb-12">
                Personas cuidadas toman mejores decisiones. Lleva la filosofía Swap That a tu equipo.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link
                href="/contacto/equipos"
                className="group inline-flex items-center justify-center gap-3 bg-blue text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-blue-dark transition-all duration-300 shadow-[0_10px_40px_rgba(99,102,241,0.25)]"
              >
                Quiero una charla para mi equipo
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
function ServicesPreview() {
  return (
    <section className="py-28 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-[2]">
        <AnimatedSection>
          <div className="text-center mb-20">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gray mb-4 block">
              También
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1] tracking-tight">
              Diseño sistemas para crecer —{" "}
              <br className="hidden md:block" />
              en marcas y en personas.
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Marketing card — spans 3 cols, landscape */}
          <AnimatedSection delay={0.1} className="md:col-span-3">
            <Link href="/contacto/marketing#formulario" className="group block h-full">
              <div className="relative h-full bg-background/95 backdrop-blur-sm rounded-[2rem] p-10 md:p-12 border border-coral/15 hover:border-coral/30 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-1 h-24 bg-gradient-to-b from-coral to-coral/0 rounded-full" />

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-coral/8 border border-coral/10 flex items-center justify-center mb-6 text-coral">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                    <path d="M12 22.08V12" />
                  </svg>
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral/70 mb-3 block">Para marcas</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Marketing & Performance</h3>
                <p className="text-gray leading-relaxed mb-8 max-w-sm">Estrategia, contenido y Meta Ads para crecer con orden y resultados reales.</p>
                <span className="inline-flex items-center gap-2 text-coral font-semibold text-sm group-hover:gap-3 transition-all">
                  Explorar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </AnimatedSection>

          {/* Coaching card — spans 2 cols, portrait */}
          <AnimatedSection delay={0.2} className="md:col-span-2">
            <Link href="/contacto/sistema#formulario" className="group block h-full">
              <div className="relative h-full bg-background/95 backdrop-blur-sm rounded-[2rem] p-10 md:p-12 border border-blue/15 hover:border-blue/30 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-1 h-24 bg-gradient-to-b from-blue to-blue/0 rounded-full" />

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-blue/8 border border-blue/10 flex items-center justify-center mb-6 text-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue/70 mb-3 block">Para personas</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Swap That System</h3>
                <p className="text-gray leading-relaxed mb-8">Entrenamiento, hábitos y mindset para mujeres activas. A tu ritmo, sin presión.</p>
                <span className="inline-flex items-center gap-2 text-blue font-semibold text-sm group-hover:gap-3 transition-all">
                  Explorar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const droneSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement | null>(null);
  const forWhomSectionRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <SistemaLandingHero />
      <MarqueeBanner />

      <div className="relative">
        <StackingCardsSection />
      </div>

      <HorizontalScroll>
        <ExperienceSection />
        <CharlaTestimonialsSection />
        <TrustedByLogoCloudSection />
      </HorizontalScroll>

      {/* Drone line — SVG above white base, below section content (z-0 → z-5 → z-10) */}
      <div ref={droneSectionRef} className="relative z-[1]">
        <div className="pointer-events-none absolute inset-0 z-0 bg-background" aria-hidden />
        <ScrollDrawLine
          scrollTargetRef={droneSectionRef}
          scrollStartAnchorRef={forWhomSectionRef}
          scrollEndAnchorRef={ctaSectionRef}
          containerWidth="min(56rem, calc(100% - 2.5rem))"
          geometryScale={2.645}
          geometryScaleOrigin={{ x: 475, y: 850 }}
          endTip={{ cx: 500, cy: 1680, rx: 56, ry: 8 }}
          scrollAdvancePx={0}
          progressDivisor={1.3}
          path={`
            M 100 0
            C 400 60, 700 100, 950 40
            C 1100 -20, 900 180, 600 300
            C 200 450, -50 350, 100 500
            C 350 650, 800 580, 900 700
            C 1000 820, 600 900, 300 950
            C 0 1000, -50 1100, 200 1200
            C 450 1300, 900 1250, 950 1400
            C 750 1580, 200 1720, 400 1880
            C 520 1880, 480 1720, 500 1680
          `}
          viewBox="-800 -1100 2900 4300"
          thickness={238}
        />
        <ForWhomSection sectionRef={forWhomSectionRef} />
        <TeamsFaqSection />
        <CTASection sectionRef={ctaSectionRef} />
        {/* <ServicesPreview /> — hidden for now */}
      </div>
    </>
  );
}
