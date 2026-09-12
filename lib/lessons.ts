// Sistema general de lecciones: 1 player, N cursos.
//
// La UI (app/leccion) solo conoce estas primitivas. Un curso nuevo NUNCA
// trae componentes: trae datos que encajan aquí. La IA, cuando genere,
// solo puede emitir JSON válido contra este schema (allowlist cerrada).
//
// Tipos investigados del wiki canónico de ejercicios Duolingo + Memrise:
// choice = Mark the correct meaning · complete = Complete the translation
// tf = Read and respond · order = Arrange / Sentence shuffle
// match = Tap the pairs · write = Translation (type it)
// listen = What do you hear? · dictate = Type what you hear
// speak = Speak this sentence · spot = Find the error
// recall = flashcard auto-calificada estilo Leitner.

export type Primitive =
  | "choice" | "complete" | "tf" | "order" | "match" | "write"
  | "listen" | "dictate" | "speak" | "spot" | "recall";

export interface BaseStep {
  kind: Primitive;
  q: string;
  why: string;
}

export interface ChoiceStep extends BaseStep {
  kind: "choice";
  options: string[];
  answer: number;
}

export interface CompleteStep extends BaseStep {
  kind: "complete";
  pre: string;
  post: string;
  options: string[];
  answer: string;
}

export interface TfStep extends BaseStep {
  kind: "tf";
  answer: boolean;
}

export interface OrderStep extends BaseStep {
  kind: "order";
  tokens: string[];
  answer: string[];
}

export interface MatchStep extends BaseStep {
  kind: "match";
  pairs: [string, string][];
}

export interface WriteStep extends BaseStep {
  kind: "write";
  answer: string;
  acceptable?: string[];
  hint?: string;
}

export interface ListenStep extends BaseStep {
  kind: "listen";
  /** Ruta en public/audio, generada con Piper TTS local. */
  audio: string;
  transcript: string;
  options: string[];
  answer: number;
}

export interface DictateStep extends BaseStep {
  kind: "dictate";
  audio: string;
  answer: string;
  acceptable?: string[];
}

export interface SpeakStep extends BaseStep {
  kind: "speak";
  /** Texto a decir en voz alta. */
  text: string;
  /** Se usa como reverso si el navegador no tiene micrófono. */
  hint: string;
}

export interface SpotStep extends BaseStep {
  kind: "spot";
  lines: string[];
  /** Índice de la línea incorrecta. */
  answer: number;
}

export interface RecallStep extends BaseStep {
  kind: "recall";
  front: string;
  back: string;
}

export type Step =
  | ChoiceStep | CompleteStep | TfStep | OrderStep | MatchStep | WriteStep
  | ListenStep | DictateStep | SpeakStep | SpotStep | RecallStep;

export interface Lesson {
  id: string;
  course: string;
  title: string;
  intro: { heading: string; body: string; example?: string[]; mono?: boolean };
  steps: Step[];
}

/** Capacidades declaradas por curso. Lo que falta, se degrada (ver adaptSteps). */
export interface CourseCaps {
  /** "piper" = hay clips generados. "none" = los pasos de audio se degradan. */
  audio: "piper" | "none";
  /** true = bloques de código en monoespaciado. */
  code: boolean;
}

export const COURSE_CAPS: Record<string, CourseCaps> = {
  python: { audio: "piper", code: true },
  japones: { audio: "none", code: false },
  musica: { audio: "none", code: false },
};

/**
 * Degradación elegante: un paso de audio sin voz disponible se convierte
 * en su equivalente silencioso SIN perder la pedagogía.
 * listen(audio) -> choice · dictate(audio) -> write · speak -> recall.
 */
export function adaptSteps(steps: Step[], caps: CourseCaps): Step[] {
  if (caps.audio === "piper") return steps;
  return steps.map((s) => {
    if (s.kind === "dictate") {
      const { audio: _a, ...rest } = s;
      return { ...rest, kind: "write" } as WriteStep;
    }
    if (s.kind === "listen") {
      const { audio: _a, transcript: _t, ...rest } = s;
      return { ...rest, kind: "choice" } as ChoiceStep;
    }
    if (s.kind === "speak") {
      return { kind: "recall", q: "Dilo en voz alta", why: s.why, front: s.text, back: s.hint } as RecallStep;
    }
    return s;
  });
}

export function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/[…\s]+/g, " ").replace(/[?!¡¿.,;:]+$/g, "");
}

export function isCorrect(ex: Step, sel: unknown): boolean {
  if (sel === null || sel === undefined) return false;
  switch (ex.kind) {
    case "choice":
    case "tf":
    case "complete":
    case "spot":
      return sel === ex.answer;
    case "order":
      return Array.isArray(sel) && sel.join("|") === ex.answer.join("|");
    case "match": {
      if (typeof sel !== "object" || sel === null || Array.isArray(sel)) return false;
      const m = sel as Record<string, string>;
      return ex.pairs.every(([l, r]) => m[l] === r) && Object.keys(m).length === ex.pairs.length;
    }
    case "write":
    case "dictate": {
      if (typeof sel !== "string") return false;
      const n = normalizeText(sel);
      return n.length > 0 && (n === normalizeText(ex.answer) || (ex.acceptable ?? []).some((a) => normalizeText(a) === n));
    }
    case "listen":
      return sel === ex.answer;
    case "speak":
      return sel === true;
    case "recall":
      return sel === true;
    default:
      return false;
  }
}

