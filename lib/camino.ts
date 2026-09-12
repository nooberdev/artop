// Mock tipado de Mi Camino. Sin backend: todo local hasta conectar Groq.
export type CaminoNodeType = "lesson" | "review" | "checkpoint" | "exam" | "challenge" | "chest" | "milestone";
export type CaminoNodeStatus = "completed" | "in-progress" | "available" | "locked" | "review";

export interface CaminoNode {
  id: string;
  type: CaminoNodeType;
  title: string;
  detail: string;
  status: CaminoNodeStatus;
  xp: number;
}

export interface CaminoUnit {
  id: string;
  number: number;
  title: string;
  goal: string;
  /** Color plano del banner. Gris = bloqueada. */
  color: string;
  deep: string;
  locked: boolean;
  nodes: CaminoNode[];
}

export interface DailyQuest {
  id: string;
  title: string;
  done: number;
  goal: number;
}

export const caminoCourse = {
  id: "python",
  title: "Python desde cero",
  level: "Principiante",
  currentUnit: 2,
  totalUnits: 6,
  nextLesson: "Tipos de datos en acción",
};

export const caminoUnits: CaminoUnit[] = [
  {
    id: "u1",
    number: 1,
    title: "Primeros pasos",
    goal: "Instala Python y escribe tus primeras líneas.",
    color: "#22C55E",
    deep: "#15803D",
    locked: false,
    nodes: [
      { id: "u1n1", type: "lesson", title: "Hola, Python", detail: "Tu primer programa en 5 minutos.", status: "completed", xp: 10 },
      { id: "u1n2", type: "lesson", title: "El intérprete", detail: "Ejecuta código línea por línea.", status: "completed", xp: 10 },
      { id: "u1n3", type: "review", title: "Repaso exprés", detail: "Refuerza lo esencial de la unidad.", status: "completed", xp: 5 },
      { id: "u1n4", type: "chest", title: "Cofre inicial", detail: "Recompensa por terminar la base.", status: "completed", xp: 20 },
      { id: "u1n5", type: "checkpoint", title: "Checkpoint 1", detail: "Demuestra que dominas lo básico.", status: "completed", xp: 15 },
    ],
  },
  {
    id: "u2",
    number: 2,
    title: "Variables y tipos",
    goal: "Guarda datos y entiende textos, números y booleanos.",
    color: "#D300D6",
    deep: "#930094",
    locked: false,
    nodes: [
      { id: "u2n1", type: "lesson", title: "Variables", detail: "Cajas con nombre para tus datos.", status: "completed", xp: 10 },
      { id: "u2n2", type: "lesson", title: "Números y texto", detail: "int, float y strings sin miedo.", status: "completed", xp: 10 },
      { id: "u2n3", type: "lesson", title: "Tipos de datos en acción", detail: "Combina tipos en mini programas.", status: "in-progress", xp: 10 },
      { id: "u2n4", type: "challenge", title: "Desafío relámpago", detail: "5 ejercicios contra el reloj.", status: "available", xp: 15 },
      { id: "u2n5", type: "review", title: "Repaso de tipos", detail: "Los errores más comunes, cazados.", status: "locked", xp: 5 },
      { id: "u2n6", type: "chest", title: "Cofre violeta", detail: "Se abre al dominar la unidad.", status: "locked", xp: 20 },
      { id: "u2n7", type: "checkpoint", title: "Checkpoint 2", detail: "Examen corto de la unidad.", status: "locked", xp: 15 },
    ],
  },
  {
    id: "u3",
    number: 3,
    title: "Condicionales",
    goal: "Toma decisiones con if, elif y else.",
    color: "#00A6FF",
    deep: "#0077B6",
    locked: true,
    nodes: [
      { id: "u3n1", type: "lesson", title: "Decide con if", detail: "Tu código elige caminos.", status: "locked", xp: 10 },
      { id: "u3n2", type: "lesson", title: "elif y else", detail: "Cubre todos los casos.", status: "locked", xp: 10 },
      { id: "u3n3", type: "exam", title: "Examen de lógica", detail: "Lee condiciones como una máquina.", status: "locked", xp: 20 },
      { id: "u3n4", type: "chest", title: "Cofre lógico", detail: "Para mentes decididas.", status: "locked", xp: 20 },
    ],
  },
  {
    id: "u4",
    number: 4,
    title: "Bucles",
    goal: "Repite sin repetirte: for y while.",
    color: "#FF007F",
    deep: "#B3005A",
    locked: true,
    nodes: [
      { id: "u4n1", type: "lesson", title: "Bucle for", detail: "Recorre listas como un pro.", status: "locked", xp: 10 },
      { id: "u4n2", type: "lesson", title: "Bucle while", detail: "Repite hasta lograrlo.", status: "locked", xp: 10 },
      { id: "u4n3", type: "challenge", title: "Reto de 10 vueltas", detail: "Bucles anidados sin enredos.", status: "locked", xp: 15 },
      { id: "u4n4", type: "milestone", title: "Medalla bucle infinito", detail: "Hito de medio curso.", status: "locked", xp: 30 },
    ],
  },
  {
    id: "u5",
    number: 5,
    title: "Funciones",
    goal: "Empaqueta ideas reutilizables con def.",
    color: "#FF9600",
    deep: "#B25E00",
    locked: true,
    nodes: [
      { id: "u5n1", type: "lesson", title: "Tu primera función", detail: "def, return y listo.", status: "locked", xp: 10 },
      { id: "u5n2", type: "lesson", title: "Parámetros", detail: "Funciones que escuchan.", status: "locked", xp: 10 },
      { id: "u5n3", type: "exam", title: "Examen final de funciones", detail: "Demuestra tu poder.", status: "locked", xp: 20 },
    ],
  },
  {
    id: "u6",
    number: 6,
    title: "Mini proyectos",
    goal: "Une todo en programas de verdad.",
    color: "#00B8A9",
    deep: "#007A70",
    locked: true,
    nodes: [
      { id: "u6n1", type: "challenge", title: "Adivina el número", detail: "Tu primer juego completo.", status: "locked", xp: 20 },
      { id: "u6n2", type: "challenge", title: "Lista de tareas", detail: "App útil de principio a fin.", status: "locked", xp: 20 },
      { id: "u6n3", type: "milestone", title: "Graduación Python", detail: "Certifica tu camino.", status: "locked", xp: 50 },
    ],
  },
];

export const caminoQuests: DailyQuest[] = [
  { id: "q1", title: "Gana 20 XP", done: 14, goal: 20 },
  { id: "q2", title: "Repasa 2 conceptos", done: 1, goal: 2 },
  { id: "q3", title: "Aprende 15 minutos", done: 3, goal: 15 },
];

export const caminoMastered = ["Variables", "print()", "El intérprete"];
