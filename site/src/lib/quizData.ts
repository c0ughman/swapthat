/**
 * Quiz content + scoring data for /contacto/sistema.
 *
 * Muévete con Andrea — 15-question funnel that routes into one of four profiles,
 * each ending in a profile-specific 90-day transformation offer.
 *
 * Question blocks:
 *   P1–P9   score toward a profile (montañarusa | dellunes | estancada | quevuelve)
 *   P10–P12 qualify — no profile weight; give Andrea intel to plan the client
 *   P13–P15 emotional closers — no weight; soften the ground before the offer
 *
 * Voice: neutral Panamanian Spanish (tú). Clear and instinctual over clever.
 *
 * Profiles are keyed off PROFILE_IDS, so adding a fifth is a data edit here.
 */

export const PROFILE_IDS = ["montanarusa", "dellunes", "estancada", "quevuelve"] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export type ProfileScores = Record<ProfileId, number>;

export interface QuizOption {
  id: string;
  text: string;
  emoji: string;
  /** Points added per profile when chosen. Omit for qualifying/texture/emotional questions. */
  weight?: Partial<ProfileScores>;
}

/** "profile" scores; "qualify" is intel for Andrea; "emotion" softens the ground. */
export type QuestionKind = "profile" | "qualify" | "emotion";

export interface QuizQuestion {
  id: number;
  text: string;
  emoji: string;
  kind: QuestionKind;
  options: QuizOption[];
}

export type InterstitialKind = "reframe" | "commit";

export interface Interstitial {
  /** Shown after the question with this id is answered. */
  afterQuestion: number;
  kind: InterstitialKind;
  text: string;
  buttonText: string;
  /** 3D cartoon (public/cartoons/3d, transparent bg) shown above the text. */
  image: string;
}

export interface Offer {
  /** Profile-specific promise headline for the 90-day program. */
  promise: string;
  /** One line under the headline. */
  subhead: string;
}

export interface Profile {
  id: ProfileId;
  name: string;
  emoji: string;
  tagline: string;
  /** One-line diagnosis shown in a colored band. */
  hook: string;
  color: string;
  accent: string;
  description: string;
  symptoms: string[];
  truth: string;
  offer: Offer;
}

