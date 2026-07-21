"use client";

/**
 * "Algunos de nuestros clientes" logo strip.
 *
 * Real social proof for the contact pages, which previously shipped invented
 * testimonials. Same asset the /marketing and / pages use.
 */

import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ClientsStrip({
  accent = "var(--coral)",
  className = "",
}: {
  /** Brand color for the italic half of the heading. */
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      className={className}
    >
      <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
        Algunos de <span className="font-semibold italic" style={{ color: accent }}>nuestros clientes</span>
      </p>
      <Image
        src="/home/clientes.webp"
        alt="Algunos de nuestros clientes"
        width={2376}
        height={908}
        className="mx-auto h-auto w-full max-w-2xl object-contain object-center"
        sizes="(max-width: 768px) 90vw, 640px"
        quality={92}
      />
    </motion.div>
  );
}
