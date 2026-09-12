"use client";

import { useState } from "react";
import { Package, Trophy, WarningCircle, CheckCircle, Pause, Play, ArrowClockwise } from "@phosphor-icons/react";
import { Badge, Button, Card, CardSub, CardTitle, ProgressBar, SkeletonCard, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

export type CoursePhase = "active" | "empty" | "loading" | "completed" | "generating" | "paused" | "error";

export function CourseEmpty({ onPreview }: { onPreview: () => void }) {
  return (
    <Card className="artop-rise flex flex-col items-center px-6 py-8 text-center">
      <span className="flex size-[64px] items-center justify-center rounded-[22px] bg-[var(--color-surface-3)]">
        <Package size={36} weight="duotone" className="text-[var(--color-text-2)]" aria-hidden />
      </span>
      <CardTitle className="mt-4 text-[20px]!">Aún no tienes cursos</CardTitle>
      <CardSub className="mt-1 max-w-[38ch]">Dime qué quieres aprender y la IA construye tu camino: etapas, lecciones y repasos.</CardSub>
      <div className="mt-6 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onPreview}>
          Crear mi primer curso
        </Button>
        <Button variant="secondary" size="md" fullWidth onClick={onPreview}>
          Ver cómo se genera
        </Button>
      </div>
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
    <Card accentBorder className="artop-rise flex flex-col items-center px-6 py-8 text-center">
      <span className="artop-complete-pop flex size-[76px] items-center justify-center rounded-full bg-[#FEF3C7] dark:bg-[#451A03]">
        <Trophy size={46} weight="fill" className="text-[#EAB308]" aria-hidden />
      </span>
      <CardTitle className="mt-4 text-[24px]!">¡Curso completado!</CardTitle>
      <CardSub>Python desde cero · 6 de 6 unidades · 1.240 XP</CardSub>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Badge tone="success"><CheckCircle size={14} weight="fill" /> 28 lecciones</Badge>
        <Badge tone="success"><CheckCircle size={14} weight="fill" /> 12 conceptos</Badge>
        <Badge tone="brand">Nivel 8</Badge>
      </div>
      <div className="mt-6 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onReview}>Repasar puntos débiles</Button>
        <Button variant="secondary" size="md" fullWidth onClick={() => push({ title: "Certificado en camino", body: "Podrás compartirlo pronto.", tone: "info" })}>
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

/** Tarjeta "Generando tu curso": progreso por batches, sin inventar tiempos. */
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
    <Card accentBorder className="artop-rise">
      <div className="flex items-center justify-between gap-3">
        <Badge tone={paused ? "warning" : "info"}>
          <span aria-hidden className={cn("size-2 rounded-full", paused ? "bg-[#B45309]" : "bg-[#0284C7] artop-pulse")} />
          {paused ? "Pausado" : "Generando"}
        </Badge>
        <span className="text-[13px] font-extrabold text-[var(--color-text-3)]">{gen.done} / {gen.total} lecciones</span>
      </div>
      <CardTitle className="mt-3 text-[20px]!">Generando tu curso</CardTitle>
      <CardSub>{gen.course} · {paused ? "En pausa" : gen.stage}</CardSub>
      <div className="mt-4">
        <ProgressBar value={gen.done} max={gen.total} size="md" />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {gen.batches.map((b) => (
          <li
            key={b.name}
            className="flex min-h-[48px] items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[14px] font-bold"
          >
            {b.state === "done" ? (
              <CheckCircle size={20} weight="fill" className="text-[#16A34A]" aria-hidden />
            ) : b.state === "doing" && !paused ? (
              <span aria-hidden className="artop-breathe flex size-[20px] items-center justify-center rounded-full bg-[var(--color-brand)]" />
            ) : (
              <span aria-hidden className="size-[20px] rounded-full border-2 border-[var(--color-border)]" />
            )}
            <span className={b.state === "queued" || paused && b.state === "doing" ? "text-[var(--color-text-3)]" : ""}>{b.name}</span>
            <span className="ml-auto text-[12px] font-extrabold uppercase tracking-wide text-[var(--color-text-3)]">
              {b.state === "done" ? "Lista" : b.state === "doing" ? (paused ? "En pausa" : "En curso") : "En cola"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] font-bold text-[var(--color-text-2)]">
        {remaining === 0 ? "Terminando los últimos detalles." : `Faltan ${remaining} lecciones. Puedes seguir explorando mientras tanto.`}
      </p>
      <div className="mt-4 grid gap-2.5">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => {
            setPaused((p) => !p);
            push(paused ? { title: "Generación reanudada", body: gen.stage, tone: "info" } : { title: "Generación pausada", body: "Retomamos cuando quieras.", tone: "info" });
          }}
        >
          {paused ? <><Play size={18} weight="fill" /> Reanudar</> : <><Pause size={18} weight="fill" /> Pausar</>}
        </Button>
      </div>
    </Card>
  );
}

export function CourseError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="artop-rise flex flex-col items-center px-6 py-8 text-center">
      <span className="flex size-[64px] items-center justify-center rounded-[22px] bg-[#FEE2E2] dark:bg-[#450A0A]">
        <WarningCircle size={38} weight="fill" className="text-[#DC2626]" aria-hidden />
      </span>
      <CardTitle className="mt-4 text-[20px]!">Algo se atascó</CardTitle>
      <CardSub className="mt-1 max-w-[38ch]">No pudimos cargar tu camino. Revisa tu conexión e inténtalo de nuevo. Tu progreso está a salvo.</CardSub>
      <div className="mt-6 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onRetry}>
          <ArrowClockwise size={20} weight="bold" /> Reintentar
        </Button>
      </div>
    </Card>
  );
}