/* ---------------- Lecciones demo (contenido, no UI) ---------------- */

const PYTHON_VARIABLES: Lesson = {
  id: "u2n1",
  course: "python",
  title: "Variables",
  intro: {
    heading: "La idea en 30 segundos",
    body: "Una variable es una caja con nombre para tus datos. La creas con un solo igual y Python recuerda lo que guardaste.",
    example: ['edad = 7', 'print(edad)', '# → 7'],
    mono: true,
  },
  steps: [
    {
      kind: "choice",
      q: "¿Qué hace print()?",
      options: ["Muestra texto en pantalla", "Borra la memoria", "Apaga el programa", "Crea un archivo"],
      answer: 0,
      why: "print() muestra valores en pantalla. Es tu ventana al programa.",
    },
    {
      kind: "listen",
      q: "¿Qué palabra escuchas?",
      audio: "/audio/es/variable.wav",
      transcript: "variable",
      options: ["variable", "función", "bucle", "texto"],
      answer: 0,
      why: "Variable: caja con nombre para tus datos. Audio generado con Piper TTS local.",
    },
    {
      kind: "complete",
      q: "Completa para guardar el número 7 en edad:",
      pre: "edad",
      post: "7",
      options: ["==", "=", "->", ":"],
      answer: "=",
      why: "Un solo = asigna. El doble == compara.",
    },
    {
      kind: "order",
      q: "Ordena para saludar con una variable:",
      tokens: ["nombre", "=", '"Ada"', "print", "(", "nombre", ")"],
      answer: ["nombre", "=", '"Ada"', "print", "(", "nombre", ")"],
      why: "Primero guardas, después muestras.",
    },
    {
      kind: "dictate",
      q: "Escribe lo que escuchas:",
      audio: "/audio/es/print.wav",
      answer: "print",
      acceptable: ["Print", "PRINT"],
      why: "print() es la función más usada de Python.",
    },
  ],
};

const PYTHON_HOLA: Lesson = {
  id: "u1n1",
  course: "python",
  title: "Hola, Python",
  intro: {
    heading: "La idea en 30 segundos",
    body: "Tu primer programa en 5 minutos. Empieza pequeño, prueba cada línea y fíjate en los mensajes: Python siempre te dice qué pasó.",
    example: ['print("Hola, artop")', "# → Hola, artop"],
    mono: true,
  },
  steps: [
    {
      kind: "choice",
      q: '¿Qué hace print("Hola")?',
      options: ["Muestra Hola en pantalla", "Borra la memoria", "Apaga el programa", "Crea un archivo"],
      answer: 0,
      why: "print() muestra valores en pantalla.",
    },
    {
      kind: "complete",
      q: "Completa para mostrar tu nombre:",
      pre: "print(",
      post: ")",
      options: ['"Ada"', "Ada", "(Ada)", "'"],
      answer: '"Ada"',
      why: "El texto siempre va entre comillas.",
    },
    {
      kind: "tf",
      q: "En Python, el texto siempre va entre comillas.",
      answer: true,
      why: 'Correcto: "hola" es texto; hola sin comillas sería una variable.',
    },
    {
      kind: "order",
      q: "Ordena para saludar al mundo:",
      tokens: ["print", "(", '"mundo"', ")"],
      answer: ["print", "(", '"mundo"', ")"],
      why: "Función, paréntesis, texto, cerrar.",
    },
    {
      kind: "choice",
      q: "¿Qué tipo es 3.14?",
      options: ["int (entero)", "float (decimal)", "str (texto)", "bool (lógico)"],
      answer: 1,
      why: "Los decimales son float. Los enteros son int.",
    },
  ],
};

const DEMO_JA: Lesson = {
  id: "demo-ja",
  course: "japones",
  title: "Hiragana: a i u",
  intro: {
    heading: "La idea en 30 segundos",
    body: "El hiragana representa sonidos, no ideas. Tres sílabas de hoy: あ es a, い es i, う es u. Sin audio en esta demo: el japonés aún no tiene voz Piper y el schema lo degrada solo.",
    example: ["あ = a", "い = i", "う = u"],
  },
  steps: [
    {
      kind: "choice",
      q: "¿Cómo se lee あ?",
      options: ["a", "i", "u", "e"],
      answer: 0,
      why: "あ siempre suena a.",
    },
    {
      kind: "match",
      q: "Empareja cada kana con su sonido:",
      pairs: [["あ", "a"], ["い", "i"], ["う", "u"]],
      why: "Repite en voz alta mientras emparejas: el músculo también memoriza.",
    },
    {
      kind: "write",
      q: "Escribe en romaji: う",
      answer: "u",
      acceptable: ["U"],
      hint: "Suena como la u de luna.",
      why: "う = u.",
    },
    {
      kind: "recall",
      q: "Sin mirar: ¿qué era い?",
      front: "い",
      back: "i — como la i de isla",
      why: "Si lo sabías, tu memoria a largo plazo ya trabaja.",
    },
    {
      kind: "order",
      q: "Ordena el saludo: watashi wa gakusei desu (soy estudiante):",
      tokens: ["がくせい", "わたし", "です", "は"],
      answer: ["わたし", "は", "がくせい", "です"],
      why: "Yo - tema - estudiante - soy. El orden japonés es sujeto al final el verbo.",
    },
  ],
};

