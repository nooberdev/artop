"use client";

import { useState } from "react";
import { Trophy, WarningCircle, CheckCircle, Pause, Play, ArrowClockwise, Sparkle } from "@phosphor-icons/react";
import { Badge, Button, Card, CardSub, CardTitle, ProgressBar, SkeletonCard, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

export type CoursePhase = "active" | "empty" | "loading" | "completed" | "generating" | "paused" | "error";

export function CourseEmpty({ onPreview }: { onPreview: () => void }) {
  return (
    <Card className="artop-rise relative flex flex-col items-center overflow-hidden px-6 py-10 text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 size-[220px] -translate-x-1/2 rounded-full bg-[var(--color-brand-tint)] opacity-70"
      />
      <span className="relative flex size-[72px] items-center justify-center rounded-[24px] bg-[var(--color-brand)] shadow-[var(--shadow-card)]">
        <Sparkle size={36} weight="fill" className="text-white" aria-hidden />
      </span>
      <CardTitle className="relative mt-5 text-[22px]!">Aún no tienes cursos</CardTitle>
      <CardSub className="relative mt-1.5 max-w-[40ch]">
        Todavía no hay generador de IA real. Podés ver la demo de cómo se verá el progreso al crear un curso.
      </CardSub>
      <div className="relative mt-6 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onPreview}>
          Probar generación demo
        </Button>
        <Button variant="outline" size="md" fullWidth onClick={onPreview} className="border-[var(--color-brand)]! text-[var(--color-brand-ink)]! hover:bg-[var(--color-brand-tint)]!">
          Ver cómo se genera
        </Button>
      </div>
      <p className="relative mt-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-text-3)]">
        Demo · sin IA real
      </p>
    </Card>
  );
}

export function CourseLoading() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Cargando tu camino">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function CourseCompleted({ onReview }: { onReview: () => void }) {
  const { push } = useToast();
  return (
    <Card className="artop-rise flex flex-col items-center px-6 py-10 text-center">
      <span className="artop-complete-pop flex size-[80px] items-center justify-center rounded-full bg-[#FEF3C7] shadow-[var(--shadow-card)]">
        <Trophy size={46} weight="fill" className="text-[#EAB308]" aria-hidden />
      </span>
      <CardTitle className="mt-5 text-[24px]!">¡Curso completado!</CardTitle>
      <CardSub>Python desde cero · 6 de 6 unidades · 1.240 XP</CardSub>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Badge tone="success">
          <CheckCircle size={14} weight="fill" /> 28 lecciones
        </Badge>
        <Badge tone="success">
          <CheckCircle size={14} weight="fill" /> 12 conceptos
        </Badge>
        <Badge tone="brand">Nivel 8</Badge>
      </div>
      <div className="mt-6 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onReview}>
          Repasar puntos débiles
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() =>
            push({ title: "Certificado en camino", body: "Podrás compartirlo pronto.", tone: "info" })
          }
        >
          Ver certificado
        </Button>
      </div>
    </Card>
  );
}

interface Generation {
  course: string;
  stage: string;
  done: number;
  total: number;
  batches: { name: string; state: "done" | "doing" | "queued" }[];
}

