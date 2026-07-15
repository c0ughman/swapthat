"use client";

/**
 * Quiz funnel for /contacto/sistema.
 *
 * Screen sequence ported from `quiz-funnel-starter`: question → interstitial →
 * analysis → email gate → result. The original toggled `.hidden` on divs that
 * all existed up front; here each screen is a branch of one AnimatePresence,
 * which gives us enter/exit transitions the original never had.
 *
 * Auto-advances on select (600ms, matching the original's delay) so there is no
 * Continue button on question screens — one tap per question.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  calculateProfile,
  interstitials,
  isDisqualified,
  loadingChecks,
  profiles,
  quizQuestions,
  type ProfileId,
} from "@/lib/quizData";
import { submitNetlifyForm } from "@/lib/submitNetlifyForm";

type Screen = "question" | "interstitial" | "analyzing" | "email" | "result" | "noFit";

const EASE = [0.22, 1, 0.36, 1] as const;

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Soft blurred blobs — the site's signature background texture. */
function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: "rgba(194,183,66,0.10)" }} />
      <div className="absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full blur-3xl" style={{ background: "rgba(156,62,35,0.07)" }} />
      <div className="absolute left-1/2 top-1/3 h-[280px] w-[280px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "rgba(135,170,187,0.08)" }} />
    </div>
  );
}

