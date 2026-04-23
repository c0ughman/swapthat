"use client";

import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import BlobShape from "@/components/BlobShape";
import Marquee from "@/components/Marquee";
import { DotGrid, StarBurst, AbstractShape } from "@/components/DecorativeSVGs";
import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { cartoon3dPath } from "@/lib/cartoonAssets";
import { FiveStars } from "@/components/FiveStars";
import { HERO_STICKER_SRCS, TeamsHomeHero } from "@/components/TeamsHomeHero";
import { TeamsPhilosophyOrbitSection } from "@/components/TeamsPhilosophyOrbitSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import { motion } from "framer-motion";
import { getSwapThatAppHref } from "@/lib/swapThatAppUrl";

/** Three-card block only — orange / lime / black (rest of page is monochrome). */
const CARD_ORANGE = "#f5a623";
const CARD_LIME = "#b8e986";

/** Match horizontal-scroll + bottom-of-page CTA scale (Sistema). */
const SISTEMA_CTA_ON_LIGHT = `group inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 sm:px-10 sm:py-5 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:bg-foreground/90 shadow-lg shadow-black/10`;
const SISTEMA_CTA_ON_DARK = `group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-medium transition-all duration-300 hover:bg-white/90 shadow-lg shadow-black/30`;

/** "Descarga la app" + footer — default FitBudd pack; override with `NEXT_PUBLIC_APP_DOWNLOAD_URL`. */
const SISTEMA_APP_DOWNLOAD_HREF = getSwapThatAppHref();

/** White page above → black band; mirrors bottom curve depth (viewBox + bulge). */
function SistemaPhilosophyTopCurve() {
  return (
    <div className="w-full shrink-0 leading-none" aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="block h-[5.5rem] w-full md:h-[7.5rem] lg:h-[8.5rem]"
      >
        <path fill="white" d="M0 0h1440v68Q720 140 0 68z" />
      </svg>
    </div>
  );
}

/** Black above → white at curve, then tapers to page off-white (matches `--background`) at the lower edge. */
function SistemaPhilosophyBottomCurve() {
  return (
    <div className="w-full shrink-0 leading-none" aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="block h-[5.5rem] w-full md:h-[7.5rem] lg:h-[8.5rem]"
      >
        <defs>
          <linearGradient
            id="sistema-philosophy-bottom-arc"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8f7f4" />
          </linearGradient>
        </defs>
        <path fill="url(#sistema-philosophy-bottom-arc)" d="M0 72 Q720 -56 1440 72 L1440 140 L0 140 Z" />
      </svg>
    </div>
  );
}

/** 3D cartoon — clock in “El problema” (marketing + sistema share `cartoon3dPath`). */
const CARTOON_CLOCK_SRC = cartoon3dPath("clock.png");

