/**
 * Quiz content + scoring data for /contacto/sistema.
 *
 * Ported from the vanilla `quiz-funnel-starter` (Briefed) and rewritten for
 * Muévete con Andrea. Structure kept from the original: questions carry a
 * `profileWeight` map, interstitials fire after a given question id, a fake
 * analysis screen runs, then email capture gates the full result.
 *
 * Voice: neutral Latin American Spanish (tú). No voseo, no vosotras.
 *
 * Unlike the original — which hardcoded its four bucket names across three
 * separate functions — profiles are keyed off PROFILE_IDS, so adding a fifth
 * is a data edit here and nothing else.
 */

export const PROFILE_IDS = ["reiniciadora", "malabarista", "precavida", "nomada"] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export type ProfileScores = Record<ProfileId, number>;

export interface QuizOption {
  id: string;
  text: string;
  emoji: string;
  /** Points added per profile when chosen. Omit for texture-only questions. */
  weight?: Partial<ProfileScores>;
}

export interface QuizQuestion {
  id: number;
  text: string;
  emoji: string;
  options: QuizOption[];
  /** Disqualifying option ids — answering these routes to the "no encaja" ending. */
  disqualifies?: string[];
}

export interface Interstitial {
  /** Shown after the question with this id is answered. */
  afterQuestion: number;
  text: string;
  buttonText: string;
}

export interface Profile {
  id: ProfileId;
  name: string;
  emoji: string;
  tagline: string;
  /** One-line diagnosis shown before the email gate. */
  hook: string;
  color: string;
  accent: string;
  description: string;
  symptoms: string[];
  truth: string;
  /** Ties the profile back to a promise already made on /sistema. */
  promise: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "Sé honesta: ¿cuántas veces has «empezado de nuevo»?",
    emoji: "🔁",
    options: [
      { id: "A", text: "Van como tres", emoji: "🤏", weight: { nomada: 1 } },
      { id: "B", text: "Ya perdí la cuenta", emoji: "🤷‍♀️", weight: { reiniciadora: 2, malabarista: 1 } },
      { id: "C", text: "Cada enero, religiosamente", emoji: "🎆", weight: { reiniciadora: 3 } },
      { id: "D", text: "Prefiero no contarlas", emoji: "😅", weight: { reiniciadora: 2, precavida: 1 } },
    ],
  },
  {
    id: 2,
    text: "Faltaste 3 días. ¿Qué te dices?",
    emoji: "🧠",
    options: [
      { id: "A", text: "«Ya qué, empiezo el lunes»", emoji: "📅", weight: { reiniciadora: 4 } },
      { id: "B", text: "«Otra vez lo mismo de siempre»", emoji: "😞", weight: { reiniciadora: 3, nomada: 1 } },
      { id: "C", text: "«Esta semana estuvo imposible»", emoji: "🌪️", weight: { malabarista: 4 } },
      { id: "D", text: "Retomo donde quedé, sin drama", emoji: "🙂", weight: { precavida: 1, nomada: 1 } },
    ],
  },
  {
    id: 3,
    text: "¿Qué tan predecible es tu semana?",
    emoji: "📅",
    options: [
      { id: "A", text: "Reloj suizo", emoji: "⏰" },
      { id: "B", text: "Casi siempre igual", emoji: "🙂" },
      { id: "C", text: "Cambia mucho", emoji: "🎲" },
      { id: "D", text: "¿Semana? ¿Qué semana?", emoji: "🌀" },
    ],
  },
  {
    id: 4,
    text: "¿Qué te frena más?",
    emoji: "🚧",
    options: [
      { id: "A", text: "No tengo tiempo", emoji: "⏳", weight: { malabarista: 3 } },
      { id: "B", text: "No sé qué hacer", emoji: "🤔", weight: { nomada: 3 } },
      { id: "C", text: "Me da miedo lesionarme", emoji: "🤕", weight: { precavida: 3 } },
      { id: "D", text: "Me aburro", emoji: "🥱", weight: { nomada: 3 } },
      { id: "E", text: "Me da pena que me vean", emoji: "👀", weight: { precavida: 2, reiniciadora: 1 } },
    ],
  },
  {
    id: 5,
    text: "Tu cuerpo hoy: ¿cómo lo sientes?",
    emoji: "🫀",
    options: [
      { id: "A", text: "Fuerte", emoji: "💪" },
      { id: "B", text: "Cansado pero bien", emoji: "😌" },
      { id: "C", text: "Frágil, me cuido", emoji: "🥺" },
      { id: "D", text: "Ajeno — no me reconozco", emoji: "🪞" },
    ],
  },
  {
    id: 6,
    text: "Cuando entrenas, ¿qué buscas?",
    emoji: "✨",
    options: [
      { id: "A", text: "Sentirme fuerte", emoji: "🔥" },
      { id: "B", text: "Bajar el estrés", emoji: "🧘‍♀️" },
      { id: "C", text: "Verme distinta", emoji: "👗" },
      { id: "D", text: "Un rato para mí", emoji: "🫶" },
    ],
  },
  {
    id: 7,
    text: "¿Qué pasó la última vez que lo dejaste?",
    emoji: "💔",
    options: [
      { id: "A", text: "Me quemé, arranqué muy fuerte", emoji: "🕯️", weight: { reiniciadora: 4 } },
      { id: "B", text: "Cambió mi rutina y no volví", emoji: "🔀", weight: { malabarista: 4 } },
      { id: "C", text: "Me lesioné o me dio miedo", emoji: "🤕", weight: { precavida: 4 } },
      { id: "D", text: "No vi resultados y me aburrí", emoji: "😑", weight: { nomada: 4 } },
    ],
  },
  {
    id: 8,
    text: "¿Qué esperas de un coach?",
    emoji: "🤝",
    disqualifies: ["C", "D"],
    options: [
      { id: "A", text: "Que me acompañe", emoji: "🫱" },
      { id: "B", text: "Que me arme el plan y ya", emoji: "📋" },
      { id: "C", text: "Que me exija fuerte", emoji: "😤" },
      { id: "D", text: "Que me presione diario", emoji: "📣" },
    ],
  },
  {
    id: 9,
    text: "Si esto funcionara, ¿qué cambiaría?",
    emoji: "🌱",
    options: [
      { id: "A", text: "Me sentiría orgullosa", emoji: "🥹" },
      { id: "B", text: "Dejaría de sentirme culpable", emoji: "🕊️" },
      { id: "C", text: "Tendría energía", emoji: "🔋" },
      { id: "D", text: "Confiaría en mí otra vez", emoji: "💛" },
    ],
  },
];

