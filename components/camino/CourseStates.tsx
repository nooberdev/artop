"use client";

import { useState } from "react";
import {
  Sparkle, Trophy, WarningCircle, CheckCircle, Pause, Play, ArrowClockwise, Lightning,
} from "@phosphor-icons/react";
import { Badge, Button, Card, CardSub, CardTitle, SkeletonCard, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

export type CoursePhase = "active" | "empty" | "loading" | "completed" | "generating" | "paused" | "error";

export function CourseEmpty({ onPreview }: { onPreview: () => void }) {
  return (
    <Card
      className="artop-rise artop-card-cyber relative flex flex-col items-center overflow-hidden px-6 py-10 text-center"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-[var(--color-neon-mist)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-8 size-28 rounded-full bg-[var(--color-neon-tint)] opacity-70"
      />
      <span className="relative flex size-[72px] items-center justify-center rounded-[24px] border-2 border-[var(--color-neon)]/30 bg-[var(--color-neon-tint)] shadow-[var(--shadow-neon-soft)]">
        <Sparkle size={38} weight="fill" className="text-[var(--color-neon)]" aria-hidden />
      </span>
      <CardTitle className="relative mt-5 text-[22px]! tracking-tight">Aún no tienes cursos</CardTitle>
      <CardSub className="relative mt-2 max-w-[40ch]">
        Todavía no hay generador de IA real. Podés ver la demo de cómo se verá el progreso al crear un curso.
      </CardSub>
      <div className="relative mt-7 grid w-full gap-2.5">
        <Button size="lg" fullWidth onClick={onPreview} className="bg-[var(--color-neon)] border-[var(--color-neon-deep)] hover:bg-[#e60072]">
          Probar generación demo
        </Button>
        <Button variant="outline" size="md" fullWidth onClick={onPreview} className="border-[var(--color-neon)]/40 text-[var(--color-neon-ink)] hover:border-[var(--color-neon)]">
          Ver cómo se genera
        </Button>
      </div>
      <p className="relative mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-3)]">
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
    <Card accentBorder className="artop-rise artop-card-cyber flex flex-col items-center px-6 py-8 text-center">
      <span className="artop-complete-pop flex size-[80px] items-center justify-center rounded-full bg-[#FEF3C7] shadow-[0_8px_24px_-8px_rgb(234_179_8_/_0.55)]">
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
  const pct = Math.round((gen.done / gen.total) * 100);
  return (
    <section
      aria-label="Generando tu curso"
      className="artop-rise artop-hud-panel relative overflow-hidden p-4 sm:p-5"
    >
      <span aria-hidden className="artop-hud-corner artop-hud-corner-tl" />
      <span aria-hidden className="artop-hud-corner artop-hud-corner-tr" />
      <span aria-hidden className="artop-hud-corner artop-hud-corner-bl" />
      <span aria-hidden className="artop-hud-corner artop-hud-corner-br" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-0 size-44 rounded-full bg-[var(--color-neon)]/10 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-8 bottom-4 size-32 rounded-full bg-[var(--color-neon)]/8 blur-xl"
      />

      <div className="relative z-[1]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_rgb(255_0_127_/_0.8)]" />
            <p className="artop-hud-label">Build // pipeline</p>
          </div>
          <Badge
            tone={paused ? "warning" : "brand"}
            className={paused ? undefined : "bg-[var(--color-neon)] border-transparent shadow-[0_0_14px_rgb(255_0_127_/_0.4)]"}
          >
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full",
                paused ? "bg-[#B45309]" : "bg-white artop-pulse"
              )}
            />
            {paused ? "Pausado" : "Generando"}
          </Badge>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-[22px]! tracking-tight">Generando tu curso</CardTitle>
            <CardSub className="mt-1">{gen.course} · {paused ? "En pausa" : gen.stage}</CardSub>
          </div>
          <div className="shrink-0 rounded-[12px] border border-[var(--color-neon)]/30 bg-white/70 px-3 py-2 text-right shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.7)]">
            <p className="font-display text-[22px] font-extrabold leading-none tabular-nums text-[var(--color-neon-ink)]">
              {pct}%
            </p>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-text-3)]">
              throughput
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[12px] font-extrabold tracking-wide text-[var(--color-neon-ink)]">
            <span className="inline-flex items-center gap-1.5">
              <Lightning size={14} weight="fill" aria-hidden />
              {gen.done} / {gen.total} lecciones
            </span>
            <span className="tabular-nums opacity-80">{pct}%</span>
          </div>
          <div className="artop-hud-meter w-full">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {gen.batches.map((b, i) => {
            const active = b.state === "doing" && !paused;
            return (
              <li
                key={b.name}
                className={cn(
                  "relative flex min-h-[52px] items-center gap-3 overflow-hidden rounded-[12px] border px-4 text-[14px] font-bold",
                  active
                    ? "border-[var(--color-neon)]/50 bg-[var(--color-neon-mist)] shadow-[0_0_18px_rgb(255_0_127_/_0.18)]"
                    : "border-[var(--color-neon)]/12 bg-white/75"
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[var(--color-neon)] shadow-[0_0_12px_rgb(255_0_127_/_0.7)]"
                  />
                )}
                <span className="font-display text-[11px] font-extrabold tabular-nums tracking-[0.12em] text-[var(--color-text-3)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {b.state === "done" ? (
                  <CheckCircle size={20} weight="fill" className="text-[#16A34A]" aria-hidden />
                ) : active ? (
                  <span
                    aria-hidden
                    className="artop-breathe flex size-[20px] items-center justify-center rounded-full bg-[var(--color-neon)] shadow-[0_0_14px_rgb(255_0_127_/_0.55)]"
                  />
                ) : (
                  <span aria-hidden className="size-[20px] rounded-full border-2 border-[var(--color-border)]" />
                )}
                <span className={b.state === "queued" || (paused && b.state === "doing") ? "text-[var(--color-text-3)]" : ""}>
                  {b.name}
                </span>
                <span className="ml-auto text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-text-3)]">
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
            size="md"
            fullWidth
            className={
              paused
                ? "bg-[var(--color-neon)] border-[var(--color-neon-deep)] hover:bg-[#e60072]"
                : "border-[var(--color-neon)]/40 bg-white text-[var(--color-neon-ink)] hover:border-[var(--color-neon)] hover:bg-[var(--color-neon-mist)]"
            }
            variant={paused ? "primary" : "secondary"}
            onClick={() => {
              setPaused((p) => !p);
              push(
                paused
                  ? { title: "Generación reanudada", body: gen.stage, tone: "info" }
                  : { title: "Generación pausada", body: "Retomamos cuando quieras.", tone: "info" }
              );
            }}
          >
            {paused ? <><Play size={18} weight="fill" /> Reanudar</> : <><Pause size={18} weight="fill" /> Pausar</>}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CourseError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="artop-rise flex flex-col items-center px-6 py-8 text-center">
      <span className="flex size-[64px] items-center justify-center rounded-[22px] bg-[#FEE2E2]">
        <WarningCircle size={38} weight="fill" className="text-[#DC2626]" aria-hidden />
      </span>
      <CardTitle className="mt-4 text-[20px]!">Algo se atascó</CardTitle>
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
