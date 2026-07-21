"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Q } from "@/lib/imageQuality";
import BlobShape from "@/components/BlobShape";
import ClientsStrip from "@/components/ClientsStrip";
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

const inputBase = "w-full rounded-xl border border-foreground/12 bg-white px-4 py-3.5 text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition-all duration-200 focus:border-blue/60 focus:ring-2 focus:ring-blue/10";
const selectBase = "w-full rounded-xl border border-foreground/12 bg-white px-4 py-3.5 text-[15px] text-foreground outline-none transition-all duration-200 focus:border-blue/60 focus:ring-2 focus:ring-blue/10 appearance-none cursor-pointer";

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ContactoEquiposPage() {
  const [form, setForm] = useState({ nombre: "", email: "", empresa: "", tamano: "", modalidad: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitNetlifyForm("equipos", form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-background">

      {/* ════════════════════════════════════════════════════════════════════
          HERO — 100vh
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28 lg:px-8 md:pb-20 md:pt-32">
        <BlobShape color="var(--blue)" size={560} className="-top-48 -right-48 opacity-[0.05]" blur />
        <BlobShape color="var(--blue-light)" size={360} className="-bottom-24 -left-24 opacity-[0.04]" blur />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeUp delay={0.05}>
            <span className="mb-6 inline-block rounded-full border border-blue/20 bg-blue/6 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              Charla para equipos
            </span>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h1 className="mb-6 text-[clamp(2.1rem,5vw,3.4rem)] font-bold leading-[1.02] tracking-tight text-foreground">
              Tu equipo merece{" "}
              <span className="gradient-text-blue italic">más que una charla motivacional.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray md:text-lg">
              Diseñamos espacios de bienestar reales para equipos que trabajan bajo presión.
              Práctico, humano y aplicable desde el lunes.
            </p>
          </FadeUp>

          <FadeUp delay={0.32}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-foreground/50">
              {["Más de 40 empresas", "Presencial, remoto e híbrido", "Primera conversación sin costo"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue/50" />
                  {t}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MIDDLE — 100vh: photos + benefits + social proof
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex items-center overflow-hidden border-y border-foreground/6 bg-white py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center grid-cols-1 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">

          {/* Left — photo collage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative aspect-[4/5] h-auto w-full max-w-md">
              {/* Main photo */}
              <div className="absolute left-0 top-[5%] h-[58%] w-[72%] overflow-hidden rounded-[1.75rem] shadow-[0_16px_48px_color-mix(in_srgb,var(--blue)_12%,transparent)]">
                <Image
                  src="/experience/charla.webp"
                  alt="Andrea dando una charla para equipos"
                  fill
                  className="object-cover"
                  sizes="380px"
                  quality={Q.photo}
                />
              </div>
              {/* Sticker — blue, no shadow */}
              <div className="absolute bottom-[2%] right-[-4%] h-[46%] w-[52%]">
                <Image
                  src="/icons/equipo.webp"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="260px"
                  quality={Q.section}
                  draggable={false}
                />
              </div>
              {/* Accent badge */}
              <div className="absolute bottom-[41%] left-[47%] z-10 max-w-[11rem] -translate-x-1 rounded-2xl border border-blue/15 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <div className="mb-1.5"><FiveStars /></div>
                <p className="text-xs font-bold text-foreground">+40 empresas</p>
                <p className="text-[11px] text-foreground/45">confían en Muévete con Andrea</p>
              </div>
            </div>
          </motion.div>

          {/* Right — benefits + social proof */}
          <div className="flex flex-col justify-center py-10 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-blue">
                Por qué funciona
              </span>

              <ul className="mb-8 space-y-3.5">
                {[
                  "Formato 100% adaptado a tu equipo y cultura",
                  "Herramientas aplicables desde el mismo lunes",
                  "Sin motivación vacía — solo práctica real",
                  "Presencial, remoto o híbrido según lo que necesites",
                  "Primera conversación sin costo ni compromiso",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                      <CheckIcon />
                    </span>
                    <span className="text-[15px] leading-snug text-foreground/75">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social proof — real client logos (replaced invented testimonials) */}
            <ClientsStrip accent="var(--blue-dark)" className="mt-2" />
          </div>
        </div>

        {/* Mobile photo strip */}
        <div className="absolute bottom-0 left-0 right-0 flex h-32 gap-2 overflow-hidden lg:hidden">
          <div className="relative flex-1 overflow-hidden">
            <Image src="/experience/charla.webp" alt="" fill className="object-cover object-top opacity-60" sizes="50vw" quality={Q.section} />
          </div>
          <div className="relative flex-1 flex items-end justify-center pb-2">
            <Image src="/icons/equipo.webp" alt="" width={110} height={110} className="object-contain opacity-80" quality={Q.section} draggable={false} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FORM
      ════════════════════════════════════════════════════════════════════ */}
      <section id="formulario" className="relative overflow-hidden py-24 md:py-32">
        <BlobShape color="var(--blue)" size={400} className="-bottom-32 right-0 opacity-[0.04]" blur />

        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-blue">
              Cuéntanos sobre tu equipo
            </span>
            <h2 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Empecemos con una conversación.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray">
              Sin compromiso. Respondemos con una propuesta personalizada en menos de 48 horas.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-blue/20 bg-blue/5 px-8 py-12 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue text-white">
                  <CheckIcon />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">¡Recibimos tu mensaje!</h3>
                <p className="text-base leading-relaxed text-gray">
                  Nos ponemos en contacto en menos de 48 horas para agendar una primera llamada sin costo.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nombre *">
                    <input required name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputBase} />
                  </Field>
                  <Field label="Email corporativo *">
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@empresa.com" className={inputBase} />
                  </Field>
                </div>
                <Field label="Empresa u organización *">
                  <input required name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nombre de tu empresa" className={inputBase} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Tamaño del equipo">
                    <div className="relative">
                      <select name="tamano" value={form.tamano} onChange={handleChange} className={selectBase}>
                        <option value="">Selecciona...</option>
                        <option>5 – 20 personas</option>
                        <option>20 – 50 personas</option>
                        <option>50 – 200 personas</option>
                        <option>Más de 200 personas</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" /></svg>
                      </div>
                    </div>
                  </Field>
                  <Field label="Modalidad preferida">
                    <div className="relative">
                      <select name="modalidad" value={form.modalidad} onChange={handleChange} className={selectBase}>
                        <option value="">Selecciona...</option>
                        <option>Presencial</option>
                        <option>Remoto</option>
                        <option>Híbrido</option>
                        <option>Aún no lo sé</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" /></svg>
                      </div>
                    </div>
                  </Field>
                </div>
                <Field label="¿Qué quieres que se lleve tu equipo?">
                  <textarea
                    name="mensaje" value={form.mensaje} onChange={handleChange} rows={4}
                    placeholder="Contanos el contexto, el objetivo o cualquier cosa que nos ayude a preparar algo que tenga sentido para tu gente..."
                    className={`${inputBase} resize-none`}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-blue px-10 py-5 text-base font-semibold text-white shadow-[0_10px_40px_color-mix(in_srgb,var(--blue)_28%,transparent)] transition-all duration-300 hover:bg-blue-dark disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><circle cx="12" cy="12" r="10" className="opacity-25" /><path d="M12 2a10 10 0 0110 10" className="opacity-75" /></svg>Enviando...</>
                  ) : (
                    <>Quiero una charla para mi equipo<span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span></>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-center text-xs font-medium text-red-500">
                    Algo salió mal al enviar. Intentá de nuevo o escribinos a hola@mueveteconandrea.com.
                  </p>
                )}
                <p className="text-center text-xs text-foreground/35">Sin spam. Sin compromiso. Solo una conversación real.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-blue py-8 text-center">
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Muévete con Andrea · Andrea Vásquez ·{" "}
          <a href="mailto:hola@mueveteconandrea.com" className="hover:text-white/80 transition-colors underline underline-offset-2">
            hola@mueveteconandrea.com
          </a>
        </p>
      </footer>
    </div>
  );
}
