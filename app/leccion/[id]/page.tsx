"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { X, Check, CheckCircle, Lightning, Trophy, ArrowClockwise } from "@phosphor-icons/react";
import { Badge, Button, Card, CardSub, CardTitle, ProgressBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { caminoUnits } from "@/lib/camino";
import { cn } from "@/lib/utils";

type Ex =
  | { kind: "choice"; q: string; options: string[]; answer: number; why: string }
  | { kind: "complete"; q: string; pre: string; post: string; options: string[]; answer: string; why: string }
  | { kind: "tf"; q: string; answer: boolean; why: string }
  | { kind: "order"; q: string; tokens: string[]; answer: string[]; why: string };

function bank(topic: string): Ex[] {
  return [
    {
      kind: "choice",
      q: `¿Qué hace print() en "${topic}"?`,
      options: ["Muestra texto en pantalla", "Borra la memoria", "Apaga el programa", "Crea un archivo"],
      answer: 0,
      why: "print() muestra valores en pantalla. Es tu ventana al programa.",
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
      kind: "tf",
      q: "En Python, el texto siempre va entre comillas.",
      answer: true,
      why: "Correcto: \"hola\" es texto; hola sin comillas sería una variable.",
    },
    {
      kind: "order",
      q: "Ordena para saludar con una variable:",
      tokens: ["nombre", "=", "\"Ada\"", "print", "(", "nombre", ")"],
      answer: ["nombre", "=", "\"Ada\"", "print", "(", "nombre", ")"],
      why: "Primero guardas, después muestras.",
    },
    {
      kind: "choice",
      q: "¿Qué tipo es 3.14?",
      options: ["int (entero)", "float (decimal)", "str (texto)", "bool (lógico)"],
      answer: 1,
      why: "Los decimales son float. Los enteros son int.",
    },
  ];
}

function isCorrect(ex: Ex, sel: unknown): boolean {
  if (sel === null || sel === undefined) return false;
  if (ex.kind === "choice") return sel === ex.answer;
  if (ex.kind === "tf") return sel === ex.answer;
  if (ex.kind === "complete") return sel === ex.answer;
  if (ex.kind === "order") return Array.isArray(sel) && sel.join("|") === ex.answer.join("|");
  return false;
}

function OptionButton({ selected, onClick, children, disabled }: { selected: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "artop-press min-h-[56px] w-full rounded-[14px] border-2 border-b-4 px-4 text-left text-[16px] font-bold",
        selected
          ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)] text-[var(--color-text)]"
          : "bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-3)]",
        disabled && !selected && "opacity-70"
      )}
    >
      {children}
    </button>
  );
}