/**
 * Shown between question blocks. These carry the "no es tu culpa" argument —
 * the core of Andrea's positioning — so they earn their interruption.
 */
export const interstitials: Interstitial[] = [
  {
    afterQuestion: 2,
    text: "Ese «empiezo el lunes» no es falta de fuerza de voluntad.<br><br>Es lo que pasa cuando un plan se rompe apenas la vida se mueve un poco. <strong>El plan falló. Tú no.</strong>",
    buttonText: "Sigue",
  },
  {
    afterQuestion: 4,
    text: "La mayoría de los programas están diseñados para rutinas ideales.<br><br>Para semanas que no existen, para cuerpos que no se cansan, para mujeres sin trabajo, sin hijos y sin imprevistos.<br><br><strong>Y cuando tu vida real no cabe ahí, te culpas tú.</strong>",
    buttonText: "Uf, sí",
  },
  {
    afterQuestion: 7,
    text: "Aquí va lo importante:<br><br>No necesitas más disciplina. Necesitas un sistema que <strong>ya cuente</strong> con que vas a tener días malos.<br><br>Porque los vas a tener. Y ahí es donde todo lo demás se cae — y donde esto empieza.",
    buttonText: "Quiero eso",
  },
];

export const loadingChecks = [
  "Leyendo tus respuestas",
  "Buscando tu patrón",
  "Comparando con mujeres como tú",
  "Armando tu diagnóstico",
];

