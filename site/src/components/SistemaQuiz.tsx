"use client";

/**
 * Quiz funnel for /contacto/sistema.
 *
 * 15 questions → interstitials (reframe ×2, commit ×2) → analysis screen with
 * three yes/no micro-commitments → email gate → profile result + 90-day offer.
 *
 * Each screen is a branch of one AnimatePresence for enter/exit transitions.
 * Questions auto-advance on select. Real stickers from /stickers scatter over
 * each question header, rotated and overlapped, placed deterministically by
 * question id so they look random but stay stable across renders.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  calculateProfile,
  interstitials,
  loadingChecks,
  offerIncludes,
  OFFER_CADENCE,
  OFFER_PRICE,
  profiles,
  quizQuestions,
  valueAnchor,
  yesNoQuestions,
  type ProfileId,
} from "@/lib/quizData";
import { submitNetlifyForm } from "@/lib/submitNetlifyForm";
import { cartoon3dPath } from "@/lib/cartoonAssets";

type Screen = "question" | "interstitial" | "analyzing" | "email" | "result";

const EASE = [0.22, 1, 0.36, 1] as const;

const STICKERS = [
  "/stickers/st-1aec-2.webp",
  "/stickers/playful-smiley.webp",
  "/stickers/ripe-apple.webp",
  "/stickers/blueberry-cluster.webp",
  "/stickers/frothy-mug-floral.webp",
  "/stickers/wa-115225.webp",
  "/stickers/st-1aec-3.webp",
  "/stickers/wa-114932.webp",
  "/stickers/wa-114932-2.webp",
  "/stickers/wa-114933-3.webp",
] as const;

/** Deterministic 1–3 rotated, overlapping stickers keyed off a question id. */
function stickersFor(seed: number): { src: string; dx: number; rot: number; z: number }[] {
  const count = (seed % 3) + 1; // 1–3
  return Array.from({ length: count }, (_, i) => {
    const idx = (seed * 3 + i * 7) % STICKERS.length;
    return {
      src: STICKERS[idx],
      dx: i * 34 - (count - 1) * 17, // fan out, centered
      rot: ((seed + i * 5) % 13) - 6, // −6°…+6°
      z: count - i,
    };
  });
}