export default function LeccionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { completeLesson, earnGems } = useStore();

  const found = useMemo(() => {
    for (const u of caminoUnits) {
      const n = u.nodes.find((x) => x.id === params.id);
      if (n) return { node: n, unit: u };
    }
    return null;
  }, [params.id]);

  const exercises = useMemo(() => (found ? bank(found.node.title) : []), [found]);
  const total = exercises.length;
  const lessonKey = found ? `artop-lesson-progress:${found.node.id}` : null;

  const [step, setStep] = useState(() => {
    if (typeof window === "undefined" || !found) return 0;
    try {
      const raw = sessionStorage.getItem(`artop-lesson-progress:${found.node.id}`);
      if (!raw) return 0;
      const data = JSON.parse(raw) as { step?: number };
      const n = typeof data.step === "number" ? data.step : 0;
      return n > 0 ? n : 0;
    } catch {
      return 0;
    }
  }); // 0 = intro, 1..N ejercicios, N+1 = resultado
  const [sel, setSel] = useState<unknown>(null);
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [hits, setHits] = useState(() => {
    if (typeof window === "undefined" || !found) return 0;
    try {
      const raw = sessionStorage.getItem(`artop-lesson-progress:${found.node.id}`);
      if (!raw) return 0;
      const data = JSON.parse(raw) as { hits?: number };
      return typeof data.hits === "number" ? data.hits : 0;
    } catch {
      return 0;
    }
  });
  const saved = useRef(false);
  const [ready, setReady] = useState(false);

  if (!found) notFound();
  const { node, unit } = found;
  const ex = step >= 1 && step <= total ? exercises[step - 1] : null;
  const xpTotal = node.xp;

  // Marca restored + clamp si el banco cambió; no pisa progreso válido.
  useEffect(() => {
    if (!lessonKey) return;
    try {
      const raw = sessionStorage.getItem(lessonKey);
      if (raw) {
        const data = JSON.parse(raw) as { step?: number; hits?: number; saved?: boolean };
        if (typeof data.step === "number" && data.step > total + 1) {
          setStep(0);
          setHits(0);
          sessionStorage.removeItem(lessonKey);
        } else {
          saved.current = Boolean(data.saved) || data.step === total + 1;
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [lessonKey, total]);

  useEffect(() => {
    if (!ready || !lessonKey) return;
    try {
      if (step === 0) {
        sessionStorage.removeItem(lessonKey);
      } else {
        sessionStorage.setItem(lessonKey, JSON.stringify({ step, hits, saved: saved.current }));
      }
    } catch {
      /* ignore */
    }
  }, [ready, lessonKey, step, hits]);

  useEffect(() => {
    if (step === total + 1 && !saved.current) {
      saved.current = true;
      const earned = Math.max(2, Math.round((xpTotal * hits) / total));
      completeLesson(node.id, earned);
      if (hits === total) earnGems(2);
      if (lessonKey) {
        try {
          sessionStorage.setItem(lessonKey, JSON.stringify({ step, hits, saved: true }));
        } catch {
          /* ignore */
        }
      }
    }
  }, [step, total, hits, xpTotal, node.id, completeLesson, earnGems, lessonKey]);

  function check() {
    if (!ex || sel === null) return;
    const good = isCorrect(ex, sel);
    setOk(good);
    setChecked(true);
    if (good) setHits((h) => h + 1);
  }

  function next() {
    setSel(null);
    setChecked(false);
    setOk(false);
    setStep((s) => s + 1);
  }

  const earned = Math.max(2, Math.round((xpTotal * hits) / total));
  const perfect = hits === total;

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface-2)] text-[var(--color-text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/90 backdrop-blur">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[680px] items-center gap-3 px-4">
          <button onClick={() => router.push("/camino")} aria-label="Salir de la lección" className="artop-press text-[var(--color-text-3)] hover:text-[var(--color-text)]">
            <X size={24} weight="bold" />
          </button>
          <div className="flex-1">
            <ProgressBar value={Math.min(100, (Math.max(0, step - 0) / (total + 0)) * 100)} size="sm" />
          </div>
          <span className="inline-flex items-center gap-1 font-display text-[15px] font-extrabold text-[#EAB308]">
            <Lightning size={20} weight="fill" aria-hidden /> {earned}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[680px] px-4 pb-48 pt-6">
        {step === 0 && (
          <div className="artop-rise flex flex-col gap-4">
            <Badge tone="brand">Unidad {unit.number} · {unit.title}</Badge>
            <h1 className="font-display text-[26px] font-extrabold tracking-tight">{node.title}</h1>
            <Card>
              <CardTitle className="text-[17px]!">La idea en 30 segundos</CardTitle>
              <CardSub className="mt-1.5">{node.detail} Empieza pequeño, prueba cada línea y fíjate en los mensajes: Python siempre te dice qué pasó.</CardSub>
              <div className="mt-3 rounded-[12px] bg-[#111116] p-4 font-mono text-[14px] leading-relaxed text-[#7DD3FC] dark:bg-black" dir="ltr">
                print("Hola, artop")
                <br />
                <span className="text-[#86EFAC]"># → Hola, artop</span>
              </div>
            </Card>
            <Button size="xl" fullWidth onClick={() => setStep(1)}>Empezar ejercicios</Button>
            <p className="text-center text-[13px] font-bold text-[var(--color-text-3)]">{total} ejercicios · +{xpTotal} XP en juego</p>
          </div>
        )}

        {ex && step <= total && (
          <div key={step} className="artop-rise flex flex-col gap-4">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-text-3)]">
              Ejercicio {step} de {total}
            </p>
            <h1 className="font-display text-[22px] font-extrabold tracking-tight">{ex.q}</h1>

            {ex.kind === "choice" && (
              <div className="grid gap-2.5">
                {ex.options.map((o, i) => (
                  <OptionButton key={o} selected={sel === i} disabled={checked} onClick={() => setSel(i)}>{o}</OptionButton>
                ))}
              </div>
            )}

            {ex.kind === "tf" && (
              <div className="grid grid-cols-2 gap-2.5">
                {([true, false] as const).map((v) => (
                  <OptionButton key={String(v)} selected={sel === v} disabled={checked} onClick={() => setSel(v)}>
                    <span className="block text-center text-[18px] font-display font-extrabold">{v ? "Verdadero" : "Falso"}</span>
                  </OptionButton>
                ))}
              </div>
            )}

            {ex.kind === "complete" && (
              <div>
                <p className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-[17px]" dir="ltr">
                  {ex.pre} <span className="rounded-[8px] bg-[var(--color-brand-tint)] px-3 py-1 text-[var(--color-brand-ink)]">{(sel as string) ?? "···"}</span> {ex.post}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ex.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => setSel(o)}
                      disabled={checked}
                      aria-pressed={sel === o}
                      className={cn(
                        "artop-press min-h-[48px] rounded-[12px] border-2 border-b-4 px-5 font-mono text-[16px] font-bold",
                        sel === o ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)]" : "bg-[var(--color-surface)] border-[var(--color-border)]"
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ex.kind === "order" && (
              <div>
                <p className="min-h-[56px] rounded-[14px] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-[15px]" dir="ltr">
                  {Array.isArray(sel) && sel.length > 0 ? (sel as string[]).join(" ") : <span className="text-[var(--color-text-3)]">Toca las piezas en orden…</span>}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ex.tokens.map((t, i) => {
                    const used = Array.isArray(sel) && (sel as string[]).filter((x) => x === t).length > ex.tokens.slice(0, i + 1).filter((x) => x === t).length;
                    return (
                      <button
                        key={`${t}-${i}`}
                        disabled={checked || used}
                        onClick={() => setSel([...((sel as string[]) ?? []), t])}
                        className={cn(
                          "artop-press min-h-[48px] rounded-[12px] border-2 border-b-4 px-4 font-mono text-[15px] font-bold",
                          used ? "opacity-30 bg-[var(--color-surface-3)] border-[var(--color-border)]" : "bg-[var(--color-surface)] border-[var(--color-border)]"
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                {!checked && Array.isArray(sel) && (sel as string[]).length > 0 && (
                  <button onClick={() => setSel([])} className="mt-2 text-[14px] font-bold text-[var(--color-text-3)] underline">Borrar</button>
                )}
              </div>
            )}

            {!checked && (
              <div className="mt-2">
                <Button
                  size="lg"
                  fullWidth
                  disabled={sel === null || (Array.isArray(sel) && sel.length === 0)}
                  onClick={check}
                >
                  Comprobar
                </Button>
              </div>
            )}
          </div>
        )}

        {step === total + 1 && (
          <div className="artop-rise flex flex-col items-center py-6 text-center">
            <span className="artop-complete-pop flex size-[88px] items-center justify-center rounded-full bg-[#FEF3C7] dark:bg-[#451A03]">
              <Trophy size={46} weight="fill" className="text-[#EAB308]" aria-hidden />
            </span>
            <h1 className="mt-4 font-display text-[26px] font-extrabold tracking-tight">¡Lección completada!</h1>
            <p className="mt-1 text-[15px] font-medium text-[var(--color-text-2)]">{node.title} · {hits}/{total} bien</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge tone="brand"><Lightning size={14} weight="fill" /> +{earned} XP</Badge>
              <Badge tone="neutral">+1 energía</Badge>
              <Badge tone="neutral">+12 PR</Badge>
              {perfect && <Badge tone="success"><Check size={14} weight="bold" /> +2 rombos perfectos</Badge>}
            </div>
            <Card className="mt-4 w-full text-left">
              <CardTitle className="text-[16px]!">Dominaste</CardTitle>
              <ul className="mt-2 flex flex-wrap gap-2">
                {[node.title, unit.title].map((c) => (
                  <li key={c} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 text-[13px] font-extrabold text-[#15803d] dark:bg-[#052e16] dark:text-[#86EFAC]">
                    <CheckCircle size={16} weight="fill" aria-hidden /> {c}
                  </li>
                ))}
              </ul>
            </Card>
            <div className="mt-5 grid w-full gap-2.5">
              <Link href="/camino" className="artop-press flex min-h-[56px] items-center justify-center rounded-[18px] bg-[var(--color-brand)] font-display text-[17px] font-extrabold text-white border-b-4 border-[var(--color-brand-deep)]">
                Continuar
              </Link>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => {
                  saved.current = false;
                  if (lessonKey) {
                    try { sessionStorage.removeItem(lessonKey); } catch { /* ignore */ }
                  }
                  setStep(0);
                  setSel(null);
                  setChecked(false);
                  setOk(false);
                  setHits(0);
                }}
              >
                <ArrowClockwise size={18} weight="bold" /> Repetir lección
              </Button>
            </div>
          </div>
        )}
      </main>

      {checked && ex && (
        <div className={cn("fixed inset-x-0 bottom-0 z-40 border-t-2", ok ? "bg-[#D7FFB8] border-[#58CC02] dark:bg-[#0B2E0B] dark:border-[#22C55E]" : "bg-[#FFDCE0] border-[#FF5C5C] dark:bg-[#3A0D12] dark:border-[#EF4444]")}>
          <div className="mx-auto w-full max-w-[680px] px-4 py-4">
            <p className={cn("flex items-center gap-2 font-display text-[18px] font-extrabold", ok ? "text-[#3C8500] dark:text-[#86EFAC]" : "text-[#B91C1C] dark:text-[#FCA5A5]")}>
              {ok ? <><CheckCircle size={24} weight="fill" /> ¡Bien!</> : <><X size={24} weight="bold" /> Casi…</>}
            </p>
            {!ok && <p className="mt-1 text-[14px] font-medium text-[#7F1D1D] dark:text-[#FECACA]">{ex.why}</p>}
            {ok && <p className="mt-1 text-[14px] font-medium text-[#3C8500] dark:text-[#86EFAC]">{ex.why}</p>}
            <div className="mt-3">
              <Button size="lg" fullWidth onClick={next} variant={ok ? "dark" : "primary"}>
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