export const profiles: Record<ProfileId, Profile> = {
  reiniciadora: {
    id: "reiniciadora",
    name: "La Reiniciadora",
    emoji: "🔁",
    tagline: "Tienes 47 semanas número uno.",
    hook: "No te falta fuerza de voluntad. Te sobran lunes.",
    color: "var(--coral)",
    accent: "var(--coral-light)",
    description: `Empiezas con todo. Con ganas, con ropa nueva, con la app descargada y el plan impreso. Y funciona — dos semanas, tres si el mes viene bueno.

Después la vida hace lo que hace. Faltas un día. Luego dos. Y ahí aparece la voz: «ya qué, empiezo el lunes».

El lunes llega. A veces empiezas. A veces no. Y cada vez que no, se suma a una cuenta que llevas contigo hace años.`,
    symptoms: [
      "Arrancas al 100% y te quemas antes del mes",
      "Un día perdido se convierte en una semana perdida",
      "«El lunes» es tu palabra favorita y la que más te duele",
      "Has pagado gimnasios a los que casi no fuiste",
      "Ya perdiste la cuenta de cuántas veces empezaste",
      "Te sientes fracasada por algo que nunca fue tu culpa",
    ],
    truth: `El problema nunca fue tu fuerza de voluntad — mira todo lo que has empezado. Ese es alguien que no se rinde.

El problema es que cada programa que probaste te pedía perfección, y al primer día imperfecto te dejó sin plan B. Cuando el sistema no tiene forma de retomar, la única opción que queda es empezar de cero. Y empezar de cero, una y otra vez, agota a cualquiera.`,
    promise: "Aquí no empiezas de cero. Aquí retomas.",
  },
  malabarista: {
    id: "malabarista",
    name: "La Malabarista",
    emoji: "🤹‍♀️",
    tagline: "Sostienes todo. Menos a ti.",
    hook: "Tu semana no es el problema. El plan que no la contempla, sí.",
    color: "var(--blue)",
    accent: "var(--blue-light)",
    description: `Tu semana no se parece a la de nadie. Trabajo, casa, gente que depende de ti, imprevistos que aparecen sin avisar.

Sabes moverte. De hecho, no paras. Pero cuando llega el momento de hacer algo por ti, ya no queda nada — ni tiempo, ni energía, ni turno.

Siempre eres la última de tu propia lista.`,
    symptoms: [
      "Tu semana cambia y el plan de entrenamiento no",
      "Entrenas cuando «sobra» tiempo — y nunca sobra",
      "Te sientes culpable si tomas una hora para ti",
      "Cancelas lo tuyo antes que lo de cualquier otro",
      "Cuando tu rutina se rompe, no vuelves",
      "Estás cansada, pero de sostener, no de moverte",
    ],
    truth: `No te falta compromiso. Sostienes a todo el mundo — eso es compromiso puro.

Lo que falla es el diseño. Te dieron un plan que asume una semana estable, y tu semana no lo es ni lo será. Un sistema que solo funciona cuando todo sale perfecto no es un sistema: es una apuesta. Y tú no puedes apostar tu bienestar.`,
    promise: "El sistema se adapta a tu semana — no al revés.",
  },
  precavida: {
    id: "precavida",
    name: "La Precavida",
    emoji: "🐢",
    tagline: "Tu cuerpo te habla. Tú escuchas.",
    hook: "No eres exagerada. Eres la única que se escucha.",
    color: "var(--verde-dark)",
    accent: "var(--verde-light)",
    description: `Hubo un antes y un después. Una lesión, un embarazo, un dolor que no se fue, o simplemente un cuerpo que ya no responde como respondía.

Desde entonces te mueves con cuidado. Y con razón — pagaste caro el aprendizaje.

Pero el cuidado se volvió freno. No porque no quieras moverte, sino porque nadie te ha dicho qué es seguro para ti. Y ante la duda, mejor no.`,
    symptoms: [
      "Te frenas por miedo a lesionarte otra vez",
      "No sabes qué ejercicios son seguros para tu cuerpo",
      "Los videos genéricos te dan más miedo que confianza",
      "Sientes que tu cuerpo ya no es el de antes",
      "Te da pena preguntar o que te vean sin saber",
      "Te han dicho «no es para tanto» y sabes que sí",
    ],
    truth: `No eres exagerada. Eres la única persona que vive dentro de tu cuerpo, y estás haciendo exactamente lo que hay que hacer: escucharlo.

Lo que te falta no es valentía. Es información. Necesitas saber qué es seguro para ti hoy — no para una mujer promedio de un video — y una progresión que empiece donde estás, no donde estabas.`,
    promise: "Entrenar no es hacerlo perfecto. Es aprender a regularte.",
  },
  nomada: {
    id: "nomada",
    name: "La Nómada",
    emoji: "🧭",
    tagline: "Lo has probado todo. Nada se quedó.",
    hook: "No te aburres del ejercicio. Te aburres de no ir a ningún lado.",
    color: "var(--foreground)",
    accent: "var(--beige-dark)",
    description: `Yoga. Spinning. Pesas. La app del momento. El reto de 30 días. Los has probado casi todos.

Y no es que no te guste moverte — te gusta. El problema es que a las pocas semanas aparece esa sensación: ¿esto para qué? ¿Estoy avanzando o solo estoy ocupada?

Cuando no ves para dónde vas, cualquier excusa alcanza para parar.`,
    symptoms: [
      "Saltas de actividad en actividad buscando la buena",
      "Te aburres a las pocas semanas, siempre",
      "No sabes si estás progresando o solo sudando",
      "Empiezas retos que nunca terminas",
      "Sientes que te mueves mucho y avanzas poco",
      "Necesitas sentido, no solo rutina",
    ],
    truth: `No tienes déficit de atención ni falta de compromiso. Tienes buen olfato: te aburres de lo que no lleva a ningún lado, y tienes razón en aburrirte.

Lo que nunca te dieron fue dirección. Ejercicios sueltos no son un camino. Sin progresión visible, sin saber por qué haces lo que haces hoy y qué viene después, tu cabeza desconecta — y hace bien.`,
    promise: "Aquí no se trata de exigirte más. Se trata de sostenerte mejor.",
  },
};

/** Sums option weights into a score per profile. Highest wins; ties break by PROFILE_IDS order. */
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

/** True when she picked an option that /sistema explicitly says isn't a fit. */
export function isDisqualified(answers: Record<number, string>): boolean {
  return quizQuestions.some((q) => q.disqualifies?.includes(answers[q.id]));
}
