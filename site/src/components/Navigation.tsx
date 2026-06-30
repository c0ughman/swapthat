"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCarouselTransition } from "@/components/CarouselTransition";

const MASK = {
  size: "contain" as const,
  repeat: "no-repeat" as const,
  position: "left center" as const,
};

/** PNG mask + solid fill — reliable across browsers; WebP masks often fail to paint. */
function LogoMaskSpan({ fill }: { fill: string }) {
  return (
    <span
      // Explicit width (not just aspect-ratio) — mobile Safari fails to derive the
      // intrinsic width of a masked span from height alone, collapsing it to 0px and
      // hiding the logo. The 240/67 ratio at h-2.4rem ≈ 8.6rem wide.
      className="block h-[2.4rem] w-[8.6rem] shrink-0 max-w-[min(100%,15rem)]"
      style={{
        backgroundColor: fill,
        WebkitMaskImage: "url(/av-logo-white.png)",
        maskImage: "url(/av-logo-white.png)",
        WebkitMaskSize: MASK.size,
        maskSize: MASK.size,
        WebkitMaskRepeat: MASK.repeat,
        maskRepeat: MASK.repeat,
        WebkitMaskPosition: MASK.position,
        maskPosition: MASK.position,
      }}
    />
  );
}

/** Contact / CTA: dedicated funnel for each line — used by the Explorar nav button. */
function explorarHrefForPathname(pathname: string): string {
  if (pathname.startsWith("/contacto/marketing")) return "/contacto/marketing#formulario";
  if (pathname.startsWith("/contacto/sistema")) return "/contacto/sistema#formulario";
  if (pathname.startsWith("/contacto/equipos")) return "/contacto/equipos#formulario";
  if (pathname === "/marketing" || pathname.startsWith("/marketing/")) return "/contacto/marketing#formulario";
  if (pathname === "/sistema" || pathname.startsWith("/sistema/")) return "/contacto/sistema#formulario";
  if (pathname === "/") return "/contacto/equipos#formulario";
  return "/contacto/equipos#formulario";
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { triggerTransition } = useCarouselTransition();

  const explorarHref = explorarHrefForPathname(pathname);

  function handleExplorarClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const pathPart = explorarHref.split("#")[0] || "/";
    const hash = explorarHref.includes("#") ? explorarHref.split("#")[1] : "";

    if (hash && pathPart === pathname) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      return;
    }

    router.push(explorarHref);
    setIsOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  /** Transparent nav sitting on a dark or saturated hero (blue home hero, sistema top band). */
  const navOverDarkHero =
    (pathname === "/sistema" && !scrolled) || (pathname === "/" && !scrolled) || (pathname === "/teams-alt" && !scrolled);

  const navLinks = [
    { href: "/", label: "Teams & Charlas", hoverColor: "blue" as const },
    { href: "/marketing", label: "Marketing & Performance", hoverColor: "coral" as const },
    { href: "/sistema", label: "Swap That System", hoverColor: "foreground" as const },
  ];

  // The nav uses plain <a> (custom router.push), so Next's automatic <Link>
  // prefetch never kicks in. Prefetch the main routes up front so switching
  // pages is instant instead of a cold load.
  useEffect(() => {
    for (const href of ["/", "/marketing", "/sistema"]) {
      if (href !== pathname) router.prefetch(href);
    }
  }, [pathname, router]);

  const isOnSistema = pathname === "/sistema";

  /** Route accent on hover (inactive links only). */
  function inactiveHoverAccent(link: (typeof navLinks)[0]): string {
    if (link.hoverColor === "coral") return "hover:text-coral";
    if (link.hoverColor === "foreground") return "hover:text-foreground";
    return "hover:text-blue";
  }

  /** Active link: same color on hover (no “second” hover state). */
  function activeHoverLock(link: (typeof navLinks)[0]): string {
    if (link.hoverColor === "coral") return "hover:text-coral";
    if (link.hoverColor === "foreground") return "hover:text-foreground";
    return "hover:text-blue";
  }

  function desktopLinkClass(link: (typeof navLinks)[0], isActive: boolean) {
    if (navOverDarkHero) {
      if (isActive) return "text-white hover:text-white";
      return `text-white/70 ${inactiveHoverAccent(link)}`;
    }
    if (isActive) {
      if (link.hoverColor === "coral") return `text-coral ${activeHoverLock(link)}`;
      if (link.hoverColor === "foreground") return `text-foreground ${activeHoverLock(link)}`;
      return `text-blue ${activeHoverLock(link)}`;
    }
    if (link.hoverColor === "coral") return "text-gray hover:text-coral";
    if (link.hoverColor === "foreground") return "text-gray hover:text-foreground";
    return "text-gray hover:text-blue";
  }

  function mobileLinkClass(link: (typeof navLinks)[0], isActive: boolean) {
    if (isActive) {
      if (link.hoverColor === "coral") return `text-coral ${activeHoverLock(link)}`;
      if (link.hoverColor === "foreground") return `text-foreground ${activeHoverLock(link)}`;
      return `text-blue ${activeHoverLock(link)}`;
    }
    if (link.hoverColor === "coral") return "text-gray hover:text-coral";
    if (link.hoverColor === "foreground") return "text-gray hover:text-foreground";
    return "text-gray hover:text-blue";
  }

  /** Logo: Image for B/W; PNG mask only for blue (home scrolled) and coral (marketing). */
  function renderLogo() {
    if (navOverDarkHero) {
      return (
        <Image
          src="/av-logo-white.webp"
          alt="Andrea Vasquez"
          width={240}
          height={67}
          className="h-[2.4rem] w-auto max-w-[min(100%,15rem)] object-contain object-left"
          priority
        />
      );
    }
    if (pathname === "/marketing") {
      return <LogoMaskSpan fill="var(--coral-light)" />;
    }
    if (pathname === "/" && scrolled) {
      return <LogoMaskSpan fill="var(--blue)" />;
    }
    return (
      <Image
        src="/av-logo-black.webp"
        alt="Andrea Vasquez"
        width={240}
        height={67}
        className="h-[2.4rem] w-auto max-w-[min(100%,15rem)] object-contain object-left"
        priority
      />
    );
  }

  const explorarClass =
    isOnSistema
      ? "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 bg-white text-foreground border border-black/15 shadow-sm hover:bg-white/95 cursor-pointer"
      : "px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 bg-black text-white hover:bg-black/88 cursor-pointer";

  const explorarMobileClass =
    isOnSistema
      ? "inline-block bg-white text-foreground border border-black/15 shadow-sm px-8 py-4 rounded-full text-lg font-semibold mt-4 hover:bg-white/95 cursor-pointer"
      : "inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-medium mt-4 hover:bg-black/88 cursor-pointer";

  const isTeamsAlt = pathname === "/teams-alt";
  const navPosition = isTeamsAlt ? "absolute" : "fixed";

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: footerInView || scrolled ? -120 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`${navPosition} top-0 left-0 right-0 z-[10000] bg-transparent transition-transform duration-500`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[calc(5rem+10px)]">
            <Link href="/" className="relative group flex items-center shrink-0">
              {renderLogo()}
              <span className="sr-only">Andrea Vasquez</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.href !== pathname) {
                        triggerTransition(link.href);
                      }
                    }}
                    className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${desktopLinkClass(link, isActive)}`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href={explorarHref}
                onClick={handleExplorarClick}
                className={explorarClass}
              >
                Explorar
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className={`w-6 h-0.5 block origin-center ${navOverDarkHero ? "bg-white" : "bg-foreground"}`}
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className={`w-6 h-0.5 block ${navOverDarkHero ? "bg-white" : "bg-foreground"}`}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className={`w-6 h-0.5 block origin-center ${navOverDarkHero ? "bg-white" : "bg-foreground"}`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10001] bg-background pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        if (link.href !== pathname) {
                          triggerTransition(link.href);
                        }
                      }}
                      className={`text-3xl font-medium transition-colors cursor-pointer ${mobileLinkClass(link, isActive)}`}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href={explorarHref}
                  onClick={handleExplorarClick}
                  className={explorarMobileClass}
                >
                  Explorar
                </a>
              </motion.div>
            </div>

            <div className="absolute bottom-20 right-8 w-48 h-48 bg-coral/10 rounded-full" />
            <div className="absolute bottom-40 left-8 w-32 h-32 bg-blue/10 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
