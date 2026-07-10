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

const inputBase = "w-full rounded-xl border border-foreground/12 bg-white px-4 py-3.5 text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition-all duration-200 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8";
const selectBase = "w-full rounded-xl border border-foreground/12 bg-white px-4 py-3.5 text-[15px] text-foreground outline-none transition-all duration-200 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8 appearance-none cursor-pointer";

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ContactoSistemaPage() {
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "", situacion: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitNetlifyForm("sistema", form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white">

      {/* ════════════════════════════════════════════════════════════════════
          HERO — 100vh — dark background
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex h-screen min-h-[600px] flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-12 lg:px-8"
        style={{ background: "var(--foreground)" }}
      >
        {/* Subtle glow blobs on dark */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full blur-3xl" style={{ background: "rgba(184,233,134,0.045)" }} />
          <div className="absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full blur-3xl" style={{ background: "rgba(245,166,35,0.05)" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeUp delay={0.05}>
            <div className="mb-7 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-white/18" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">Muévete con Andrea</span>
              <span className="h-px w-8 bg-white/18" />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h1 className="mb-7 text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1] tracking-tight text-white">
              Llevas años{" "}
              <span className="italic font-light text-white/55">empezando</span>{" "}
              de cero.
              <br />
              Hoy cambia eso.
            </h1>
          </FadeUp>

          <FadeUp delay={0.26}>
            <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-white/50 md:text-xl">
              No es otro programa de fitness. Es un sistema diseñado para la vida real
              — con sus imprevistos, su cansancio y sus días que no salen como planeados.
            </p>
          </FadeUp>

          <FadeUp delay={0.34}>
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-medium text-white/38">
              {["Para mujeres activas", "Sin presión", "A tu ritmo", "Constancia real"].map((tag) => (
                <span key={tag} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  {tag}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.42}>
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/22">Cuéntanos tu situación</span>
              <div className="animate-scroll-bounce h-6 w-[1px] bg-gradient-to-b from-white/28 to-transparent" />
            </div>
          </FadeUp>
        </div>

        {/* Bottom curve transition to white */}
        <div className="absolute bottom-0 left-0 w-full leading-none" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-12 w-full md:h-16 lg:h-20">
            <path fill="white" d="M0 40 Q720 -40 1440 40 L1440 80 L0 80 Z" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MIDDLE — 100vh: photos + benefits + social proof
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex h-screen min-h-[640px] items-center overflow-hidden border-b border-foreground/6 bg-white">
        <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">

          {/* Left — photo collage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center py-12"
          >
            <div className="relative h-full w-full max-h-[72vh]">
              <div className="absolute left-0 top-[3%] h-[60%] w-[74%] overflow-hidden rounded-[1.75rem] shadow-[0_16px_48px_rgba(26,26,26,0.12)]">
                <Image
                  src="/philosophy/1.webp"
                  alt="Muévete con Andrea — movimiento a tu ritmo"
                  fill
                  className="object-cover"
                  sizes="380px"
                  quality={Q.photo}
                />
              </div>
              {/* Sticker — grayscale, no shadow */}
              <div className="absolute bottom-[2%] right-[-4%] h-[46%] w-[52%]">
                <Image
                  src="/icons/saludable.webp"
                  alt=""
                  fill
                  className="object-contain"
                  style={{ filter: "grayscale(1)" }}
                  sizes="260px"
                  quality={Q.section}
                  draggable={false}
                />
              </div>
              {/* Small accent badge */}
              <div className="absolute bottom-[41%] left-[48%] z-10 max-w-[11rem] -translate-x-1 rounded-2xl border border-foreground/10 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <p className="text-xs font-bold text-foreground">Sin empezar de cero</p>
                <p className="text-[11px] text-foreground/45">retomas donde lo dejaste</p>
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
              <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45">
                Por qué este sistema es diferente
              </span>

              <ul className="mb-8 space-y-3.5">
                {[
                  "El sistema se adapta a tu semana — no al revés",
                  "Los días malos existen: aquí retomas, no empiezas de cero",
                  "Sin presión, sin culpa, sin perfeccionismo tóxico",
                  "Para mujeres con vida real: trabajo, familia, imprevistos",
                  "Constancia imperfecta — sostenible a largo plazo",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-foreground">
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
                  quote: "Por primera vez en años no siento que fracasé cuando me salteo un día. El sistema me sostiene.",
                  name: "María G.", role: "Mamá de 2 · Trabaja full time",
                },
                {
                  quote: "Andrea no te exige. Te acompaña. Eso cambia todo.",
                  name: "Valentina C.", role: "Profesional independiente",
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-foreground/8 bg-background p-5"
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
        </div>

        {/* Mobile photo strip */}
        <div className="absolute bottom-0 left-0 right-0 flex h-28 gap-2 overflow-hidden lg:hidden">
          <div className="relative flex-1 overflow-hidden">
            <Image src="/philosophy/1.webp" alt="" fill className="object-cover opacity-55" sizes="50vw" quality={Q.section} />
          </div>
          <div className="relative flex-1 flex items-end justify-center pb-2">
            <Image src="/icons/saludable.webp" alt="" width={110} height={110} className="object-contain opacity-70" style={{ filter: "grayscale(1)" }} quality={Q.section} draggable={false} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FORM — cream background
      ════════════════════════════════════════════════════════════════════ */}
      <section id="formulario" className="relative py-24 md:py-32" style={{ background: "var(--background)" }}>
        <BlobShape color="var(--foreground)" size={380} className="-top-20 right-0 opacity-[0.03]" blur />
        <BlobShape color="#b8e986" size={280} className="-bottom-20 -left-10 opacity-[0.12]" blur />

        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45">
              Quiero empezar hoy
            </span>
            <h2 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Cuéntanos un poco sobre ti.
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-gray">
              Te respondemos para ver si el sistema encaja con lo que necesitás. Sin presión, sin promesas vacías.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-foreground/12 bg-white px-8 py-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-white">
                  <CheckIcon />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">¡Ya casi estás adentro!</h3>
                <p className="text-base leading-relaxed text-gray">
                  Revisamos tu mensaje y te escribimos en las próximas 48 horas para contarte los próximos pasos.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Tu nombre *">
                    <input required name="nombre" value={form.nombre} onChange={handleChange} placeholder="¿Cómo te llamás?" className={inputBase} />
                  </Field>
                  <Field label="Email *">
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" className={inputBase} />
                  </Field>
                </div>
                <Field label="WhatsApp (opcional — respuesta más rápida)">
                  <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+54 9 11 0000-0000" className={inputBase} />
                </Field>
                <Field label="¿Cuál describe mejor tu situación?">
                  <div className="relative">
                    <select name="situacion" value={form.situacion} onChange={handleChange} className={selectBase}>
                      <option value="">Selecciona la que más se acerca...</option>
                      <option>Empiezo con todo y abandono al mes</option>
                      <option>No tengo un horario consistente</option>
                      <option>No sé por dónde empezar</option>
                      <option>Tengo lesiones o limitaciones físicas</option>
                      <option>Estuve activa y quiero retomar</option>
                      <option>Otra situación</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" /></svg>
                    </div>
                  </div>
                </Field>
                <Field label="¿Qué te gustaría que cambiara?">
                  <textarea
                    name="mensaje" value={form.mensaje} onChange={handleChange} rows={4}
                    placeholder="Contanos cómo se ve tu día a día, qué intentaste antes, qué sientes que te frena..."
                    className={`${inputBase} resize-none`}
                  />
                </Field>

                {/* Trust strip */}
                <div className="flex flex-wrap gap-4 rounded-xl border border-foreground/8 bg-white px-5 py-4">
                  {["Sin compromiso", "Respuesta en 48h", "Solo si es para vos"].map((tag) => (
                    <span key={tag} className="flex items-center gap-2 text-xs font-semibold text-foreground/45">
                      <CheckIcon />
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-10 py-5 text-base font-semibold text-white shadow-[0_10px_40px_rgba(26,26,26,0.20)] transition-all duration-300 hover:bg-foreground/85 disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><circle cx="12" cy="12" r="10" className="opacity-25" /><path d="M12 2a10 10 0 0110 10" className="opacity-75" /></svg>Enviando...</>
                  ) : (
                    <>Quiero empezar hoy<span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span></>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-center text-xs font-medium text-red-500">
                    Algo salió mal al enviar. Intentá de nuevo o escribinos a hola@mueveteconandrea.com.
                  </p>
                )}
                <p className="text-center text-xs text-foreground/35">Sin spam. Solo una conversación honesta sobre si esto es para vos.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer — black ────────────────────────────────────────────────── */}
      <footer className="py-8 text-center" style={{ background: "var(--foreground)" }}>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Muévete con Andrea · Andrea Vásquez ·{" "}
          <a href="mailto:hola@mueveteconandrea.com" className="hover:text-white/70 transition-colors underline underline-offset-2">
            hola@mueveteconandrea.com
          </a>
        </p>
      </footer>
    </div>
  );
}
