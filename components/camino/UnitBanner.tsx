"use client";

import { BookOpen, Lock } from "@phosphor-icons/react";
import { useToast } from "@/components/ui";
import type { CaminoUnit } from "@/lib/camino";
import { cn } from "@/lib/utils";

export function UnitBanner({ unit, id }: { unit: CaminoUnit; id?: string }) {
  const { push } = useToast();
  const done = unit.nodes.filter((n) => n.status === "completed").length;
  return (
    <section
      id={id}
      aria-label={`Unidad ${unit.number}: ${unit.title}`}
      style={unit.locked ? undefined : { background: unit.color }}
      className={cn(
        "rounded-[20px] p-4 shadow-[var(--shadow-card)]",
        unit.locked
          ? "border border-[var(--color-border)] bg-[var(--color-surface-3)]"
          : "text-white"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[12px] font-extrabold uppercase tracking-[0.1em]",
              unit.locked ? "text-[var(--color-text-3)]" : "text-white/85"
            )}
          >
            Unidad {unit.number}
          </p>
          <h2
            className={cn(
              "font-display text-[20px] font-extrabold leading-tight tracking-tight",
              unit.locked ? "text-[var(--color-text-2)]" : ""
            )}
          >
            {unit.locked && <Lock size={18} weight="bold" className="mr-1.5 inline -mt-1" aria-hidden />}
            {unit.title}
          </h2>
          <p
            className={cn(
              "mt-0.5 truncate text-[14px] font-medium",
              unit.locked ? "text-[var(--color-text-3)]" : "text-white/90"
            )}
          >
            {unit.goal}
          </p>
          <p
            className={cn(
              "mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-extrabold",
              unit.locked
                ? "bg-black/5 text-[var(--color-text-3)]"
                : "bg-white/20 text-white"
            )}
          >
            {done} / {unit.nodes.length} completadas
          </p>
        </div>
        {!unit.locked && (
          <button
            onClick={() =>
              push({ title: "Guía en camino", body: "El resumen de la unidad llegará pronto.", tone: "info" })
            }
            className="artop-press inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[14px] border-2 border-white/80 bg-white/10 px-4 font-display text-[14px] font-extrabold tracking-wide text-white hover:bg-white/20"
          >
            <BookOpen size={20} weight="bold" aria-hidden />
            GUÍA
          </button>
        )}
      </div>
    </section>
  );
}