export const quizQuestions: QuizQuestion[] = [
  // ── P1–P9 · PROFILE ────────────────────────────────────────────────────────
  {
    id: 1,
    text: "¿Cuál te describe hoy?",
    emoji: "🏁",
    kind: "profile",
    options: [
      { id: "A", text: "Nunca he entrenado en serio", emoji: "🌱", weight: { dellunes: 3 } },
      { id: "B", text: "Empiezo y lo dejo, siempre", emoji: "🎢", weight: { montanarusa: 3 } },
      { id: "C", text: "Entreno, pero estancada", emoji: "📈", weight: { estancada: 3 } },
      { id: "D", text: "Antes entrenaba, me salí", emoji: "🌅", weight: { quevuelve: 3 } },
    ],
  },
  {
    id: 2,
    text: "¿Qué es lo que más te frena?",
    emoji: "🚧",
    kind: "profile",
    options: [
      { id: "A", text: "Nunca encuentro el momento", emoji: "⏳", weight: { dellunes: 3 } },
      { id: "B", text: "Me aburro y lo dejo", emoji: "🥱", weight: { montanarusa: 3 } },
      { id: "C", text: "Hago todo y no avanzo", emoji: "😤", weight: { estancada: 3 } },
      { id: "D", text: "Mi cuerpo ya no es el mismo", emoji: "🪞", weight: { quevuelve: 3 } },
    ],
  },
  {
    id: 3,
    text: "Faltaste una semana. ¿Qué pasa?",
    emoji: "📆",
    kind: "profile",
    options: [
      { id: "A", text: "Vuelvo a cero, como siempre", emoji: "🔁", weight: { montanarusa: 3 } },
      { id: "B", text: "«El lunes empiezo»… otra vez", emoji: "📅", weight: { dellunes: 3 } },
      { id: "C", text: "Retomo sin drama", emoji: "🙂", weight: { estancada: 2 } },
      { id: "D", text: "Me cuesta más de lo que quisiera", emoji: "😮‍💨", weight: { quevuelve: 3 } },
    ],
  },
  {
    id: 4,
    text: "Cuando buscas cómo entrenar…",
    emoji: "🔍",
    kind: "profile",
    options: [
      { id: "A", text: "Me ahogo en información", emoji: "🌊", weight: { dellunes: 3 } },
      { id: "B", text: "Pruebo algo nuevo cada mes", emoji: "🎲", weight: { montanarusa: 3 } },
      { id: "C", text: "Ya sé qué hacer", emoji: "✅", weight: { estancada: 3 } },
      { id: "D", text: "No sé qué es seguro para mí ahora", emoji: "🤕", weight: { quevuelve: 3 } },
    ],
  },
  {
    id: 5,
    text: "¿Qué tan predecible es tu semana?",
    emoji: "🗓️",
    kind: "profile",
    options: [
      { id: "A", text: "Un caos total", emoji: "🌀", weight: { montanarusa: 1, dellunes: 1 } },
      { id: "B", text: "Cambia mucho", emoji: "🎲", weight: { montanarusa: 1 } },
      { id: "C", text: "Más o menos estable", emoji: "🙂" },
      { id: "D", text: "Bastante fija", emoji: "⏰", weight: { estancada: 1 } },
    ],
  },
  {
    id: 6,
    text: "¿Qué buscas de verdad?",
    emoji: "✨",
    kind: "profile",
    options: [
      { id: "A", text: "Sentirme fuerte otra vez", emoji: "🔥", weight: { quevuelve: 1 } },
      { id: "B", text: "Verme distinta", emoji: "👗", weight: { estancada: 1 } },
      { id: "C", text: "Bajar el estrés", emoji: "🧘‍♀️" },
      { id: "D", text: "Un rato para mí", emoji: "🫶" },
    ],
  },
  {
    id: 7,
    text: "¿Cómo te sientes con tu cuerpo hoy?",
    emoji: "🪞",
    kind: "profile",
    options: [
      { id: "A", text: "No me reconozco", emoji: "💔", weight: { quevuelve: 3 } },
      { id: "B", text: "Frustrada, no cambia", emoji: "😣", weight: { estancada: 3 } },
      { id: "C", text: "Culpable, sé que puedo más", emoji: "😔", weight: { dellunes: 3 } },
      { id: "D", text: "En una montaña rusa", emoji: "🎢", weight: { montanarusa: 3 } },
    ],
  },
  {
    id: 8,
    text: "¿Qué te falta para lograrlo?",
    emoji: "🔑",
    kind: "profile",
    options: [
      { id: "A", text: "Que alguien me haga arrancar", emoji: "🚀", weight: { dellunes: 3 } },
      { id: "B", text: "Algo que pueda sostener", emoji: "🌿", weight: { montanarusa: 3 } },
      { id: "C", text: "Quien me exija el siguiente nivel", emoji: "💪", weight: { estancada: 3 } },
      { id: "D", text: "Una vuelta segura y guiada", emoji: "🛟", weight: { quevuelve: 3 } },
    ],
  },
  {
    id: 9,
    text: "Si funcionara, en 90 días…",
    emoji: "🌱",
    kind: "profile",
    options: [
      { id: "A", text: "Estaría orgullosa de mí", emoji: "🥹" },
      { id: "B", text: "Volvería a sentirme yo", emoji: "💛", weight: { quevuelve: 1 } },
      { id: "C", text: "Tendría energía de sobra", emoji: "🔋" },
      { id: "D", text: "Confiaría en mí otra vez", emoji: "✨" },
    ],
  },

  // ── P10–P12 · QUALIFY (intel for Andrea, no profile weight) ─────────────────
  {
    id: 10,
    text: "¿Cuánto tiempo real tienes para ti a la semana?",
    emoji: "⏱️",
    kind: "qualify",
    options: [
      { id: "A", text: "Casi nada, ando full", emoji: "🏃‍♀️" },
      { id: "B", text: "2–3 horas si me organizo", emoji: "🗂️" },
      { id: "C", text: "4–5 horas, tengo espacio", emoji: "🌤️" },
      { id: "D", text: "El tiempo no es mi problema", emoji: "😌" },
    ],
  },
  {
    id: 11,
    text: "¿Dónde entrenarías?",
    emoji: "📍",
    kind: "qualify",
    options: [
      { id: "A", text: "En casa, sin equipo", emoji: "🏠" },
      { id: "B", text: "En casa, con algo de equipo", emoji: "🏋️‍♀️" },
      { id: "C", text: "En el gimnasio", emoji: "💪" },
      { id: "D", text: "Al aire libre / mixto", emoji: "🌳" },
    ],
  },
  {
    id: 12,
    text: "¿Qué tan en serio vas esta vez?",
    emoji: "🎯",
    kind: "qualify",
    options: [
      { id: "A", text: "Solo estoy viendo", emoji: "👀" },
      { id: "B", text: "Con ganas, pero insegura", emoji: "🤞" },
      { id: "C", text: "Lista, solo necesito guía", emoji: "🙌" },
      { id: "D", text: "Cien por ciento, lo que sea", emoji: "🔥" },
    ],
  },

  // ── P13–P15 · EMOTIONAL CLOSERS (no weight) ────────────────────────────────
  {
    id: 13,
    text: "¿Cuánto llevas diciéndote «tengo que hacer algo»?",
    emoji: "🕰️",
    kind: "emotion",
    options: [
      { id: "A", text: "Unos meses", emoji: "🌙" },
      { id: "B", text: "Un año, más o menos", emoji: "📆" },
      { id: "C", text: "Años", emoji: "⌛" },
      { id: "D", text: "Ni me acuerdo ya", emoji: "🫥" },
    ],
  },
  {
    id: 14,
    text: "Imagina que ya lo lograste. ¿Qué sientes primero?",
    emoji: "💭",
    kind: "emotion",
    options: [
      { id: "A", text: "Orgullo", emoji: "🥹" },
      { id: "B", text: "Alivio", emoji: "🕊️" },
      { id: "C", text: "Energía", emoji: "⚡" },
      { id: "D", text: "«Por fin»", emoji: "🙌" },
    ],
  },
  {
    id: 15,
    text: "¿Qué pasa si en un año sigues igual?",
    emoji: "🪞",
    kind: "emotion",
    options: [
      { id: "A", text: "No quiero ni pensarlo", emoji: "😰" },
      { id: "B", text: "Me frustraría muchísimo", emoji: "😔" },
      { id: "C", text: "Sería otra oportunidad perdida", emoji: "💔" },
      { id: "D", text: "No pienso dejar que pase", emoji: "💥" },
    ],
  },
];