const DEMO_MUSICA: Lesson = {
  id: "demo-musica",
  course: "musica",
  title: "Intervalos: do a sol",
  intro: {
    heading: "La idea en 30 segundos",
    body: "Un intervalo es la distancia entre dos notas. De do a sol hay 5 notas: es una quinta justa, el salto más heroico de la música.",
    example: ["do - re - mi - fa - SOL", "1    2    3    4    5"],
  },
  steps: [
    {
      kind: "choice",
      q: "¿Qué intervalo hay de do a sol?",
      options: ["Tercera mayor", "Quinta justa", "Octava", "Segunda menor"],
      answer: 1,
      why: "do(1) re(2) mi(3) fa(4) sol(5): cinco grados = quinta.",
    },
    {
      kind: "tf",
      q: "La escala mayor tiene 7 notas distintas antes de repetirse.",
      answer: true,
      why: "do re mi fa sol la si… y vuelve do. Siete grados.",
    },
    {
      kind: "match",
      q: "Empareja cada nota con su cifrado:",
      pairs: [["do", "C"], ["re", "D"], ["mi", "E"]],
      why: "El cifrado americano ahorra tinta en los ensayos.",
    },
    {
      kind: "spot",
      q: "¿Qué tríada está mal construida?",
      lines: ["do + mi + sol", "re + fa + la", "mi + fa + sol"],
      answer: 2,
      why: "mi-fa-sol apila segunda + tercera: no es una tríada. Las tríadas se apilan por terceras.",
    },
    {
      kind: "speak",
      q: "Canta en voz alta: do - mi - sol",
      text: "do mi sol",
      hint: "Arpegio mayor: alegre y estable.",
      why: "Cantar los intervalos los graba en el oído, no solo en la vista.",
    },
  ],
};

const LESSONS: Record<string, Lesson> = {
  u1n1: PYTHON_HOLA,
  u2n1: PYTHON_VARIABLES,
  "demo-ja": DEMO_JA,
  "demo-musica": DEMO_MUSICA,
};

/** Lección demo visible desde la galería del sistema (Perfil → Sistema). */
export const DEMO_LESSONS: { id: string; course: string; title: string; detail: string }[] = [
  { id: "demo-ja", course: "Japonés", title: "Hiragana: a i u", detail: "Mismo player, otro curso. Sin audio: degradado automático." },
  { id: "demo-musica", course: "Música", title: "Intervalos: do a sol", detail: "Teoría con match, spot y speak." },
  { id: "u2n1", course: "Python", title: "Variables", detail: "Con audio Piper: listen + dictate." },
];

/** Fallback neutro para nodos sin lección escrita: nunca inventa hechos. */
export function fallbackLesson(nodeId: string, nodeTitle: string, unitTitle: string, siblings: string[]): Lesson {
  const others = siblings.filter((t) => t !== nodeTitle).slice(0, 3);
  while (others.length < 3) others.push("Otra lección");
  return {
    id: nodeId,
    course: "general",
    title: nodeTitle,
    intro: {
      heading: "La idea en 30 segundos",
      body: `Esta lección trabaja «${nodeTitle}» dentro de «${unitTitle}». La versión generada por IA traerá explicación y ejemplos a medida.`,
    },
    steps: [
      {
        kind: "choice",
        q: "¿Qué vas a practicar ahora?",
        options: [nodeTitle, ...others],
        answer: 0,
        why: "Saber qué aprendes ya es medio aprendizaje.",
      },
      { kind: "tf", q: `«${nodeTitle}» es parte de «${unitTitle}».`, answer: true, why: "El camino no miente: cada nodo tiene su etapa." },
      { kind: "recall", q: `Sin mirar: ¿de qué trata «${nodeTitle}»?`, front: nodeTitle, back: unitTitle, why: "Recuperar de memoria fija más que releer." },
      {
        kind: "write",
        q: `Escribe el nombre de esta lección:`,
        answer: nodeTitle,
        hint: "Está en el título de arriba.",
        why: "Escribirlo una vez vale por leerlo tres.",
      },
      { kind: "tf", q: "Completar esta lección suma XP, energía y PR.", answer: true, why: "Todo en artop suma. Nada se pierde." },
    ],
  };
}

export function getLessonDefinition(nodeId: string): Lesson | null {
  return LESSONS[nodeId] ?? null;
}
