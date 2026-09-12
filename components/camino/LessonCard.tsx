"use client";

import { Lock, Play, ArrowClockwise } from "@phosphor-icons/react";
import type { CaminoNode, CaminoUnit } from "@/lib/camino";
import { STATUS_LABEL } from "./PathNode";
import { cn } from "@/lib/utils";

/** Tarjeta anclada al nodo (estilo Duolingo): sale del nodo, no flota al centro. */
export function LessonCard({
  node,
  unit,
  onAction,
}: {
  node: CaminoNode;
  unit: CaminoUnit;
  onAction: () => void;
}) {
  const locked = node.status === "locked";
  const done = node.status === "completed";
  return (
    <div className="artop-node-pop absolute bottom-[calc(100%+16px)] left-1/2 z-20 w-[280px] max-w-[calc(100vw-48px)] -translate-x-1/2">
      <div
        style={locked ? undefined : { background: unit.color }}
        className={cn(
          "rounded-[20px] p-4 shadow-xl",
          locked ? "bg-[#e5e5e5] dark:bg-[#2b2b33]" : "text-white"
        )}
      >
        <p className={cn("font-display text-[19px] font-extrabold leading-snug tracking-tight", locked ? "text-[var(--color-text-2)]" : "")}>
          {locked && <Lock size={17} weight="bold" className="mr-1.5 inline -mt-1" aria-hidden />}
          {node.title}
        </p>
        <p className={cn("mt-0.5 text-[13px] font-bold", locked ? "text-[var(--color-text-3)]" : "text-white/85")}>
          {STATUS_LABEL[node.status]} · {node.xp} XP
        </p>
        <button
          onClick={onAction}
          disabled={locked}
          className={cn(
            "artop-press mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] font-display text-[16px] font-extrabold tracking-wide",
            locked
              ? "cursor-not-allowed bg-black/10 text-[var(--color-text-3)] dark:bg-white/10"
              : "bg-white hover:bg-white/90"
          )}
          style={locked ? undefined : { color: unit.color }}
        >
          {locked ? (
            "BLOQUEADA"
          ) : done ? (
            <><ArrowClockwise size={19} weight="bold" aria-hidden /> REPASAR +{node.xp} EXP</>
          ) : (
            <><Play size={19} weight="fill" aria-hidden /> EMPEZAR +{node.xp} EXP</>
          )}
        </button>
      </div>
      <span
        aria-hidden
        style={locked ? undefined : { background: unit.color }}
        className={cn("mx-auto -mt-2 block size-4 rotate-45", locked ? "bg-[#e5e5e5] dark:bg-[#2b2b33]" : "")}
      />
    </div>
  );
}