export default function SistemaQuiz() {
  const reduceMotion = useReducedMotion();

  const [screen, setScreen] = useState<Screen>("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingInterstitial, setPendingInterstitial] = useState<number | null>(null);
  const [checksDone, setChecksDone] = useState(0);
  const [profileId, setProfileId] = useState<ProfileId>("reiniciadora");
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);

  const question = quizQuestions[questionIndex];
  const total = quizQuestions.length;
  const progress = ((questionIndex + (selected ? 1 : 0)) / total) * 100;
  const profile = profiles[profileId];

  const goToNext = useCallback((currentAnswers: Record<number, string>) => {
    const answered = quizQuestions[questionIndex];
    const interstitial = interstitials.find((i) => i.afterQuestion === answered.id);

    if (questionIndex + 1 >= total) {
      // Disqualification is checked once, at the end, so she still gets a full
      // read rather than being ejected mid-quiz.
      if (isDisqualified(currentAnswers)) {
        setScreen("noFit");
      } else {
        setProfileId(calculateProfile(currentAnswers));
        setScreen("analyzing");
      }
      return;
    }

    if (interstitial) {
      setPendingInterstitial(interstitials.indexOf(interstitial));
      setScreen("interstitial");
      return;
    }

    setQuestionIndex((i) => i + 1);
    setSelected(null);
  }, [questionIndex, total]);

  const handleSelect = (optionId: string) => {
    if (selected) return;
    setSelected(optionId);

    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(8);
    }

    advanceTimer.current = setTimeout(() => goToNext(next), reduceMotion ? 150 : 550);
  };

  const handleInterstitialContinue = () => {
    setPendingInterstitial(null);
    setQuestionIndex((i) => i + 1);
    setSelected(null);
    setScreen("question");
  };

  // Fake analysis. Sequential checks, then the email gate.
  useEffect(() => {
    if (screen !== "analyzing") return;
    setChecksDone(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    loadingChecks.forEach((_, i) => {
      timers.push(setTimeout(() => setChecksDone(i + 1), (i + 1) * (reduceMotion ? 200 : 850)));
    });
    timers.push(
      setTimeout(() => setScreen("email"), loadingChecks.length * (reduceMotion ? 200 : 850) + 700),
    );

    return () => timers.forEach(clearTimeout);
  }, [screen, reduceMotion]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Flattened into the existing `sistema` Netlify form. `situacion` carries the
    // profile so Andrea opens every conversation knowing who she's talking to.
    const respuestas = quizQuestions
      .map((q) => {
        const opt = q.options.find((o) => o.id === answers[q.id]);
        return `${q.text} → ${opt?.text ?? "—"}`;
      })
      .join("\n");

    try {
      await submitNetlifyForm("sistema", {
        nombre: form.nombre,
        email: form.email,
        whatsapp: form.whatsapp,
        situacion: `${profile.name} — ${profile.tagline}`,
        mensaje: respuestas,
      });
      setScreen("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  const screenMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -12 },
    transition: { duration: 0.4, ease: EASE },
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip" style={{ background: "var(--crema)" }}>
      <Blobs />

      {/* Progress — hidden once she's through the questions */}
      {(screen === "question" || screen === "interstitial") && (
        <div className="sticky top-0 z-30 px-5 pt-5 pb-3 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--crema) 85%, transparent)" }}>
          <div className="mx-auto max-w-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/40">
                Muévete con Andrea
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/40">
                {Math.min(questionIndex + 1, total)} / {total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/8">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--verde) 0%, var(--coral) 100%)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-84px)] max-w-xl flex-col justify-center px-5 py-8">
        <AnimatePresence mode="wait">

          {/* ── QUESTION ────────────────────────────────────────────────── */}
          {screen === "question" && (
            <motion.div key={`q-${question.id}`} {...screenMotion} className="sm:text-center">
              <motion.div
                className="mb-3 text-5xl sm:text-6xl"
                initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
              >
                {question.emoji}
              </motion.div>

              <h2 className="mb-7 text-[clamp(1.6rem,5.5vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-foreground sm:mb-9 sm:mx-auto sm:max-w-lg">
                {question.text}
              </h2>

              <div className="mx-auto flex max-w-md flex-col gap-3">
                {question.options.map((option, i) => {
                  const isSelected = selected === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32, delay: 0.05 + i * 0.06, ease: EASE }}
                      whileHover={reduceMotion ? undefined : { scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      aria-pressed={isSelected}
                      className={`group flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-colors duration-200 ${
                        isSelected
                          ? "border-transparent bg-foreground text-crema shadow-[0_10px_30px_rgba(88,45,27,0.22)]"
                          : "border-foreground/10 bg-white text-foreground hover:border-foreground/25 hover:shadow-[0_6px_20px_rgba(88,45,27,0.08)]"
                      }`}
                    >
                      <span className="text-2xl leading-none">{option.emoji}</span>
                      <span className="flex-1 text-[16px] font-semibold leading-snug">{option.text}</span>
                      <span className={`shrink-0 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}>
                        <CheckIcon size={18} />
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── INTERSTITIAL ────────────────────────────────────────────── */}
          {screen === "interstitial" && pendingInterstitial !== null && (
            <motion.div key={`int-${pendingInterstitial}`} {...screenMotion} className="text-center">
              <motion.div
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{ background: "var(--verde)" }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 14 }}
              >
                💛
              </motion.div>
              <p
                className="mb-9 text-[clamp(1.15rem,4vw,1.5rem)] font-medium leading-[1.5] text-foreground [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: interstitials[pendingInterstitial].text }}
              />
              <button
                onClick={handleInterstitialContinue}
                className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-9 py-4 text-base font-semibold text-crema shadow-[0_10px_30px_rgba(88,45,27,0.2)] transition-all hover:bg-foreground/88 active:scale-[0.98]"
              >
                {interstitials[pendingInterstitial].buttonText}
                <ArrowRight />
              </button>
            </motion.div>
          )}

          {/* ── ANALYZING ───────────────────────────────────────────────── */}
          {screen === "analyzing" && (
            <motion.div key="analyzing" {...screenMotion}>
              <h2 className="mb-8 text-center text-[clamp(1.5rem,5vw,2rem)] font-bold tracking-tight text-foreground">
                Analizando tus respuestas…
              </h2>
              <div className="flex flex-col gap-3">
                {loadingChecks.map((check, i) => {
                  const done = i < checksDone;
                  const active = i === checksDone;
                  return (
                    <motion.div
                      key={check}
                      animate={{ opacity: done || active ? 1 : 0.35 }}
                      className="flex items-center gap-4 rounded-2xl border border-foreground/8 bg-white px-5 py-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: done ? "var(--verde)" : "var(--gray-light)" }}>
                        {done ? (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className="text-white">
                            <CheckIcon size={14} />
                          </motion.span>
                        ) : (
                          active && <span className="h-3 w-3 animate-spin rounded-full border-2 border-foreground/25 border-t-foreground" />
                        )}
                      </span>
                      <span className="text-[15px] font-medium text-foreground/75">{check}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── EMAIL GATE ──────────────────────────────────────────────── */}
          {screen === "email" && (
            <motion.div key="email" {...screenMotion}>
              <div className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-[0_16px_50px_rgba(88,45,27,0.10)] sm:p-9">
                <motion.div
                  className="mb-5 text-5xl"
                  initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14 }}
                >
                  {profile.emoji}
                </motion.div>

                <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-verde-dark">
                  Tu resultado está listo
                </span>
                <h2 className="mb-3 text-[clamp(1.6rem,5vw,2.2rem)] font-bold leading-[1.1] tracking-tight text-foreground">
                  Ya sabemos qué te está pasando.
                </h2>
                <p className="mb-7 text-[15px] leading-relaxed text-gray">
                  Déjanos dónde escribirte y te mostramos tu perfil completo — más lo que Andrea haría en tu caso.
                </p>

                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3.5">
                  <input
                    required
                    name="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="¿Cómo te llamas?"
                    className="w-full rounded-xl border border-foreground/12 bg-crema/40 px-4 py-3.5 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-foreground/12 bg-crema/40 px-4 py-3.5 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8"
                  />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="WhatsApp (opcional)"
                    className="w-full rounded-xl border border-foreground/12 bg-crema/40 px-4 py-3.5 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8"
                  />

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4.5 text-base font-semibold text-crema shadow-[0_10px_34px_rgba(88,45,27,0.22)] transition-all hover:bg-foreground/88 active:scale-[0.98] disabled:opacity-60"
                  >
                    {status === "submitting" ? "Un momento…" : "Ver mi resultado"}
                    {status !== "submitting" && <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>}
                  </button>

                  {status === "error" && (
                    <p className="text-center text-xs font-medium text-coral">
                      Algo salió mal. Intenta de nuevo o escríbenos a hola@mueveteconandrea.com.
                    </p>
                  )}
                  <p className="text-center text-xs text-foreground/35">
                    Sin spam. Sin presión. Solo una conversación honesta.
                  </p>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ──────────────────────────────────────────────────── */}
          {screen === "result" && (
            <motion.div key="result" {...screenMotion} className="py-6">
              <div className="mb-6 text-center">
                <motion.div
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
                  style={{ background: profile.accent }}
                  initial={{ scale: 0.4, rotate: -14, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                >
                  {profile.emoji}
                </motion.div>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Tu perfil
                </span>
                <h1 className="mb-2.5 text-[clamp(2rem,7vw,3rem)] font-bold leading-[1] tracking-tight" style={{ color: profile.color }}>
                  {profile.name}
                </h1>
                <p className="text-lg font-medium italic text-foreground/70">{profile.tagline}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
                className="mb-5 rounded-2xl px-6 py-5 text-center"
                style={{ background: profile.color }}
              >
                <p className="text-[17px] font-bold leading-snug text-crema">{profile.hook}</p>
              </motion.div>

              <div className="mb-5 rounded-3xl border border-foreground/8 bg-white p-6 sm:p-7">
                {profile.description.split("\n\n").map((para) => (
                  <p key={para} className="mb-3.5 text-[15px] leading-relaxed text-foreground/75 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>

              <div className="mb-5 rounded-3xl border border-foreground/8 bg-white p-6 sm:p-7">
                <h3 className="mb-4 text-lg font-bold text-foreground">¿Te suena?</h3>
                <ul className="space-y-3">
                  {profile.symptoms.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.32, ease: EASE }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: profile.color }} />
                      <span className="text-[15px] leading-snug text-foreground/75">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mb-5 rounded-3xl p-6 sm:p-7" style={{ background: "var(--foreground)" }}>
                <h3 className="mb-4 text-lg font-bold text-crema">La verdad</h3>
                {profile.truth.split("\n\n").map((para) => (
                  <p key={para} className="mb-3.5 text-[15px] leading-relaxed text-crema/75 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>

              <div className="mb-6 rounded-3xl border-2 border-dashed p-6 text-center sm:p-7" style={{ borderColor: profile.color, background: "color-mix(in srgb, var(--crema) 60%, white)" }}>
                <p className="text-[clamp(1.15rem,4vw,1.4rem)] font-bold leading-snug" style={{ color: profile.color }}>
                  “{profile.promise}”
                </p>
              </div>

              <div className="rounded-3xl border border-foreground/10 bg-white p-7 text-center shadow-[0_16px_50px_rgba(88,45,27,0.08)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--verde)" }}>
                  <span className="text-white"><CheckIcon size={20} /></span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Ya estás en la lista, {form.nombre.split(" ")[0]}.</h3>
                <p className="mb-6 text-[15px] leading-relaxed text-gray">
                  Andrea revisa tu resultado y te escribe en las próximas 48 horas. Sin plantillas: ya sabe qué te está pasando.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Sin compromiso", "Respuesta en 48h", "Solo si es para ti"].map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 rounded-full bg-crema px-3 py-1.5 text-[11px] font-bold text-foreground/55">
                      <CheckIcon size={11} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── NO FIT ──────────────────────────────────────────────────── */}
          {screen === "noFit" && (
            <motion.div key="noFit" {...screenMotion} className="text-center">
              <div className="rounded-3xl border border-foreground/10 bg-white p-8 shadow-[0_16px_50px_rgba(88,45,27,0.08)] sm:p-10">
                <div className="mb-5 text-5xl">🫱</div>
                <h2 className="mb-4 text-[clamp(1.6rem,5vw,2.1rem)] font-bold leading-[1.1] tracking-tight text-foreground">
                  Seamos honestas.
                </h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-gray">
                  <p>
                    Buscas a alguien que te exija fuerte y te presione todos los días. Eso existe, y a mucha gente le funciona.
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Pero aquí no empujamos. Aquí acompañamos.
                  </p>
                  <p>
                    Preferimos decírtelo ahora y no cobrarte por descubrirlo en un mes. Si algún día quieres probar un
                    sistema que te sostiene en vez de exigirte, aquí estamos.
                  </p>
                </div>
                <Link
                  href="/sistema"
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full border-2 border-foreground/15 px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-foreground/35 active:scale-[0.98]"
                >
                  Conocer la filosofía
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