function ProblemSection() {
  return (
    <section className="py-14 md:py-32 relative">
      <BlobShape color="var(--foreground)" size={300} className="top-0 right-0" opacity={0.04} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="max-w-3xl">
            <AnimatedSection light>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground mb-4 block">
                El problema
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-8">
                No es que no seas{" "}
                <span className="italic font-light">disciplinada.</span>
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-gray leading-relaxed">
                <p>No es que seas perezosa. No es que &ldquo;no quieras lo suficiente&rdquo;.</p>
                <p>
                  La mayoría de los programas de fitness están diseñados para rutinas ideales,
                  no para vidas reales. Y cuando tu rutina cambia, el sistema falla… y tú te culpas.
                </p>
                <p className="text-foreground font-semibold text-2xl">
                  Swap That existe para cambiar eso.
                </p>
              </div>
              <div className="mt-8 sm:mt-10">
                <Link
                  href="/contacto/sistema#formulario"
                  className={SISTEMA_CTA_ON_LIGHT}
                >
                  Quiero empezar hoy
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <div className="relative -mx-2 mt-6 md:mt-0 h-[min(38vh,280px)] w-full max-w-xl shrink-0 justify-self-end md:h-[min(52vh,480px)] lg:mx-0 lg:h-[min(62vh,560px)] lg:max-w-none pointer-events-none select-none" aria-hidden>
            <Image
              src={CARTOON_CLOCK_SRC}
              alt=""
              fill
              className="object-contain object-right-top"
              sizes="(min-width: 1024px) 45vw, 92vw"
            />
          </div>
        </div>

        {/* Cards — black first, then footer orange & lime */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              text: "Entrenar no es hacerlo perfecto.",
              sub: "Es aprender a regularte.",
              bg: "#000000",
              border: "rgba(255,255,255,0.15)",
              iconWrap: "rgba(255,255,255,0.12)",
              star: "#ffffff",
              titleClass: "text-white",
              subClass: "text-white/75",
            },
            {
              text: "Aquí no se trata de exigirte más.",
              sub: "Se trata de sostenerte mejor.",
              bg: CARD_ORANGE,
              border: "rgba(0,0,0,0.12)",
              iconWrap: "rgba(0,0,0,0.12)",
              star: "var(--foreground)",
              titleClass: "text-foreground",
              subClass: "text-foreground/80",
            },
            {
              text: "Aquí no empiezas de cero.",
              sub: "Aquí retomas.",
              bg: CARD_LIME,
              border: "rgba(0,0,0,0.12)",
              iconWrap: "rgba(0,0,0,0.12)",
              star: "var(--foreground)",
              titleClass: "text-foreground",
              subClass: "text-foreground/80",
            },
          ].map((card, i) => (
            <AnimatedSection key={i} delay={0.08 * i} light>
              <div
                className="relative p-8 rounded-3xl border transition-all duration-500 group cursor-default"
                style={{
                  backgroundColor: card.bg,
                  borderColor: card.border,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full mb-6 flex items-center justify-center"
                  style={{ backgroundColor: card.iconWrap }}
                >
                  <StarBurst size={16} color={card.star} />
                </div>
                <p className={`text-xl font-bold mb-2 ${card.titleClass}`}>{card.text}</p>
                <p className={card.subClass}>{card.sub}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="pt-0 pb-0 bg-foreground text-background relative overflow-hidden">
      <SistemaPhilosophyTopCurve />
      <BlobShape color="#ffffff" size={400} className="-top-40 -right-40" opacity={0.06} />
      <BlobShape color="#ffffff" size={300} className="bottom-0 -left-20" opacity={0.05} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-32 pb-16 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <AnimatedSection light>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-background/50 mb-4 block">
                Filosofía
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-8">
                El fitness no tiene que{" "}
                <span className="italic font-light text-background">empujarte.</span>
                <br />
                Tiene que acompañarte.
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.1} light>
              <div className="space-y-4 text-lg text-background/60 leading-relaxed">
                <p>
                  Entrenar no es hacerlo perfecto. Es aprender a regularte, escucharte y volver a tu centro.
                </p>
                <p>
                  En Swap That no trabajamos con rigidez ni con castigo. Trabajamos con estructura flexible.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Language contrast */}
          <AnimatedSection direction="left" light>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10">
                <h4 className="text-sm font-semibold text-background mb-4 uppercase tracking-wider">Evitamos</h4>
                <ul className="space-y-3">
                  {['"debes"', '"toca"', '"no falles"', '"no te saltes"'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/35 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/30 mt-4">Porque la vida no funciona así.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10">
                <h4 className="text-sm font-semibold text-background mb-4 uppercase tracking-wider">Usamos</h4>
                <ul className="space-y-3">
                  {['"elige"', '"prueba"', '"si hoy puedes"', '"esto también cuenta"'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/50 mt-4">Porque entrenar no es cumplir. Es volver a ti.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center sm:mt-10 lg:justify-end">
              <Link
                href="/contacto/sistema#formulario"
                className={SISTEMA_CTA_ON_DARK}
              >
                Quiero empezar hoy
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <SistemaPhilosophyBottomCurve />
    </section>
  );
}

function WhatIsSection() {
  /** Mobile: no card/icon tilt; keeps spring entrance (y, scale) only. */
  const [noTilt, setNoTilt] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNoTilt(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** `public/icons` webp — grayscale in UI; chosen to loosely match each line. */
  const features = [
    {
      iconSrc: "/icons/sistema.webp",
      title: "Programas pregrabados y estructurados",
      desc: "Entrenamiento diseñado para tu vida real.",
    },
    {
      iconSrc: "/icons/estrategia.webp",
      title: "Opciones según tu energía",
      desc: "Alta, media o baja — siempre hay un camino.",
    },
    {
      iconSrc: "/icons/saludable.webp",
      title: "Movimiento consciente",
      desc: "Fuerza y movilidad con intención.",
    },
    {
      iconSrc: "/icons/mensaje.webp",
      title: "Mindset y hábitos",
      desc: "Que acompañan, no presionan.",
    },
    {
      iconSrc: "/icons/medible.webp",
      title: "Constancia imperfecta",
      desc: "Un enfoque pensado para lo real.",
    },
  ];

  /** Light vertical stagger — child wrapper avoids clashing with Framer `y`. */
  const floatYClass = [
    "-translate-y-1 md:-translate-y-2 lg:-translate-y-3",
    "translate-y-1 md:translate-y-2 lg:translate-y-4",
    "-translate-y-0.5 md:-translate-y-1 lg:-translate-y-2",
    "translate-y-1.5 md:translate-y-3 lg:translate-y-4",
    "-translate-y-1 md:-translate-y-2 lg:-translate-y-3",
  ];

  /** Subtle resting tilt (deg) after entrance — desktop only; mobile uses `noTilt`. */
  const restRotateZ = [-2.25, 2.5, -1.75, 2.25, -2] as const;

  /** Per-icon nudge + twist (desktop; mobile is undecorated). */
  const iconPoseClass = [
    "-translate-x-0.5 -rotate-6 sm:-translate-x-1",
    "translate-x-0.5 rotate-5 sm:translate-x-1",
    "-translate-y-0.5 -rotate-3",
    "translate-y-1 rotate-6",
    "-translate-x-1 rotate-[-4deg] sm:-translate-x-1.5",
  ];
  const iconBaseClass =
    "h-14 w-14 shrink-0 object-contain grayscale sm:h-16 sm:w-16 md:h-[4.25rem] md:w-[4.25rem]";

  return (
    <section
      id="que-es"
      className="relative flex min-h-[100svh] flex-col justify-center py-14 md:py-20 lg:py-24"
    >
      <AbstractShape className="pointer-events-none absolute top-6 right-6 hidden opacity-[0.06] md:block lg:right-10" color="var(--foreground)" />

      <div className="mx-auto w-full max-w-[min(100%,90rem)] px-5 sm:px-6 lg:px-8">
        <AnimatedSection light>
          <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground sm:text-sm">
              El sistema
            </span>
            <h2 className="text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[2.85rem]">
              Qué es <span className="italic font-light">Swap That</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray sm:mt-5 sm:text-lg">
              Un sistema sostenible para crecer como persona a través del movimiento.
              No entrenas para castigarte. Entrenas para sentirte presente, fuerte y en paz.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 items-start gap-4 perspective-[1200px] sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="w-full transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
              initial={{
                opacity: 0,
                y: 72,
                scale: 0.78,
                rotateX: noTilt ? 0 : 14,
                rotateZ: noTilt ? 0 : (restRotateZ[i] ?? 0) * 1.6,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: noTilt ? 0 : restRotateZ[i] ?? 0,
              }}
              viewport={{ once: true, margin: "-12% 0px -12% 0px", amount: 0.1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 26,
                mass: 1.15,
                delay: i * 0.165,
              }}
            >
              <div className={`h-full ${noTilt ? "" : floatYClass[i] ?? ""}`}>
                <div className="group relative flex min-h-0 w-full flex-row items-start gap-3.5 rounded-2xl border border-white/10 bg-neutral-900 px-5 py-5 shadow-lg transition-all duration-300 hover:z-[1] hover:-translate-y-0.5 hover:border-white/15 hover:shadow-xl sm:gap-5 sm:px-6 sm:py-6 md:rounded-3xl md:gap-6 md:px-7 md:py-6">
                  <Image
                    src={feature.iconSrc}
                    alt=""
                    width={80}
                    height={80}
                    className={noTilt ? iconBaseClass : `${iconBaseClass} ${iconPoseClass[i] ?? ""}`}
                    quality={Q.icon}
                    sizes="(max-width: 640px) 56px, 68px"
                  />
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="mb-2 text-[0.96875rem] font-bold leading-[1.28] tracking-tight text-zinc-50 sm:text-[1.0625rem] md:text-[1.125rem]">
                      {feature.title}
                    </h3>
                    <p className="text-[0.71875rem] leading-relaxed text-zinc-500 sm:text-[0.8125rem] md:text-[0.875rem] md:leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-px origin-left scale-x-0 bg-white/20 transition-transform duration-300 group-hover:scale-x-100 sm:left-6 sm:right-6 md:left-7 md:right-7" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection light delay={0.2}>
          <div className="mt-10 flex justify-center sm:mt-12 md:mt-14">
            <Link
              href="/contacto/sistema#formulario"
              className={SISTEMA_CTA_ON_LIGHT}
            >
              Quiero empezar hoy
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/** Hero-style L at corner; sits outside the card, overlaid on the rounded border. */
const FOR_WHOM_CORNER_PX = 68;
const FOR_WHOM_TL_STICKERS: { src: string; className: string }[] = [
  { src: "/stickers/st-1aec-2.webp", className: "left-0 top-0 z-[3] -rotate-[5deg]" },
  { src: "/stickers/playful-smiley.webp", className: "left-[2.85rem] top-0 z-[2] rotate-[4deg] sm:left-[3rem]" },
  { src: "/stickers/ripe-apple.webp", className: "left-0 top-[2.85rem] z-[1] -rotate-[3deg] sm:top-[3rem]" },
];
const FOR_WHOM_TR_STICKERS: { src: string; className: string }[] = [
  { src: "/stickers/blueberry-cluster.webp", className: "right-0 top-0 z-[3] rotate-[5deg]" },
  { src: "/stickers/frothy-mug-floral.webp", className: "right-[2.85rem] top-0 z-[2] -rotate-[4deg] sm:right-[3rem]" },
  { src: "/stickers/wa-115225.webp", className: "right-0 top-[2.85rem] z-[1] rotate-[3deg] sm:top-[3rem]" },
];

function ForWhomSection() {
  return (
    <section className="relative overflow-x-clip overflow-y-visible py-14 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/50 to-transparent" />
      <BlobShape color="var(--foreground)" size={250} className="top-20 left-0" opacity={0.04} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-8 md:mb-16">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground mb-4 block">
              ¿Es para ti?
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight">
              Para quién es{" "}
              <span className="italic font-light">(y para quién no)</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* For you — L-cluster outside top-left of card (hero-style) */}
          <AnimatedSection delay={0.05} light>
            <div className="relative z-0 overflow-visible">
              <div
                className="pointer-events-none absolute -left-7.5 -top-7.5 z-10 h-[7.5rem] w-[7.5rem] sm:-left-8 sm:-top-8 sm:h-[8rem] sm:w-[8rem] hidden sm:block"
                aria-hidden
              >
                {FOR_WHOM_TL_STICKERS.map((s) => (
                  <div
                    key={s.src}
                    className={`absolute drop-shadow-[0_3px_10px_rgba(0,0,0,0.1)] ${s.className}`}
                    style={{ width: FOR_WHOM_CORNER_PX, height: FOR_WHOM_CORNER_PX }}
                  >
                    <Image
                      src={s.src}
                      alt=""
                      width={FOR_WHOM_CORNER_PX}
                      height={FOR_WHOM_CORNER_PX}
                      className="h-full w-full object-contain"
                      quality={Q.section}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="relative z-[1] rounded-3xl border border-gray-light/50 bg-white p-8 shadow-sm md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-foreground">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold">Swap That es para ti si:</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Quieres entrenar sin contar los días fallidos",
                    "Te gusta moverte, pero odias la rigidez",
                    "Viajas, trabajas mucho o tu rutina cambia seguido",
                    "Buscas consistencia sin perfección",
                    "Quieres sentirte bien en tu cuerpo y en tu cabeza",
                    "Quieres entrenar sin sentir que siempre vas tarde",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-foreground shrink-0" />
                      <span className="text-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* Not for you — L-cluster outside top-right */}
          <AnimatedSection delay={0.1} light>
            <div className="relative z-0 overflow-visible">
              <div
                className="pointer-events-none absolute -right-7.5 -top-7.5 z-10 h-[7.5rem] w-[7.5rem] sm:-right-8 sm:-top-8 sm:h-[8rem] sm:w-[8rem] hidden sm:block"
                aria-hidden
              >
                {FOR_WHOM_TR_STICKERS.map((s) => (
                  <div
                    key={s.src}
                    className={`absolute drop-shadow-[0_3px_10px_rgba(0,0,0,0.1)] ${s.className}`}
                    style={{ width: FOR_WHOM_CORNER_PX, height: FOR_WHOM_CORNER_PX }}
                  >
                    <Image
                      src={s.src}
                      alt=""
                      width={FOR_WHOM_CORNER_PX}
                      height={FOR_WHOM_CORNER_PX}
                      className="h-full w-full object-contain"
                      quality={Q.section}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="relative z-[1] rounded-3xl border border-gray-light/50 bg-white p-8 shadow-sm md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-foreground">
                    ✕
                  </div>
                  <h3 className="text-xl font-bold">No es para ti si:</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Buscas resultados extremos en poco tiempo",
                    "Necesitas motivación agresiva",
                    "Quieres que alguien te presione todos los días",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-foreground shrink-0" />
                      <span className="text-gray">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-gray-light pt-6">
                  <p className="font-semibold text-foreground">Aquí no empujamos. Aquí acompañamos.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/** Placeholder copy — replace with real testimonials when available. */
const GROWTH_FAKE_REVIEWS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "Texto de ejemplo: me gusta no sentir que voy atrasada todo el tiempo. (Aquí irá una reseña auténtica pronto.)",
    name: "Miembro 1",
    role: "Próximamente con nombre y contexto",
  },
  {
    quote:
      "Reseña provisional: el enfoque se siente humano, no punitivo. Sustituiremos esto por palabras reales de la comunidad.",
    name: "Miembro 2",
    role: "En revisión",
  },
  {
    quote:
      "Placeholder amable: constancia sin culpa. Actualizaremos con testimonios verificados en la siguiente ronda de contenido.",
    name: "Miembro 3",
    role: "Próximamente",
  },
];

/** Top-right L-shape over “Más que fitness” (hero-style corner, smaller). */
const GROWTH_TOPRIGHT_STICKER_PX = 88;
const GROWTH_TOPRIGHT_STICKERS: { src: string; className: string }[] = [
  { src: "/stickers/blueberry-cluster.webp", className: "right-0 top-0 z-[3] rotate-[6deg]" },
  { src: "/stickers/frothy-mug-floral.webp", className: "right-[4.9rem] top-0.5 z-[2] -rotate-[4deg] sm:right-[5.1rem]" },
  { src: "/stickers/wa-114932-2.webp", className: "right-0 top-[4.75rem] z-[1] rotate-[3deg] sm:top-[5rem]" },
];

function GrowthSection() {
  return (
    <section className="py-14 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Image */}
          <AnimatedSection direction="right" light>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gray-light/50 shadow-sm">
                <Image
                  src="/movement.webp"
                  alt="Movimiento y entrenamiento al aire libre"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  quality={Q.photo}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <DotGrid className="absolute -bottom-6 -right-6 hidden lg:block" cols={5} rows={5} />
            </div>
          </AnimatedSection>

          <div>
            <AnimatedSection light>
              <div className="relative min-h-0 sm:min-h-[8.5rem]">
                <div className="relative z-10 pr-0 sm:pr-[5.5rem] md:pr-[6.5rem]">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground mb-2 block">
                    Más que fitness
                  </span>
                  <FiveStars variant="section" />
                  <h2 className="text-4xl md:text-5xl font-bold leading-[1] tracking-tight mb-8">
                    Por qué entrenar te hace <span className="italic font-light">crecer</span>
                  </h2>
                </div>
                <div
                  className="pointer-events-none absolute -right-2 top-0 z-0 h-[12rem] w-[14rem] max-w-[min(100%,18rem)] overflow-visible sm:right-0 sm:h-[13rem] sm:w-[16rem] translate-x-6 -translate-y-4 hidden sm:block"
                  aria-hidden
                >
                  {GROWTH_TOPRIGHT_STICKERS.map((s) => (
                    <div
                      key={s.src}
                      className={`absolute drop-shadow-[0_3px_10px_rgba(0,0,0,0.1)] ${s.className}`}
                      style={{ width: GROWTH_TOPRIGHT_STICKER_PX, height: GROWTH_TOPRIGHT_STICKER_PX }}
                    >
                      <Image
                        src={s.src}
                        alt=""
                        width={GROWTH_TOPRIGHT_STICKER_PX}
                        height={GROWTH_TOPRIGHT_STICKER_PX}
                        className="h-full w-full object-contain"
                        quality={Q.section}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.05} light>
              <p className="text-lg text-gray mb-8 leading-relaxed">
                El fitness bien diseñado no solo cambia tu cuerpo. Te enseña a:
              </p>
            </AnimatedSection>

            <div className="space-y-4">
              {[
                "Regularte en lugar de exigirte",
                "Confiar en ti y en tu proceso",
                "Estar presente",
                "Avanzar incluso con altibajos",
              ].map((item, i) => (
                <AnimatedSection key={i} delay={0.1 + i * 0.05} light>
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-black/[0.04] transition-colors duration-300 group">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-background bg-foreground transition-colors duration-300 group-hover:bg-foreground/85">
                      {i + 1}
                    </div>
                    <p className="text-lg">{item}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.35} light>
              <p className="text-gray mt-8 leading-relaxed">
                Eso se traduce en cómo trabajas, cómo decides y cómo te relacionas contigo.{" "}
                <span className="text-foreground font-semibold">Entrenar también es crecer.</span>
              </p>
            </AnimatedSection>
          </div>
        </div>

        <AnimatedSection delay={0.2} light>
          <div className="mt-14 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-5 lg:mt-20">
            {GROWTH_FAKE_REVIEWS.map((t) => (
              <div
                key={t.name}
                className="flex min-h-[16rem] flex-col rounded-2xl border border-foreground/8 bg-white p-6 py-7 shadow-sm sm:min-h-[17.5rem] md:min-h-[18rem]"
              >
                <FiveStars />
                <p className="mt-2.5 flex-1 text-[13px] font-medium italic leading-snug text-foreground/70">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/35">
                  — {t.name} · {t.role}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/** One cartoon per horizontal step (app → front → stairs → vacation); `run` is on the final CTA panel. */
const HOW_IT_WORKS_CARTOONS = [
  cartoon3dPath("app.png"),
  cartoon3dPath("front.png"),
  cartoon3dPath("stairs.png"),
  cartoon3dPath("vacation.png"),
] as const;

/** Floating bubbles on the “Eliges cómo entrenar” slide — spread over the figure (can overlap art). */
// Wider h (~17–83%) and taller v (~30–72%) so the set breathes; still anchored on the 3D render.
const CHOICE_BUBBLE_ICONS: { key: string; className: string; node: ReactNode }[] = [
  {
    key: "modal",
    className: "left-1/2 top-[30%] z-[2] -translate-x-1/2 -translate-y-1/2",
    node: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="4" y="3" width="16" height="12" rx="1.2" className="opacity-25" fill="currentColor" />
        <rect x="2" y="5" width="16" height="12" rx="1.2" className="fill-foreground" fillOpacity="0.08" />
        <line x1="2" y1="7.5" x2="18" y2="7.5" />
        <circle cx="4.2" cy="6.2" r="0.5" className="fill-foreground" />
        <line x1="5" y1="10" x2="14" y2="10" className="opacity-30" />
        <line x1="5" y1="12" x2="11" y2="12" className="opacity-25" />
        <line x1="5" y1="14" x2="12" y2="14" className="opacity-20" />
      </svg>
    ),
  },
  {
    key: "alta",
    className: "left-[17%] top-[46%] z-[2] -translate-x-1/2 -translate-y-1/2",
    node: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M13 2L3 14h5.5L8 22l9.5-11.5H12L13 2z" fillOpacity="0.18" />
        <path d="M13 2L3 14h5.5L8 22l9.5-11.5H12L13 2z" fill="none" />
      </svg>
    ),
  },
  {
    key: "media",
    className: "left-[83%] top-[50%] z-[2] -translate-x-1/2 -translate-y-1/2",
    node: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <rect x="4" y="12" width="3.5" height="8" rx="0.5" className="opacity-40" />
        <rect x="10.25" y="7" width="3.5" height="13" rx="0.5" className="opacity-60" />
        <rect x="16.5" y="10" width="3.5" height="10" rx="0.5" className="opacity-30" />
      </svg>
    ),
  },
  {
    key: "baja",
    className: "left-[30%] top-[66%] z-[2] -translate-x-1/2 -translate-y-1/2",
    node: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
  {
    key: "elegir",
    className: "left-[70%] top-[72%] z-[2] -translate-x-1/2 -translate-y-1/2",
    node: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1" className="opacity-80" />
        <rect x="14" y="3" width="7" height="7" rx="1" className="opacity-50" />
        <rect x="3" y="14" width="7" height="7" rx="1" className="opacity-30" />
        <rect x="14" y="14" width="7" height="7" rx="1" className="opacity-20" />
      </svg>
    ),
  },
];

function HowItWorksChoiceBubbles() {
  return (
    <ul
      className="pointer-events-none absolute inset-0 z-20 m-0 list-none p-0"
      role="presentation"
    >
      {CHOICE_BUBBLE_ICONS.map((b, i) => (
        <li key={b.key} className={`absolute ${b.className}`}>
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/10 bg-white/90 text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:h-12 sm:w-12"
            initial={false}
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 3.2 + i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.25,
            }}
            aria-hidden
          >
            {b.node}
          </motion.div>
        </li>
      ))}
    </ul>
  );
}

/** Top-right horizontal row above “Cuatro pasos…” in ¿Cómo funciona? */
const HOW_HEADER_STICKER_PX = 80;
const HOW_HEADER_STICKERS: { src: string; className: string }[] = [
  { src: "/stickers/st-1aec-2.webp", className: "right-0 top-0 z-[3] rotate-0" },
  { src: "/stickers/blueberry-cluster.webp", className: "right-[4.6rem] top-0 z-[2] rotate-0 sm:right-[4.9rem]" },
  { src: "/stickers/wa-115225.webp", className: "right-[9.2rem] top-0 z-[1] rotate-0 sm:right-[9.8rem]" },
];

function HowItWorksSection() {
  /** Horizontal scroll panels — black/white/gray only (accent cards live in ProblemSection). */
  const steps = [
    {
      num: "01",
      title: "Te unes a Swap That",
      desc: "Accedes al sistema completo dentro de la app.",
      bg: "#ffffff",
    },
    {
      num: "02",
      title: "Eliges cómo entrenar",
      desc: "Según cómo estás hoy — alta, media o baja energía.",
      bg: "#f5f5f5",
    },
    {
      num: "03",
      title: "Avanzas a tu ritmo",
      desc: "Con estructura que te sostiene, no que te presiona.",
      bg: "#ffffff",
    },
    {
      num: "04",
      title: "Retomas cuando quieras",
      desc: "No hay horarios obligatorios. No hay castigo por pausar.",
      bg: "#f5f5f5",
    },
  ];

  return (
    <section className="relative bg-white">
      {/* ── Section header — scrolls past before the sticky horizontal section takes over ── */}
      <div className="relative overflow-x-clip overflow-y-visible bg-white px-6 pb-10 pt-16 md:pt-32 md:pb-16 lg:px-8">
        <AbstractShape className="absolute -top-10 -left-10" color="var(--foreground)" />
        <div className="max-w-7xl mx-auto">
          <AnimatedSection light>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground mb-4 block">
              Proceso
            </span>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight">
                ¿Cómo funciona?
              </h2>
              <div className="relative w-full max-w-sm shrink-0 self-stretch">
                <div
                  className="pointer-events-none absolute right-0 top-0 z-0 h-[5.5rem] w-[16rem] max-w-[min(100%,17rem)] translate-x-2 -translate-y-1.5 sm:w-[17rem] sm:translate-x-2.5 sm:-translate-y-1 hidden sm:block"
                  aria-hidden
                >
                  {HOW_HEADER_STICKERS.map((s) => (
                    <div
                      key={s.src}
                      className={`absolute drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${s.className}`}
                      style={{ width: HOW_HEADER_STICKER_PX, height: HOW_HEADER_STICKER_PX }}
                    >
                      <Image
                        src={s.src}
                        alt=""
                        width={HOW_HEADER_STICKER_PX}
                        height={HOW_HEADER_STICKER_PX}
                        className="h-full w-full object-contain"
                        quality={Q.section}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <p className="relative z-10 max-w-sm pt-0 pr-0 text-lg leading-relaxed text-gray sm:pr-1 sm:pt-[5.5rem]">
                  Cuatro pasos. Sin complicar. Sin presión.{" "}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    Desliza para ver
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Horizontal scroll — 4 step panels (~50vw each) + 1 full-width CTA ── */}
      <HorizontalScroll className="bg-white">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative z-0 flex h-full min-h-0 flex-shrink-0 flex-col overflow-visible pt-16 max-md:pt-28 px-8 pb-12 sm:px-12 md:px-16 lg:px-20"
            style={{
              width: "50vw",
              minWidth: "300px",
              backgroundColor: step.bg,
              borderRight: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Step number — small label, top-left */}
            <span className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray">
              {step.num}
            </span>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.05] tracking-tight mb-4 max-w-xs">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-base md:text-lg text-gray leading-relaxed max-w-[22rem]">
              {step.desc}
            </p>

            {/* 3D cartoon — ~1.17× (10% under prior 1.3×); CTA uses its own layout */}
            <div className="relative z-10 mt-auto flex min-h-0 flex-1 items-end justify-center overflow-visible pt-10 max-md:pt-16 lg:justify-end">
              <div className="relative h-[min(57vh,630px)] w-full min-h-[300px] max-w-[min(100%,660px)] overflow-visible">
                <div className="absolute inset-0 origin-bottom scale-[1.17] will-change-transform">
                  <Image
                    src={HOW_IT_WORKS_CARTOONS[i]!}
                    alt=""
                    fill
                    className={i === 1 ? "object-contain object-bottom z-0" : "object-contain object-bottom"}
                    sizes="(min-width: 768px) 55vw, 92vw"
                  />
                </div>
                {i === 1 ? <HowItWorksChoiceBubbles /> : null}
              </div>
            </div>
          </div>
        ))}

        {/* ── CTA Panel — full viewport width, dark background + run cartoon (right) ── */}
        <div
          className="relative h-full flex-shrink-0 flex flex-col items-center justify-start overflow-x-clip overflow-y-auto gap-6 px-8 pt-10 max-md:pt-[146px] max-md:pb-10 max-md:gap-8 pb-8 text-center md:px-12 md:gap-10 md:pt-16 md:pb-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-14 lg:py-12 lg:text-left lg:overflow-hidden"
          style={{ width: "100vw", backgroundColor: "#000000" }}
        >
          <BlobShape color="#ffffff" size={400} className="-top-20 -right-20" opacity={0.06} />
          <BlobShape color="#ffffff" size={300} className="bottom-0 -left-20" opacity={0.05} />

          <div className="relative z-10 w-full max-w-lg shrink-0 lg:mx-0">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 block md:mb-6">
              Ahora ya sabes cómo funciona
            </span>

            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 md:mb-6 text-white">
              Tu siguiente paso{" "}
              <br />
              <span className="italic font-light text-white">es el primero.</span>
            </h3>

            <p className="text-base md:text-lg text-white/55 leading-relaxed mb-6 md:mb-10 max-w-sm mx-auto lg:mx-0">
              No hay momento perfecto para empezar. Solo hay el momento en que decides — o retomas.
            </p>

            <Link
              href="/contacto/sistema"
              className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-medium transition-all duration-300 hover:bg-white/90 shadow-lg shadow-black/30"
            >
              Quiero empezar hoy
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <p className="text-white/30 text-sm mt-6 md:mt-8 leading-relaxed">
              Sin compromisos forzados. Sin horarios rígidos. Sin presión.
            </p>
          </div>

          <div
            className="relative z-[5] h-[min(38vh,340px)] w-full min-h-[200px] max-w-xl shrink-0 max-md:mt-4 md:h-[min(52vh,560px)] lg:h-[min(88vh,900px)] lg:min-h-0 lg:w-[min(54vw,760px)] lg:max-w-[min(54vw,760px)] md:mt-0 pointer-events-none select-none"
            aria-hidden
          >
            <Image
              src={cartoon3dPath("run.png")}
              alt=""
              fill
              className="object-contain object-right"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
        </div>
      </HorizontalScroll>
    </section>
  );
}

const CTA_STICKER_ARC_PX = 76;

/** Deterministic 0..1 from index+channel (stable across SSR, feels random). */
function ctaStickerRnd01(i: number, channel: number) {
  const v = Math.sin((i + 1) * 12.9898 + channel * 78.233 + 34.45 * (channel + i)) * 43417.53;
  return v - Math.floor(v);
}

/** Fixed decimals so server/client serialize identical `style` (avoids hydration drift). */
function ctaRound6(n: number) {
  return Math.round(n * 1e6) / 1e6;
}

function CTASection() {
  const nArc = HERO_STICKER_SRCS.length;
  return (
    <section
      id="cta"
      className="relative overflow-x-clip overflow-y-visible py-14 pb-16 max-md:pb-7 md:py-32 md:pb-32"
    >
      <BlobShape color="var(--foreground)" size={400} className="-top-40 right-0" opacity={0.04} />
      <BlobShape color="var(--foreground)" size={300} className="bottom-0 left-0" opacity={0.04} />

      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <AnimatedSection light>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight mb-6">
            Entrenar puede ser tu lugar de <span className="italic font-light">paz</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.05} light>
          <p className="text-lg md:text-xl text-gray max-w-2xl mx-auto leading-relaxed mb-10">
            Entrenar no debería ser otra fuente de estrés. Debería ser el espacio donde sueltas y vuelves a ti.
            En Swap That te ayudo a crear ese espacio.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} light>
          <Link
            href="/contacto/sistema"
            className="group inline-flex items-center justify-center gap-3 bg-foreground text-background px-10 py-5 rounded-full text-lg font-medium hover:bg-foreground/90 transition-all duration-300 shadow-lg shadow-black/10"
          >
            Quiero empezar hoy
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

      <AnimatedSection delay={0.15} light>
        {/* Mobile: wrapped cluster, no horizontal scrollbar */}
        <div
          className="pointer-events-none relative z-[1] mt-5 w-full px-2 pb-0 pt-6 md:hidden"
          aria-hidden
        >
          <div className="relative mx-auto h-[5.5rem] w-full max-w-md sm:h-24">
            {/** Fewer stickers: one wavy (sine) row across the width */}
            {(
              [0, 2, 5, 8, 11, 14, 16, 18] as const
            ).map((srcIdx, i) => {
              const src = HERO_STICKER_SRCS[srcIdx]!;
              const n = 8;
              const t = n <= 1 ? 0.5 : i / (n - 1);
              const leftP = 3 + t * 92;
              const wave = Math.sin(t * Math.PI * 2.8);
              const topP = 50 + wave * 28;
              const sc = ctaRound6(0.9 + ctaStickerRnd01(srcIdx, 0) * 0.1);
              return (
                <div
                  key={`m-squiggle-${src}-${i}`}
                  className="absolute left-0 top-0 w-[52px] drop-shadow-[0_3px_8px_rgba(0,0,0,0.08)] [transform-origin:center_center]"
                  style={
                    {
                      zIndex: i + 1,
                      left: `${ctaRound6(leftP)}%`,
                      top: `${ctaRound6(topP)}%`,
                      transform: `translate(-50%, -50%) scale(${sc})`,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={src}
                    alt=""
                    width={CTA_STICKER_ARC_PX}
                    height={CTA_STICKER_ARC_PX}
                    className="h-full w-full object-contain"
                    sizes="52px"
                    quality={Q.section}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* sm+ (tablet/desktop): single arc row */}
        <div
          className="pointer-events-none relative z-[1] mt-10 hidden w-full max-w-6xl overflow-x-auto overflow-y-visible px-4 pt-14 pb-8 [scrollbar-width:thin] sm:mx-auto sm:mt-12 sm:max-w-7xl sm:px-6 sm:pt-16 sm:pb-1 md:mt-14 md:overflow-visible md:pt-0 md:block"
          aria-hidden
        >
          <div className="mx-auto flex w-max min-w-0 max-w-full flex-nowrap items-center justify-center gap-0 pb-4 sm:items-end sm:pb-1">
            {HERO_STICKER_SRCS.map((src, i) => {
              const t = nArc <= 1 ? 0.5 : i / (nArc - 1);
              const arcY = Math.sin(t * Math.PI) * 46;
              const baseRot = (t - 0.5) * 12;
              const r0 = ctaStickerRnd01(i, 0);
              const r1 = ctaStickerRnd01(i, 1);
              const r2 = ctaStickerRnd01(i, 2);
              const r3 = ctaStickerRnd01(i, 3);
              const r4 = ctaStickerRnd01(i, 4);
              const jx = (r0 - 0.5) * 24;
              const jy = (r1 - 0.5) * 20;
              const jRot = (r2 - 0.5) * 11;
              const jScale = 0.92 + r3 * 0.12;
              const negOverlap = 14 + (r4 - 0.5) * 8;
              const marginLeft = i > 0 ? ctaRound6(-negOverlap) : 0;
              const tx = ctaRound6(jx);
              const ty = ctaRound6(arcY + jy);
              const deg = ctaRound6(baseRot + jRot);
              const sc = ctaRound6(jScale);

              return (
                <div
                  key={`${src}-${i}`}
                  className="[transform-origin:center_85%] relative shrink-0 drop-shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
                  style={
                    {
                      zIndex: i,
                      marginLeft: i > 0 ? marginLeft : undefined,
                      transform: `translate(${tx}px, ${ty}px) rotate(${deg}deg) scale(${sc})`,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={src}
                    alt=""
                    width={CTA_STICKER_ARC_PX}
                    height={CTA_STICKER_ARC_PX}
                    className="h-[70px] w-[70px] object-contain sm:h-[76px] sm:w-[76px]"
                    sizes="(max-width:640px) 72px, 76px"
                    quality={Q.section}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

function MarqueeBanner() {
  return (
    <div className="py-6 bg-foreground text-background overflow-hidden">
      <Marquee
        items={[
          "Estructura flexible",
          "Sin culpa",
          "Sin presión",
          "A tu ritmo",
          "Constancia imperfecta",
          "Movimiento consciente",
          "Entrena para volver a ti",
        ]}
        className="text-sm font-medium tracking-wider uppercase opacity-60"
        speed={25}
      />
    </div>
  );
}

function ServicesPreview() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection light>
          <div className="text-center mb-16">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Marketing card */}
          <AnimatedSection delay={0.05} light>
            <Link href="/contacto/marketing#formulario" className="group block">
              <div className="relative bg-foreground/[0.03] rounded-3xl p-10 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/[0.06] rounded-bl-[4rem] transition-all duration-500 group-hover:w-40 group-hover:h-40" />
                <span className="relative text-sm font-semibold uppercase tracking-[0.2em] text-foreground mb-4 block">
                  Para marcas
                </span>
                <h3 className="relative text-2xl md:text-3xl font-bold mb-4">
                  Marketing & Performance
                </h3>
                <p className="relative text-gray mb-6">
                  Estrategia, contenido y Meta Ads para crecer con orden y resultados reales.
                </p>
                <span className="relative inline-flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
                  Explorar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </AnimatedSection>

          {/* Teams card */}
          <AnimatedSection delay={0.1} light>
            <Link href="/contacto/equipos#formulario" className="group block">
              <div className="relative bg-foreground/[0.03] rounded-3xl p-10 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/[0.06] rounded-bl-[4rem] transition-all duration-500 group-hover:w-40 group-hover:h-40" />
                <span className="relative text-sm font-semibold uppercase tracking-[0.2em] text-foreground mb-4 block">
                  Para equipos
                </span>
                <h3 className="relative text-2xl md:text-3xl font-bold mb-4">
                  Charlas & Workshops
                </h3>
                <p className="relative text-gray mb-6">
                  Hábitos saludables para equipos corporativos. Menos exigencia, más estructura consciente.
                </p>
                <span className="relative inline-flex items-center gap-2 font-medium text-foreground group-hover:gap-3 transition-all">
                  Explorar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
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

export default function SistemaPage() {
  return (
    <div className="bg-white min-h-screen">
      <TeamsHomeHero
        swapThatSystemHero
        contactHref="/contacto/sistema#formulario"
        secondaryHref={SISTEMA_APP_DOWNLOAD_HREF}
      />
      <TeamsPhilosophyOrbitSection sistemaVariant />
      <MarqueeBanner />
      <ProblemSection />
      <HowItWorksSection />
      <WhatIsSection />
      <PhilosophySection />
      <ForWhomSection />
      <GrowthSection />
      <CTASection />
      {/* <ServicesPreview /> — hidden for now */}
    </div>
  );
}