function StickerFan({ seed }: { seed: number }) {
  const items = stickersFor(seed);
  return (
    <div className="relative mx-auto mb-4 h-16 w-full" aria-hidden>
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        {items.map((s, i) => (
          <motion.div
            key={i}
            className="absolute drop-shadow-[0_4px_12px_rgba(88,45,27,0.14)]"
            style={{ left: s.dx - 30, zIndex: s.z, width: 60, height: 60 }}
            initial={{ scale: 0.4, rotate: s.rot - 18, opacity: 0 }}
            animate={{ scale: 1, rotate: s.rot, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 14, delay: i * 0.07 }}
          >
            <Image src={s.src} alt="" width={60} height={60} className="h-full w-full object-contain" />
          </motion.div>
        ))}
      </div>
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

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [yesNoIndex, setYesNoIndex] = useState(-1); // -1 = none showing
  const [profileId, setProfileId] = useState<ProfileId>("montanarusa");
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
      setProfileId(calculateProfile(currentAnswers));
      setScreen("analyzing");
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
    if (typeof window !== "undefined" && window.navigator?.vibrate) window.navigator.vibrate(8);
    advanceTimer.current = setTimeout(() => goToNext(next), reduceMotion ? 150 : 500);
  };

  const handleInterstitialContinue = () => {
    setPendingInterstitial(null);
    setQuestionIndex((i) => i + 1);
    setSelected(null);
    setScreen("question");
  };

  // Analysis sequence as an explicit step machine so it survives StrictMode's
  // double-mounted effects (an async loop here deadlocks when two instances
  // clobber each other's modal resolver). Steps:
  //   check0, check1, yes/no #1, check2, yes/no #2, check3, yes/no #3, email.
  // Timer steps auto-advance; modal steps wait for the user's tap.
  const [analysisStep, setAnalysisStep] = useState(0);
  const ANALYSIS_STEPS: Array<{ check?: number; yesNo?: number; done?: boolean }> = [
    { check: 1 },
    { check: 2 },
    { yesNo: 0 },
    { check: 3 },
    { yesNo: 1 },
    { check: 4 },
    { yesNo: 2 },
    { done: true },
  ];

  useEffect(() => {
    if (screen !== "analyzing") return;
    const step = ANALYSIS_STEPS[analysisStep];
    if (!step) return;

    if (step.done) {
      const t = setTimeout(() => setScreen("email"), reduceMotion ? 150 : 500);
      return () => clearTimeout(t);
    }
    if (step.check !== undefined) {
      const t = setTimeout(() => {
        setChecksDone(step.check!);
        setAnalysisStep((s) => s + 1);
      }, reduceMotion ? 150 : 800);
      return () => clearTimeout(t);
    }
    if (step.yesNo !== undefined) {
      setYesNoIndex(step.yesNo);
      // advances via handleYesNo
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, analysisStep, reduceMotion]);

  // Reset the machine whenever we (re-)enter analyzing.
  useEffect(() => {
    if (screen === "analyzing") {
      setAnalysisStep(0);
      setChecksDone(0);
      setYesNoIndex(-1);
    }
  }, [screen]);

  const handleYesNo = () => {
    setYesNoIndex(-1);
    setAnalysisStep((s) => s + 1);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
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
      setStatus("success");
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

  const inter = pendingInterstitial !== null ? interstitials[pendingInterstitial] : null;

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip" style={{ background: "var(--crema)" }}>
      <Blobs />

      {(screen === "question" || screen === "interstitial") && (
        <div className="sticky top-0 z-30 px-5 pt-5 pb-3 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--crema) 85%, transparent)" }}>
          <div className="mx-auto max-w-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/40">Muévete con Andrea</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/40">{Math.min(questionIndex + 1, total)} / {total}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/8">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--verde) 0%, var(--coral) 100%)" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: EASE }} />
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 mx-auto flex min-h-[calc(100dvh-84px)] flex-col justify-center ${screen === "result" ? "w-full" : "max-w-xl px-5 py-8"}`}>
        <AnimatePresence mode="wait">

          {/* ── QUESTION ─────────────────────────────────────────────────── */}
          {screen === "question" && (
            <motion.div key={`q-${question.id}`} {...screenMotion} className="sm:text-center">
              <StickerFan seed={question.id} />
              <h2 className="mb-7 text-[clamp(1.55rem,5.2vw,2.4rem)] font-bold leading-[1.12] tracking-tight text-foreground sm:mb-9 sm:mx-auto sm:max-w-lg">
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
                      <span className={`shrink-0 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}><CheckIcon size={18} /></span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── INTERSTITIAL (reframe = verde / commit = coral) ──────────── */}
          {screen === "interstitial" && inter && (
            <motion.div key={`int-${pendingInterstitial}`} {...screenMotion} className="text-center">
              <motion.div
                className="relative mx-auto mb-6 h-44 w-44 sm:h-52 sm:w-52"
                initial={{ scale: 0.7, y: 12, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
              >
                <Image
                  src={cartoon3dPath(inter.image)}
                  alt=""
                  fill
                  className="object-contain drop-shadow-[0_10px_28px_rgba(88,45,27,0.18)]"
                  sizes="208px"
                />
              </motion.div>
              <p className="mb-9 text-[clamp(1.15rem,4vw,1.5rem)] font-medium leading-[1.5] text-foreground [&_strong]:font-bold" dangerouslySetInnerHTML={{ __html: inter.text }} />
              <button
                onClick={handleInterstitialContinue}
                className="inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-base font-semibold text-crema shadow-[0_10px_30px_rgba(88,45,27,0.2)] transition-all active:scale-[0.98]"
                style={{ background: inter.kind === "commit" ? "var(--coral)" : "var(--foreground)" }}
              >
                {inter.buttonText}
                <ArrowRight />
              </button>
            </motion.div>
          )}

          {/* ── ANALYZING (+ yes/no overlay) ────────────────────────────── */}
          {screen === "analyzing" && (
            <motion.div key="analyzing" {...screenMotion}>
              <h2 className="mb-8 text-center text-[clamp(1.5rem,5vw,2rem)] font-bold tracking-tight text-foreground">Analizando tus respuestas…</h2>
              <div className="flex flex-col gap-3">
                {loadingChecks.map((check, i) => {
                  const done = i < checksDone;
                  const active = i === checksDone;
                  return (
                    <motion.div key={check} animate={{ opacity: done || active ? 1 : 0.35 }} className="flex items-center gap-4 rounded-2xl border border-foreground/8 bg-white px-5 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: done ? "var(--verde)" : "var(--gray-light)" }}>
                        {done ? (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className="text-white"><CheckIcon size={14} /></motion.span>
                        ) : (active && <span className="h-3 w-3 animate-spin rounded-full border-2 border-foreground/25 border-t-foreground" />)}
                      </span>
                      <span className="text-[15px] font-medium text-foreground/75">{check}</span>
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {yesNoIndex >= 0 && (
                  <motion.div
                    key={`yn-${yesNoIndex}`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6 backdrop-blur-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_24px_60px_rgba(88,45,27,0.25)]"
                      initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <h3 className="mb-6 text-[clamp(1.3rem,4.5vw,1.6rem)] font-bold leading-tight text-foreground">{yesNoQuestions[yesNoIndex]}</h3>
                      <div className="flex gap-3">
                        <button onClick={handleYesNo} className="flex-1 rounded-full bg-foreground px-6 py-3.5 text-base font-semibold text-crema transition-all hover:bg-foreground/88 active:scale-[0.98]">Sí</button>
                        <button onClick={handleYesNo} className="flex-1 rounded-full border-2 border-foreground/15 px-6 py-3.5 text-base font-semibold text-foreground/60 transition-all hover:border-foreground/30 active:scale-[0.98]">Aún no</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── EMAIL GATE ──────────────────────────────────────────────── */}
          {screen === "email" && (
            <motion.div key="email" {...screenMotion}>
              <div className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-[0_16px_50px_rgba(88,45,27,0.10)] sm:p-9">
                <StickerFan seed={profileId.length + 4} />
                <span className="mb-3 block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-verde-dark">Tu plan de 90 días está listo</span>
                <h2 className="mb-3 text-center text-[clamp(1.6rem,5vw,2.2rem)] font-bold leading-[1.1] tracking-tight text-foreground">Ya sabemos quién eres.</h2>
                <p className="mb-7 text-center text-[15px] leading-relaxed text-gray">Déjanos dónde escribirte y verás tu perfil completo — más el plan que Andrea armaría para ti.</p>

                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3.5">
                  <input required name="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="¿Cómo te llamas?" className="w-full rounded-xl border border-foreground/12 bg-crema/40 px-4 py-3.5 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8" />
                  <input required type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" className="w-full rounded-xl border border-foreground/12 bg-crema/40 px-4 py-3.5 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8" />
                  <input type="tel" name="whatsapp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp (opcional)" className="w-full rounded-xl border border-foreground/12 bg-crema/40 px-4 py-3.5 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/8" />
                  <button type="submit" disabled={status === "submitting"} className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4.5 text-base font-semibold text-crema shadow-[0_10px_34px_rgba(88,45,27,0.22)] transition-all hover:bg-foreground/88 active:scale-[0.98] disabled:opacity-60">
                    {status === "submitting" ? "Un momento…" : "Ver mi resultado"}
                    {status !== "submitting" && <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>}
                  </button>
                  {status === "error" && <p className="text-center text-xs font-medium text-coral">Algo salió mal. Intenta de nuevo o escríbenos a hola@mueveteconandrea.com.</p>}
                  <p className="text-center text-xs text-foreground/35">Sin spam. Sin presión. Una conversación honesta.</p>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── RESULT + OFFER ──────────────────────────────────────────── */}
          {screen === "result" && (
            <motion.div key="result" {...screenMotion} className="w-full">

              {/* Full-bleed color splash hero */}
              <div className="relative overflow-hidden px-5 pb-20 pt-14 text-center" style={{ background: profile.color }}>
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/8 blur-3xl" aria-hidden />
                <motion.div
                  className="relative mx-auto mb-4 h-52 w-52 sm:h-60 sm:w-60"
                  initial={{ scale: 0.6, y: 24, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.1 }}
                >
                  <Image src={cartoon3dPath(profile.cartoon)} alt="" fill className="object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.25)]" sizes="240px" priority />
                </motion.div>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">Tu perfil</span>
                <motion.h1
                  className="mb-3 text-[clamp(2.3rem,8vw,3.6rem)] font-bold leading-[0.98] tracking-tight text-white"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45, ease: EASE }}
                >
                  {profile.name}
                </motion.h1>
                <p className="mx-auto max-w-md text-lg font-medium italic text-white/80">{profile.tagline}</p>
                <div className="absolute bottom-0 left-0 w-full leading-none" aria-hidden>
                  <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-10"><path fill="var(--crema)" d="M0 30 Q720 -30 1440 30 L1440 60 L0 60 Z" /></svg>
                </div>
              </div>

              <div className="relative z-10 mx-auto max-w-xl px-5 pb-14">
                {/* Hook chip overlapping the hero curve */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
                  className="-mt-9 mb-8 rounded-2xl border-2 bg-white px-6 py-5 text-center shadow-[0_14px_40px_rgba(88,45,27,0.14)]"
                  style={{ borderColor: profile.color }}
                >
                  <p className="text-[17px] font-bold leading-snug text-foreground">{profile.hook}</p>
                </motion.div>

                {/* Story — transparent on cream */}
                <div className="mb-8 px-1 sm:px-2">
                  {profile.description.split("\n\n").map((para) => <p key={para} className="mb-4 text-[15.5px] leading-relaxed text-foreground/75 last:mb-0">{para}</p>)}
                </div>

                {/* ¿Te suena? — white */}
                <div className="mb-8 rounded-3xl border border-foreground/8 bg-white p-6 sm:p-7">
                  <h3 className="mb-4 text-lg font-bold text-foreground">¿Te suena?</h3>
                  <ul className="space-y-3">
                    {profile.symptoms.map((s, i) => (
                      <motion.li key={s} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.32, ease: EASE }} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: profile.color }} />
                        <span className="text-[15px] leading-snug text-foreground/75">{s}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* La verdad — chocolate */}
                <div className="mb-10 rounded-3xl p-6 sm:p-7" style={{ background: "var(--foreground)" }}>
                  <h3 className="mb-4 text-lg font-bold text-crema">La verdad</h3>
                  {profile.truth.split("\n\n").map((para) => <p key={para} className="mb-3.5 text-[15px] leading-relaxed text-crema/75 last:mb-0">{para}</p>)}
                </div>

                {/* 90-day journey — transparent, numbered month cards */}
                <div className="mb-10">
                  <span className="mb-2 block text-center text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: profile.color }}>Cómo se ven tus 90 días</span>
                  <h3 className="mb-6 text-center text-[clamp(1.4rem,5vw,1.8rem)] font-bold tracking-tight text-foreground">Mes a mes, esto es lo que pasa</h3>
                  <div className="flex flex-col gap-4">
                    {profile.journey.map((m, i) => (
                      <motion.div
                        key={m.month}
                        initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                        className="flex gap-4 rounded-3xl border border-foreground/8 bg-white p-5 sm:p-6"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white" style={{ background: profile.color }}>{i + 1}</div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/40">{m.month}</span>
                          <h4 className="mb-1 text-[16px] font-bold text-foreground">{m.title}</h4>
                          <p className="text-[14px] leading-relaxed text-foreground/70">{m.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Andrea's note — white with photo */}
                <div className="mb-10 rounded-3xl border border-foreground/8 bg-white p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: profile.color }}>
                      <Image src="/andreacoachsevilla-55.webp" alt="Andrea" fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-foreground">Una nota de Andrea</p>
                      <p className="text-[12px] text-foreground/50">para ti, {profile.name}</p>
                    </div>
                  </div>
                  <p className="text-[15px] italic leading-relaxed text-foreground/75">“{profile.andreaNote}”</p>
                  <p className="mt-3 text-right text-[14px] font-semibold" style={{ color: profile.color }}>— Andrea</p>
                </div>

                {/* ── 90-DAY OFFER ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="mb-10 overflow-hidden rounded-3xl text-crema shadow-[0_20px_60px_rgba(88,45,27,0.22)]"
                >
                  <div className="p-7 sm:p-8" style={{ background: `linear-gradient(160deg, var(--foreground) 0%, color-mix(in srgb, ${profile.color} 26%, var(--foreground)) 100%)` }}>
                    <span className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ background: profile.color }}>Transformación 90 días</span>
                    <h3 className="mb-2 text-[clamp(1.5rem,5.5vw,2rem)] font-bold leading-[1.08] tracking-tight text-white">{profile.offer.promise}</h3>
                    <p className="mb-6 text-[15px] leading-relaxed text-crema/70">{profile.offer.subhead}</p>

                    {/* Value anchor */}
                    <div className="mb-6 rounded-2xl bg-white/8 p-4">
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-crema/50">Por separado, esto costaría</p>
                      {valueAnchor.map((v) => (
                        <div key={v.item} className="flex items-baseline justify-between py-1 text-[13.5px]">
                          <span className="text-crema/70">{v.item}</span>
                          <span className="font-semibold text-crema/45 line-through decoration-crema/35">{v.price}</span>
                        </div>
                      ))}
                      <div className="mt-2 border-t border-white/15 pt-2.5 text-right text-[13px] font-semibold text-crema/80">Aquí va todo incluido ↓</div>
                    </div>

                    <div className="mb-6 flex items-baseline gap-2">
                      <span className="text-[clamp(2.4rem,9vw,3.2rem)] font-bold leading-none text-white">{OFFER_PRICE}</span>
                      <span className="text-base font-semibold text-crema/55">{OFFER_CADENCE}</span>
                    </div>

                    <ul className="mb-7 space-y-2.5">
                      {offerIncludes.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: profile.color }}><CheckIcon size={12} /></span>
                          <span className="text-[14.5px] leading-snug text-crema/85">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* TODO: swap mailto for Andrea's real WhatsApp (wa.me/<número>) when available. */}
                    <a
                      href={`mailto:hola@mueveteconandrea.com?subject=${encodeURIComponent("Quiero empezar la transformación de 90 días")}&body=${encodeURIComponent(`Hola Andrea, soy ${form.nombre.split(" ")[0] || ""} — hice el quiz y salí ${profile.name}. Quiero empezar.`)}`}
                      className="flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-bold text-foreground transition-all hover:bg-crema active:scale-[0.98]"
                    >
                      Empezar mi transformación
                      <ArrowRight />
                    </a>
                    <div className="mt-4 rounded-2xl bg-white/10 px-5 py-3.5 text-center">
                      <p className="text-[13px] leading-relaxed text-crema/75">
                        <span className="font-semibold text-white">Ya estás en la lista{form.nombre ? `, ${form.nombre.split(" ")[0]}` : ""} 💛</span>
                        {" "}Andrea te escribe en 48 horas — o adelántate y escríbele tú.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                      {["Sin compromiso", "Respuesta en 48h", "100% acompañada"].map((tag) => (
                        <span key={tag} className="flex items-center gap-1.5 text-[11px] font-semibold text-crema/50"><CheckIcon size={11} />{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* FAQ — her actual objections */}
                <div className="mb-4">
                  <h3 className="mb-5 text-center text-[clamp(1.3rem,4.5vw,1.6rem)] font-bold tracking-tight text-foreground">Lo que seguro te estás preguntando</h3>
                  <div className="flex flex-col gap-3">
                    {profile.faq.map((f) => (
                      <div key={f.q} className="rounded-2xl border border-foreground/8 bg-white p-5">
                        <p className="mb-1.5 text-[15px] font-bold text-foreground">{f.q}</p>
                        <p className="text-[14px] leading-relaxed text-foreground/70">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
