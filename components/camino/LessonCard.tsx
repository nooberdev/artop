"use client";

import { Lock, Play, ArrowClockwise } from "@phosphor-icons/react";
import type { CaminoNode, CaminoUnit } from "@/lib/camino";
import { STATUS_LABEL } from "./PathNode";
import { cn } from "@/lib/utils";

/** Tarjeta anclada al nodo: cyber-pop, sale del nodo (no flota al centro). */
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
    <div className="artop-node-pop absolute bottom-[calc(100%+18px)] left-1/2 z-20 w-[292px] max-w-[calc(100vw-48px)] -translate-x-1/2">
      <div
        style={locked ? undefined : { background: unit.color, boxShadow: `0 14px 36px -12px ${unit.deep}99, 0 0 0 1px rgb(255 255 255 / 0.12)` }}
        className={cn(
          "rounded-[22px] p-4",
          locked
            ? "bg-[#ececf1] border-2 border-[#d4d4dc] shadow-[var(--shadow-card)]"
            : "text-white"
        )}
      >
        <p className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.12em]",
          locked ? "bg-black/5 text-[var(--color-text-3)]" : "bg-white/20 text-white"
        )}>
          {STATUS_LABEL[node.status]}
        </p>
        <p className={cn(
          "mt-2 font-display text-[20px] font-extrabold leading-snug tracking-tight",
          locked ? "text-[var(--color-text-2)]" : ""
        )}>
          {locked && <Lock size={17} weight="bold" className="mr-1.5 inline -mt-1" aria-hidden />}
          {node.title}
        </p>
        <p className={cn("mt-1 text-[13px] font-bold", locked ? "text-[var(--color-text-3)]" : "text-white/85")}>
          {node.xp} XP · toca para {locked ? "ver" : done ? "repasar" : "empezar"}
        </p>
        <button
          onClick={onAction}
          disabled={locked}
          className={cn(
            "artop-press mt-3.5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] font-display text-[16px] font-extrabold tracking-wide border-b-4",
            locked
              ? "cursor-not-allowed bg-black/8 text-[var(--color-text-3)] border-transparent"
              : "bg-white hover:bg-white/95 border-black/10"
          )}
          style={locked ? undefined : { color: unit.deep }}
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
        className={cn("mx-auto -mt-2 block size-4 rotate-45", locked ? "bg-[#ececf1]" : "")}
      />
    </div>
  );
}