/** Tarjeta amigable de generación demo — sin pipeline HUD ni neon. */
export function GenerationCard({ initialPaused = false }: { initialPaused?: boolean }) {
  const { push } = useToast();
  const [paused, setPaused] = useState(initialPaused);
  const gen: Generation = {
    course: "Python desde cero",
    stage: "Generando Etapa 2",
    done: 14,
    total: 25,
    batches: [
      { name: "Etapa 1", state: "done" },
      { name: "Etapa 2", state: "doing" },
      { name: "Etapa 3", state: "queued" },
      { name: "Etapa 4", state: "queued" },
    ],
  };
  const remaining = gen.total - gen.done;
  return (
    <Card className="artop-rise">
      <div className="flex items-center justify-between gap-3">
        <Badge tone={paused ? "warning" : "success"}>
          <span
            aria-hidden
            className={cn(
              "size-2 rounded-full",
              paused ? "bg-[#B45309]" : "bg-[#58CC02] artop-pulse"
            )}
          />
          {paused ? "Pausado" : "Generando"}
        </Badge>
        <span className="text-[13px] font-extrabold text-[var(--color-text-3)]">
          {gen.done} / {gen.total} lecciones
        </span>
      </div>
      <CardTitle className="mt-3 text-[20px]!">Generando tu curso</CardTitle>
      <CardSub>
        {gen.course} · {paused ? "En pausa" : gen.stage}
      </CardSub>
      <div className="mt-4">
        <ProgressBar value={gen.done} max={gen.total} size="md" tone="success" />
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {gen.batches.map((b) => {
          const muted = b.state === "queued" || (paused && b.state === "doing");
          return (
            <li
              key={b.name}
              className={cn(
                "flex min-h-[52px] items-center gap-3 rounded-[16px] border px-4 text-[14px] font-bold",
                b.state === "done" && "border-[#BBF7D0] bg-[#F0FDF4]",
                b.state === "doing" && !paused && "border-[var(--color-brand-tint)] bg-[var(--color-brand-tint)]",
                muted && "border-[var(--color-border)] bg-[var(--color-surface)]"
              )}
            >
              {b.state === "done" ? (
                <CheckCircle size={22} weight="fill" className="text-[#58CC02]" aria-hidden />
              ) : b.state === "doing" && !paused ? (
                <span
                  aria-hidden
                  className="artop-breathe flex size-[22px] items-center justify-center rounded-full bg-[var(--color-brand)]"
                />
              ) : (
                <span aria-hidden className="size-[22px] rounded-full border-2 border-[var(--color-border)]" />
              )}
              <span className={muted ? "text-[var(--color-text-3)]" : "text-[var(--color-text)]"}>
                {b.name}
              </span>
              <span
                className={cn(
                  "ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide",
                  b.state === "done" && "bg-[#DCFCE7] text-[#15803D]",
                  b.state === "doing" && !paused && "bg-white/70 text-[var(--color-brand-ink)]",
                  muted && "bg-[var(--color-surface-3)] text-[var(--color-text-3)]"
                )}
              >
                {b.state === "done" ? "Lista" : b.state === "doing" ? (paused ? "En pausa" : "En curso") : "En cola"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[13px] font-bold text-[var(--color-text-2)]">
        {remaining === 0
          ? "Terminando los últimos detalles."
          : `Faltan ${remaining} lecciones. Puedes seguir explorando mientras tanto.`}
      </p>
      <div className="mt-4 grid gap-2.5">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => {
            setPaused((p) => !p);
            push(
              paused
                ? { title: "Generación reanudada", body: gen.stage, tone: "info" }
                : { title: "Generación pausada", body: "Retomamos cuando quieras.", tone: "info" }
            );
          }}
        >
          {paused ? (
            <>
              <Play size={18} weight="fill" /> Reanudar
            </>
          ) : (
            <>
              <Pause size={18} weight="fill" /> Pausar
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

export function CourseError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="artop-rise flex flex-col items-center px-6 py-10 text-center">
      <span className="flex size-[72px] items-center justify-center rounded-[24px] bg-[#FEE2E2]">
        <WarningCircle size={38} weight="fill" className="text-[#DC2626]" aria-hidden />
      </span>
      <CardTitle className="mt-5 text-[20px]!">Algo se atascó</CardTitle>
      <CardSub className="mt-1 max-w-[38ch]">
        No pudimos cargar tu camino. Revisa tu conexión e inténtalo de nuevo. Tu progreso está a salvo.
      </CardSub>
      <div className="mt-6 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onRetry}>
          <ArrowClockwise size={20} weight="bold" /> Reintentar
        </Button>
      </div>
    </Card>
  );
}
