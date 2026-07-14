"use client";

import Link from "next/link";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { getSwapThatAppHref } from "@/lib/swapThatAppUrl";

/** Returns the correct contact page based on the current route. */
function useContactHref() {
  const pathname = usePathname();
  if (pathname?.startsWith("/marketing")) return "/contacto/marketing";
  if (pathname?.startsWith("/sistema")) return "/contacto/sistema";
  return "/contacto/equipos";
}

const INSTAGRAM_URL = "https://www.instagram.com/mueveteconandrea/";

const FOOTER_IMAGES = [
  "/instagram/ig-1.webp",
  "/instagram/ig-2.webp",
  "/instagram/ig-3.webp",
  "/instagram/ig-4.webp",
];

const shapeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const contactHref = useContactHref();
  const swapThatAppHref = getSwapThatAppHref();

  return (
      <footer ref={ref} className="relative z-10 bg-foreground overflow-hidden p-2.5 md:p-3">
      {/* ═══ Desktop: bold geometric shape grid (10% smaller) ═══ */}
      <div className="hidden md:grid grid-cols-6 gap-2.5 md:gap-3 mb-2.5 md:mb-3"
        style={{ gridTemplateRows: "clamp(122px, 12.2vw, 179px) minmax(clamp(122px, 12.2vw, 179px), auto)" }}
      >
        {/* Brand pill — spans both rows */}
        <motion.div
          variants={shapeVariants} custom={0}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="col-span-1 row-span-2 bg-background rounded-[2rem] flex items-center justify-center select-none p-4"
        >
          <Link href="/" className="block -rotate-90">
            <Image
              src="/logo-horizontal-real.webp"
              alt="Muévete con Andrea"
              width={160}
              height={42}
              className="h-10 xl:h-12 w-auto object-contain"
              quality={Q.brand}
              loading="lazy"
            />
          </Link>
        </motion.div>

        {/* Orange circle — Swap That App (FitBudd) */}
        <motion.div
          variants={shapeVariants} custom={1}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
        >
          <Link
            href={swapThatAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full bg-amarillo rounded-full flex flex-col items-center justify-center px-1.5 text-center hover:brightness-[0.96] transition-colors"
          >
            <span className="text-foreground text-[11px] sm:text-sm lg:text-base font-bold leading-tight">Swap That App</span>
          </Link>
        </motion.div>

        {/* White wide — Coaching 1 on 1 (no arrow) */}
        <motion.div
          variants={shapeVariants} custom={2}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="col-span-3"
        >
          <Link
            href="/sistema"
            className="w-full h-full bg-background rounded-[2rem] flex items-center justify-center hover:brightness-[0.98] transition-colors"
          >
            <span className="text-foreground text-lg lg:text-2xl xl:text-3xl font-bold tracking-tight">
              Coaching 1-on-1
            </span>
          </Link>
        </motion.div>

        {/* Light green — arrow + Shop → contact funnel */}
        <motion.div
          variants={shapeVariants} custom={3}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
        >
          <Link
            href={contactHref}
            className="w-full h-full bg-verde-light rounded-full flex flex-col items-center justify-center gap-0.5 pt-0.5 pb-1 px-1 hover:brightness-[0.96] transition-colors"
          >
            <svg className="h-7 w-7 shrink-0 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-foreground text-base font-bold leading-none tracking-tight">Shop</span>
          </Link>
        </motion.div>

        {/* Image squares — 2×2, hover overlay + Instagram icon, links to @andreavpty */}
        <motion.div
          variants={shapeVariants} custom={4}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-2 min-w-0 relative group"
        >
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label="Ver Instagram de Andrea"
          />
          {FOOTER_IMAGES.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden relative bg-foreground/10">
              <Image src={src} alt="" fill className="object-cover" sizes="100px" quality={Q.thumb} loading="lazy" />
            </div>
          ))}
          {/* Dark overlay + Instagram icon on hover */}
          <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[1]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Blue — Teams & Charlas */}
        <motion.div
          variants={shapeVariants} custom={5}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="col-span-2"
        >
          <Link
            href="/"
            className="w-full h-full bg-blue rounded-[2rem] flex items-center justify-center hover:bg-blue-dark transition-colors"
          >
            <span className="text-black text-lg lg:text-2xl xl:text-3xl font-bold tracking-tight">
              Teams &amp; Charlas
            </span>
          </Link>
        </motion.div>

        {/* Coral — Marketing and Performance */}
        <motion.div
          variants={shapeVariants} custom={6}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="col-span-2"
        >
          <Link
            href="/marketing"
            className="w-full h-full bg-coral rounded-[2rem] flex items-center justify-center hover:bg-coral-dark transition-colors"
          >
            <span className="text-black text-lg lg:text-2xl xl:text-3xl font-bold tracking-tight">
              Marketing and Performance
            </span>
          </Link>
        </motion.div>
      </div>

      {/* ═══ Mobile: shape grid matching desktop character ═══ */}
      <div className="grid md:hidden gap-2.5 mb-2.5" style={{ gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto auto" }}>
        {/* Row 1: Orange circle | White (Coaching) | Green arrow */}
        <motion.div
          variants={shapeVariants} custom={0}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
        >
          <Link
            href={swapThatAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full bg-amarillo rounded-full flex flex-col items-center justify-center hover:brightness-[0.96] transition-colors aspect-square px-0.5"
          >
            <span className="text-foreground text-[10px] font-bold text-center leading-tight">Swap That App</span>
          </Link>
        </motion.div>

        <motion.div
          variants={shapeVariants} custom={1}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
        >
          <Link href="/sistema" className="w-full h-full bg-background rounded-[1.2rem] flex items-center justify-center hover:brightness-[0.98] transition-colors aspect-square">
            <span className="text-foreground text-xs font-bold text-center px-2 leading-tight">Coaching 1-on-1</span>
          </Link>
        </motion.div>

        <motion.div
          variants={shapeVariants} custom={2}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
        >
          <Link
            href={contactHref}
            className="w-full h-full bg-verde-light rounded-full flex flex-col items-center justify-center gap-0.5 pt-0.5 pb-1 px-0.5 hover:brightness-[0.96] transition-colors aspect-square"
          >
            <svg className="h-6 w-6 shrink-0 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-foreground text-xs font-bold leading-none tracking-tight">Shop</span>
          </Link>
        </motion.div>

        {/* Row 2: Blue (Teams) + Coral (Marketing) */}
        <motion.div
          variants={shapeVariants} custom={3}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="col-span-2"
        >
          <Link href="/" className="w-full h-full bg-blue rounded-[1.2rem] flex items-center justify-center hover:bg-blue-dark transition-colors py-5">
            <span className="text-black text-sm font-bold tracking-tight">Teams &amp; Charlas</span>
          </Link>
        </motion.div>

        {/* Instagram 2×2 grid (single cell, right) */}
        <motion.div
          variants={shapeVariants} custom={4}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-1 min-w-0 relative group row-span-1"
        >
          <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label="Ver Instagram" />
          {FOOTER_IMAGES.map((src, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden relative bg-foreground/10">
              <Image src={src} alt="" fill className="object-cover" sizes="60px" quality={Q.thumb} loading="lazy" />
            </div>
          ))}
          <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[1]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Row 3: Coral full-width */}
        <motion.div
          variants={shapeVariants} custom={5}
          initial="hidden" animate={isInView ? "visible" : "hidden"}
          className="col-span-3"
        >
          <Link href="/marketing" className="w-full h-full bg-coral rounded-[1.2rem] flex items-center justify-center hover:bg-coral-dark transition-colors py-5">
            <span className="text-black text-sm font-bold tracking-tight">Marketing and Performance</span>
          </Link>
        </motion.div>
      </div>

      {/* ═══ Bottom: large rounded info panel (15% bigger) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-cream rounded-[2rem] px-7 py-6 md:px-12 md:py-14 lg:px-[4.4rem]"
      >
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-16 max-md:gap-5">
          {/* Left: CTA headline + socials */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[1.7rem] font-black leading-[1.06] tracking-tight text-foreground md:text-[2.46rem] md:leading-[1.05] lg:text-[3.28rem]">
              ¿Lista para el cambio?
              <br />
              <span className="italic font-light">Empecemos hoy.</span>
            </h2>

            {/* Social icons */}
            <div className="flex gap-3 mt-5 md:mt-8">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-blue transition-colors"
                aria-label="Instagram @andreavpty"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-blue transition-colors"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.18 8.18 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-blue transition-colors"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            <p className="text-foreground/35 text-[0.7rem] mt-4 leading-snug md:mt-8 md:text-xs">
              © {new Date().getFullYear()} Muévete con Andrea — Andrea Vasquez. Todos los derechos reservados.
            </p>
          </div>

          {/* Right: nav links */}
          <div className="flex flex-col gap-5 md:gap-8 md:text-right shrink-0">
            <nav className="flex flex-col gap-2 md:gap-2.5">
              <Link href="/" className="text-foreground/60 text-sm font-bold uppercase tracking-wide hover:text-blue transition-colors">
                Home
              </Link>
              <Link href="/sistema" className="text-foreground/60 text-sm font-bold uppercase tracking-wide hover:text-foreground transition-colors">
                Coaching
              </Link>
              <Link href="/marketing" className="text-foreground/60 text-sm font-bold uppercase tracking-wide hover:text-coral transition-colors">
                Marketing
              </Link>
              <Link href="/" className="text-foreground/60 text-sm font-bold uppercase tracking-wide hover:text-blue transition-colors">
                Teams &amp; Charlas
              </Link>
            </nav>
            <nav className="flex flex-col gap-2">
              <span className="text-foreground/50 text-xs font-medium">hola@mueveteconandrea.com</span>
              <Link href="#" className="text-foreground/40 text-xs font-bold uppercase tracking-wide hover:text-foreground/70 transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="text-foreground/40 text-xs font-bold uppercase tracking-wide hover:text-foreground/70 transition-colors">
                Términos
              </Link>
            </nav>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
