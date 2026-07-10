"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import BlobShape from "@/components/BlobShape";
import { submitNetlifyForm } from "@/lib/submitNetlifyForm";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FiveStars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 de 5 estrellas" role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400 shrink-0" fill="currentColor" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/50">{label}</label>
      {children}
    </div>
  );
}

const inputBase = "w-full rounded-xl border border-foreground/12 bg-white px-4 py-3.5 text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition-all duration-200 focus:border-coral/50 focus:ring-2 focus:ring-coral/10";
const selectBase = "w-full rounded-xl border border-foreground/12 bg-white px-4 py-3.5 text-[15px] text-foreground outline-none transition-all duration-200 focus:border-coral/50 focus:ring-2 focus:ring-coral/10 appearance-none cursor-pointer";

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ContactoMarketingPage() {
  const [form, setForm] = useState({ nombre: "", email: "", marca: "", sector: "", problema: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitNetlifyForm("marketing", form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white">

      {/* ════════════════════════════════════════════════════════════════════
          HERO — 100vh
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex h-screen min-h-[600px] flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-12 lg:px-8"
        style={{ background: "radial-gradient(ellipse 65% 55% at 80% 0%, rgba(232,93,117,0.09), transparent 60%), radial-gradient(ellipse 40% 45% at 5% 95%, rgba(232,93,117,0.06), transparent 55%), #ffffff" }}
      >
        {/* Top coral line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 h-[3px] w-full origin-left"
          style={{ background: "linear-gradient(to right, var(--coral), var(--coral-light), transparent)" }}
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeUp delay={0.05}>
            <div className="mb-7 flex items-center justify-center gap-3">
              <span className="h-px w-10" style={{ background: "rgba(232,93,117,0.4)" }} />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">Marketing con estructura</span>
              <span className="h-px w-10" style={{ background: "rgba(232,93,117,0.4)" }} />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h1 className="mb-6 text-[clamp(2.4rem,6.5vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-foreground">
              Tu marca tiene potencial.
              <br />
              <span className="gradient-text-coral italic">Le falta sistema.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray md:text-xl">
              Si estás invirtiendo en contenido, en ads o en estrategia y los resultados no son claros
              — el problema no es tu marca. Es la falta de estructura.
            </p>
          </FadeUp>

          <FadeUp delay={0.32}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Estrategia", "Contenido", "Meta Ads", "Performance"].map((tag) => (
                <span key={tag} className="rounded-full border border-coral/18 bg-coral/5 px-4 py-1.5 text-xs font-semibold text-coral">
                  {tag}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/30">Cuéntanos sobre tu marca</span>
              <div className="animate-scroll-bounce h-6 w-[1px] bg-gradient-to-b from-coral/40 to-transparent" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MIDDLE — 100vh: photos + benefits + social proof
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex h-screen min-h-[640px] items-center overflow-hidden border-y border-foreground/6" style={{ background: "#fdf9f9" }}>
        <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">

          {/* Left — benefits + social proof */}
          <div className="flex flex-col justify-center py-10 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-coral">
                Lo que cambia cuando hay sistema
              </span>

              <ul className="mb-8 space-y-3.5">
                {[
                  "Estrategia medible — no intuición ni tendencias efímeras",
                  "Contenido que convierte: cada pieza con un propósito claro",
                  "Meta Ads con estructura y retorno real, no solo impresiones",
                  "Claridad sobre qué funciona y qué no en tu marca",
                  "Primera llamada sin costo — solo si tiene sentido para los dos",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                      <CheckIcon />
                    </span>
                    <span className="text-[15px] leading-snug text-foreground/75">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social proof */}
            <div className="space-y-4">
              {[
                {
                  quote: "En tres semanas teníamos una estrategia real y los números empezaron a moverse.",
                  name: "Sofía R.", role: "Fundadora · Marca de lifestyle",
                },
                {
                  quote: "Por primera vez entendimos qué estábamos haciendo y por qué funcionaba.",
                  name: "Carlos V.", role: "CEO · E-commerce moda",
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-foreground/8 bg-white p-5"
                >
                  <FiveStars />
                  <p className="mt-2.5 text-[13px] font-medium italic leading-snug text-foreground/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/35">
                    — {t.name} · {t.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center py-12"
          >
            <div className="relative h-full w-full max-h-[72vh]">
              <div className="absolute right-0 top-[5%] h-[55%] w-[68%] overflow-hidden rounded-[1.75rem] shadow-[0_16px_48px_rgba(232,93,117,0.12)]">
                <Image
                  src="/andreacoachsevilla-55.webp"
                  alt="Andrea, consultora de marketing y performance"
                  fill
                  className="object-cover object-center"
                  sizes="360px"
                  quality={Q.photo}
                />
              </div>
              {/* Sticker — warm/coral, no shadow */}
              <div className="absolute bottom-[2%] left-[-4%] h-[46%] w-[52%]">
                <Image
                  src="/icons/estrategia.webp"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="260px"
                  quality={Q.section}
                  draggable={false}
                />
              </div>
              {/* Coral accent badge */}
              <div className="absolute bottom-[43%] right-[42%] z-10 max-w-[11rem] translate-x-1 rounded-2xl border border-coral/15 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <p className="text-xs font-bold text-coral">Resultados medibles</p>
                <p className="text-[11px] text-foreground/45">desde la primera semana</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile photo strip */}
        <div className="absolute bottom-0 left-0 right-0 flex h-28 gap-2 overflow-hidden lg:hidden">
          <div className="relative flex-1 overflow-hidden">
            <Image src="/andreacoachsevilla-55.webp" alt="" fill className="object-cover object-center opacity-60" sizes="50vw" quality={Q.section} />
          </div>
          <div className="relative flex-1 flex items-end justify-center pb-2">
            <Image src="/icons/estrategia.webp" alt="" width={110} height={110} className="object-contain opacity-80" quality={Q.section} draggable={false} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdf9f9] via-[#fdf9f9]/70 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FORM
      ════════════════════════════════════════════════════════════════════ */}
      <section id="formulario" className="relative py-24 md:py-32">
        <BlobShape color="var(--coral)" size={380} className="-bottom-24 -left-20 opacity-[0.04]" blur />

        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              Hablemos de tu marca
            </span>
            <h2 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Cuéntanos dónde estás y a dónde quieres llegar.
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-gray">
              Primera llamada sin costo. Solo necesitamos entender tu situación.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-coral/20 bg-coral/5 px-8 py-12 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white">
                  <CheckIcon />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">¡Recibimos tu mensaje!</h3>
                <p className="text-base leading-relaxed text-gray">
                  Te contactamos en las próximas 48 horas para coordinar la primera llamada.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Tu nombre *">
                    <input required name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputBase} />
                  </Field>
                  <Field label="Email *">
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" className={inputBase} />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Marca o negocio *">
                    <input required name="marca" value={form.marca} onChange={handleChange} placeholder="Nombre de tu marca" className={inputBase} />
                  </Field>
                  <Field label="Sector o industria">
                    <input name="sector" value={form.sector} onChange={handleChange} placeholder="Ej: moda, tech, salud..." className={inputBase} />
                  </Field>
                </div>
                <Field label="¿Cuál es el mayor problema de tu marketing ahora?">
                  <div className="relative">
                    <select name="problema" value={form.problema} onChange={handleChange} className={selectBase}>
                      <option value="">Selecciona la que más se acerca...</option>
                      <option>No tengo una estrategia clara</option>
                      <option>Mi contenido no está generando ventas</option>
                      <option>Invierto en ads pero no veo retorno</option>
                      <option>No sé cómo escalar lo que ya funciona</option>
                      <option>Otro</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" /></svg>
                    </div>
                  </div>
                </Field>
                <Field label="Cuéntanos más (opcional)">
                  <textarea
                    name="mensaje" value={form.mensaje} onChange={handleChange} rows={4}
                    placeholder="¿Cuál es la situación actual de tu marca? ¿Qué intentaste y no funcionó? ¿A dónde querés llegar?"
                    className={`${inputBase} resize-none`}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-coral px-10 py-5 text-base font-semibold text-white shadow-[0_10px_40px_rgba(232,93,117,0.28)] transition-all duration-300 hover:bg-coral-dark disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><circle cx="12" cy="12" r="10" className="opacity-25" /><path d="M12 2a10 10 0 0110 10" className="opacity-75" /></svg>Enviando...</>
                  ) : (
                    <>Hablemos de tu marca<span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span></>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-center text-xs font-medium text-red-500">
                    Algo salió mal al enviar. Intentá de nuevo o escribinos a hola@mueveteconandrea.com.
                  </p>
                )}
                <p className="text-center text-xs text-foreground/35">Sin spam. Primera conversación sin costo ni compromiso.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-coral py-8 text-center">
        <p className="text-xs text-white/55">
          © {new Date().getFullYear()} Muévete con Andrea · Andrea Vásquez ·{" "}
          <a href="mailto:hola@mueveteconandrea.com" className="hover:text-white/80 transition-colors underline underline-offset-2">
            hola@mueveteconandrea.com
          </a>
        </p>
      </footer>
    </div>
  );
}