/**
 * Two reframes ("no es tu culpa") in the first half, two commitment prompts in
 * the second. Commitment interstitials use a coral ground and a first-person
 * button so tapping it is a small yes.
 */
export const interstitials: Interstitial[] = [
  {
    afterQuestion: 3,
    kind: "reframe",
    text: "Ese «el lunes empiezo» no es falta de disciplina.<br><br><strong>Es lo que pasa cuando un plan no cuenta con la vida real.</strong>",
    buttonText: "Sigue",
    image: "couch.png",
  },
  {
    afterQuestion: 6,
    kind: "reframe",
    text: "La mayoría de los programas se diseñan para semanas perfectas.<br><br><strong>Y cuando la tuya no lo es, te culpas tú. No debería ser así.</strong>",
    buttonText: "Uf, sí",
    image: "clock.png",
  },
  {
    afterQuestion: 9,
    kind: "commit",
    text: "Vas por la mitad y ya lo estás sintiendo.<br><br><strong>Lo que sigue no es otra rutina. Es un cambio que puedes sostener.</strong>",
    buttonText: "Estoy lista",
    image: "front.png",
  },
  {
    afterQuestion: 12,
    kind: "commit",
    text: "Ya casi sabemos quién eres y qué necesitas.<br><br><strong>Solo falta una cosa: que decidas que esta vez sí.</strong>",
    buttonText: "Voy con todo",
    image: "run.png",
  },
];

export const loadingChecks = [
  "Leyendo tus respuestas",
  "Encontrando tu patrón",
  "Comparando con mujeres como tú",
  "Armando tu plan de 90 días",
];

/** Yes/no prompts shown over the analysis screen — micro-commitments. */
export const yesNoQuestions = [
  "¿Estás lista para un cambio de verdad?",
  "¿Te comprometes contigo estos 90 días?",
  "¿Confías en que con la guía correcta lo logras?",
];

