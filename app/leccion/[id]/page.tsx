"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { X, Check, CheckCircle, Lightning, Trophy, ArrowClockwise } from "@phosphor-icons/react";
import { Badge, Button, Card, CardSub, CardTitle, ProgressBar } from "@/components/ui";
import { StepView, canCheck } from "@/components/leccion/renderers";
import { useStore } from "@/lib/store";
import { caminoUnits } from "@/lib/camino";
import {
  adaptSteps, fallbackLesson, getLessonDefinition, DEMO_LESSONS, isCorrect,
  COURSE_CAPS, type Lesson,
} from "@/lib/lessons";
import { cn } from "@/lib/utils";

export default function LeccionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { completeLesson, earnGems } = useStore();

  const found = useMemo(() => {
    for (const u of caminoUnits) {
      const n = u.nodes.find((x) => x.id === params.id);
      if (n) return { node: n, unit: u, siblings: u.nodes.map((x) => x.title) };
    }
    const demo = DEMO_LESSONS.find((d) => d.id === params.id);
    if (demo) {
      return {
        node: { id: demo.id, title: demo.title, detail: demo.detail, xp: 10 },
        unit: { number: 0, title: demo.course },
        siblings: [] as string[],
      };
    }
    return null;
  }, [params.id]);

  const lesson: Lesson | null = useMemo(() => {
    if (!found) return null;
    const def = getLessonDefinition(found.node.id);
    if (def) {
      const caps = COURSE_CAPS[def.course] ?? { audio: "none" as const, code: false };
      return { ...def, steps: adaptSteps(def.steps, caps) };
    }
    return fallbackLesson(found.node.id, found.node.title, found.unit.title, found.siblings);
  }, [found]);

  const exercises = lesson?.steps ?? [];
  const total = exercises.length;

  const [step, setStep] = useState(0); // 0 = intro, 1..5 ejercicios, 6 = resultado
  const [sel, setSel] = useState<unknown>(null);
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [hits, setHits] = useState(0);
  const saved = useRef(false);

  if (!found || !lesson) notFound();
  const { node, unit } = found;
  const ex = step >= 1 && step <= total ? exercises[step - 1] : null;
  const xpTotal = node.xp;

  useEffect(() => {
    if (step === total + 1 && !saved.current) {
      saved.current = true;
      const earned = Math.max(2, Math.round((xpTotal * hits) / total));
      completeLesson(node.id, earned);
      if (hits === total) earnGems(2);
    }
  }, [step, total, hits, xpTotal, node.id, completeLesson, earnGems]);

  function check() {
    if (!ex || !canCheck(ex, sel)) return;
    const good = isCorrect(ex, sel);
    setOk(good);
    setChecked(true);
    if (good) setHits((h) => h + 1);
  }

  function skip() {
    // Saltar sin puntos (speak sin micrófono): avanza sin contar acierto ni fallo.
    setSel(null);
    setChecked(false);
    setOk(false);
    setStep((s) => s + 1);
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
            <Badge tone="brand">Unidad {unit.number > 0 ? unit.number : "demo"} · {unit.title}</Badge>
            <h1 className="font-display text-[26px] font-extrabold tracking-tight">{node.title}</h1>
            <Card>
              <CardTitle className="text-[17px]!">{lesson.intro.heading}</CardTitle>
              <CardSub className="mt-1.5">{lesson.intro.body}</CardSub>
              {lesson.intro.example && (
                <div
                  className={cn(
                    "mt-3 rounded-[12px] p-4 text-[14px] leading-relaxed",
                    lesson.intro.mono
                      ? "bg-[#111116] font-mono text-[#7DD3FC] dark:bg-black"
                      : "bg-[var(--color-surface-3)] font-bold"
                  )}
                  dir="ltr"
                >
                  {lesson.intro.example.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              )}
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

            <StepView ex={ex} sel={sel} setSel={setSel} checked={checked} onCheck={check} onSkip={skip} />

            {!checked && (
              <div className="mt-2">
                <Button
                  size="lg"
                  fullWidth
                  disabled={!canCheck(ex, sel)}
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
