"use client";

import { BookOpen, Lock } from "@phosphor-icons/react";
import { useToast } from "@/components/ui";
import type { CaminoUnit } from "@/lib/camino";
import { cn } from "@/lib/utils";

export function UnitBanner({ unit, id }: { unit: CaminoUnit; id?: string }) {
  const { push } = useToast();
  const done = unit.nodes.filter((n) => n.status === "completed").length;
  const pct = unit.nodes.length ? Math.round((done / unit.nodes.length) * 100) : 0;
  return (
    <section
      id={id}
      aria-label={`Unidad ${unit.number}: ${unit.title}`}
      style={unit.locked ? undefined : {
        background: unit.color,
        boxShadow: `0 12px 28px -14px ${unit.deep}aa, 0 0 0 1px rgb(255 255 255 / 0.08)`,
      }}
      className={cn(
        "overflow-hidden rounded-[20px] p-4 sm:p-5",
        unit.locked
          ? "bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)]"
          : "text-white"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={cn(
            "text-[12px] font-extrabold uppercase tracking-[0.14em]",
            unit.locked ? "text-[var(--color-text-3)]" : "text-white/80"
          )}>
            Unidad {unit.number}
          </p>
          <h2 className={cn(
            "mt-0.5 font-display text-[21px] font-extrabold leading-tight tracking-tight",
            unit.locked ? "text-[var(--color-text-2)]" : ""
          )}>
            {unit.locked && <Lock size={18} weight="bold" className="mr-1.5 inline -mt-1" aria-hidden />}
            {unit.title}
          </h2>
          <p className={cn(
            "mt-1 truncate text-[14px] font-medium",
            unit.locked ? "text-[var(--color-text-3)]" : "text-white/90"
          )}>
            {unit.goal}
          </p>
        </div>
        {!unit.locked && (
          <button
            onClick={() => push({ title: "Guía en camino", body: "El resumen de la unidad llegará pronto.", tone: "info" })}
            className="artop-press inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[12px] border-2 border-white/75 bg-white/10 px-4 font-display text-[14px] font-extrabold tracking-wide text-white backdrop-blur-sm hover:bg-white/20"
          >
            <BookOpen size={20} weight="bold" aria-hidden />
            GUÍA
          </button>
        )}
      </div>
      <div className="mt-3.5">
        <div
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={unit.nodes.length}
          aria-label={`Progreso de unidad: ${done} de ${unit.nodes.length}`}
          className={cn(
            "h-2.5 w-full overflow-hidden rounded-full",
            unit.locked ? "bg-[var(--color-surface-3)]" : "bg-black/20"
          )}
        >
          <div
            className={cn("h-full rounded-full transition-[width]", unit.locked ? "bg-[var(--color-text-3)]" : "bg-white")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={cn(
          "mt-1.5 text-[13px] font-extrabold",
          unit.locked ? "text-[var(--color-text-3)]" : "text-white"
        )}>
          {done} / {unit.nodes.length} completadas
        </p>
      </div>
    </section>
  );
}