export const OFFER_PRICE = "$500";
export const OFFER_CADENCE = "/ mes · 3 meses";

/** What every 90-day program includes. Sold as an outcome, not a feature list. */
export const offerIncludes = [
  "Llamada de arranque + plan a 3 meses",
  "Evaluación de nutrición",
  "Seguimiento y reportes cada 2 semanas",
  "Acompañamiento constante contigo",
  "Acceso a eventos de entrenamiento",
];

export const profiles: Record<ProfileId, Profile> = {
  montanarusa: {
    id: "montanarusa",
    name: "La Montaña Rusa",
    emoji: "🎢",
    tagline: "Empiezas, ves resultados, lo dejas. Y otra vez.",
    hook: "No es que falles. Es que siempre vuelves a empezar.",
    color: "var(--coral)",
    accent: "var(--coral-light)",
    description: `Lo conoces de memoria. Arrancas con todo, las primeras semanas se sienten increíbles, ves cambios. Y justo cuando agarras ritmo, la vida aprieta — trabajo, viaje, cansancio — o simplemente te aburres.

Lo dejas. «Es solo esta semana». Pero una semana se vuelve un mes, y cuando quieres volver, ya perdiste casi todo lo que ganaste.

Así que vuelves a empezar. Desde cero. Otra vez. Y esta vez cuesta más.`,
    symptoms: [
      "Arrancas al 100% y te apagas antes del mes",
      "Ves resultados, los dejas, y los pierdes",
      "Cada regreso duele más que el anterior",
      "Te aburres justo cuando ibas bien",
      "Ya perdiste la cuenta de cuántas veces empezaste",
      "Sabes que puedes — el problema es sostenerlo",
    ],
    truth: `El problema nunca fue tu fuerza de voluntad. Mira todo lo que has empezado: eso es alguien que no se rinde.

El problema es que cada plan que probaste era rígido — al primer tropiezo te dejó sin salida, y la única opción fue caer a cero. Nadie te dio un sistema que se doblara sin romperse. Con la estructura correcta, un mal día es solo un mal día, no el final.`,
    offer: {
      promise: "90 días para romper el ciclo",
      subhead: "Deja de empezar de cero. Esta vez lo sostienes — con un sistema que aguanta tus semanas reales.",
    },
  },
  dellunes: {
    id: "dellunes",
    name: "La del Lunes",
    emoji: "📅",
    tagline: "Siempre «la próxima semana». Y cuando buscas cómo, te ahogas.",
    hook: "Lo estás posponiendo tanto que ya duele.",
    color: "var(--blue)",
    accent: "var(--blue-light)",
    description: `Sabes que tienes que hacer algo. Lo sabes hace tiempo. Pero nunca es el momento — la semana que viene, cuando baje el trabajo, cuando esté más tranquila.

Y las pocas veces que te decides a buscar cómo, te encuentras con mil rutinas, dietas que se contradicen, una influencer que dice una cosa y otra lo contrario. Te abruma. Cierras la pestaña. «El lunes».

Nunca estás donde quieres estar, porque nunca empezaste de verdad.`,
    symptoms: [
      "«El lunes empiezo» es tu frase de cabecera",
      "Buscas información y terminas paralizada",
      "Tanto consejo contradictorio que mejor nada",
      "Sientes culpa por no arrancar de una vez",
      "Sabes exactamente qué quieres, pero no cómo",
      "Llevas meses (¿años?) posponiéndote",
    ],
    truth: `No eres floja. Postergar no es pereza — es lo que pasa cuando hay tanto ruido que empezar se siente imposible.

No necesitas más información. Necesitas menos: una sola voz, un solo plan, un primer paso claro para mañana. Alguien que te quite el ruido de encima y te diga exactamente qué hacer. Ahí la parálisis desaparece.`,
    offer: {
      promise: "90 días para arrancar y no parar",
      subhead: "Sin ruido, sin mil opciones. Un solo plan claro — y alguien que te hace dar el primer paso.",
    },
  },
  estancada: {
    id: "estancada",
    name: "La Estancada",
    emoji: "📈",
    tagline: "Entrenas. Lo haces bien. Pero la aguja dejó de moverse.",
    hook: "Trabajas duro. ¿Por qué no avanzas?",
    color: "var(--verde-dark)",
    accent: "var(--verde-light)",
    description: `Tú sí apareces. Entrenas, cumples, sudas. No eres de las que abandonan — llevas tiempo siendo constante y estás orgullosa de eso.

Pero hace meses que ves lo mismo en el espejo. El mismo peso, la misma fuerza, la misma foto. Haces todo «bien» y la aguja no se mueve.

Y empiezas a dudar de ti, cuando en realidad hiciste tu parte. El que se quedó sin ideas fue el plan.`,
    symptoms: [
      "Eres constante, pero el progreso se frenó",
      "Haces todo «bien» y no ves cambios",
      "Llevas meses con el mismo peso y la misma fuerza",
      "Empiezas a dudar de ti sin razón",
      "Nadie ajusta ni mide lo que haces",
      "Sabes que puedes más — te falta quién te lleve",
    ],
    truth: `No estás estancada por falta de esfuerzo. Estás estancada porque el cuerpo se acostumbra, y lo que te trajo hasta aquí no es lo que te lleva al siguiente nivel.

Necesitas a alguien que mida, ajuste y te exija con criterio — que vea lo que tú, adentro del proceso, ya no puedes ver. Un pequeño cambio en las variables correctas rompe el estancamiento. No más esfuerzo: esfuerzo dirigido.`,
    offer: {
      promise: "90 días para desbloquear tu progreso",
      subhead: "Ya haces el trabajo. Ahora alguien lo mide, lo ajusta y te exige el siguiente nivel.",
    },
  },
  quevuelve: {
    id: "quevuelve",
    name: "La que Vuelve",
    emoji: "🌅",
    tagline: "Antes entrenabas. Un bebé, una lesión, la vida — y te saliste.",
    hook: "Tu cuerpo cambió. Tú sigues siendo tú.",
    color: "var(--naranja-calido)",
    accent: "color-mix(in srgb, var(--naranja-calido) 30%, white)",
    description: `Hubo una época en que esto era tuyo. Entrenabas, sabías lo que hacías, te sentías fuerte. Y entonces llegó algo más grande — un embarazo, una lesión, un año imposible — y te saliste.

Ahora te miras al espejo y no siempre te reconoces. Una parte de ti extraña a la que eras. Otra tiene miedo de que sea tarde, de que el cuerpo ya no responda. Y otra, impaciente, odia estar en la casilla de salida sabiendo dónde estabas.

No empiezas de cero. Vuelves. Es distinto.`,
    symptoms: [
      "Te miras al espejo y no te reconoces del todo",
      "Extrañas a la que eras y quieres recuperarla",
      "Tienes miedo de que sea tarde o de lesionarte",
      "Tu cuerpo cambió y las viejas rutinas ya no van",
      "Tienes la memoria muscular, pero no el punto",
      "Odias estar en la salida sabiendo dónde llegaste",
    ],
    truth: `No perdiste lo que eras — lo tienes guardado. La constancia, la fuerza mental, saber entrenar: eso no se borra. Está esperando.

Pero volver como si nada cambió es como te lesionas. Tu cuerpo hoy es distinto, y merece una rampa segura: una progresión que empiece donde estás, respete lo que viviste y te devuelva a tu mejor versión sin romperte en el intento.`,
    offer: {
      promise: "90 días para volver a tu mejor versión",
      subhead: "Sin empezar de cero y sin lesionarte. Una vuelta segura y guiada, a tu ritmo, hasta reencontrarte.",
    },
  },
};

/** Sums option weights per profile. Highest wins; ties break by PROFILE_IDS order. */
export function calculateProfile(answers: Record<number, string>): ProfileId {
  const scores = Object.fromEntries(PROFILE_IDS.map((id) => [id, 0])) as ProfileScores;

  for (const question of quizQuestions) {
    const chosen = question.options.find((o) => o.id === answers[question.id]);
    if (!chosen?.weight) continue;
    for (const [profileId, points] of Object.entries(chosen.weight)) {
      scores[profileId as ProfileId] += points ?? 0;
    }
  }

  return PROFILE_IDS.reduce((best, id) => (scores[id] > scores[best] ? id : best), PROFILE_IDS[0]);
}
