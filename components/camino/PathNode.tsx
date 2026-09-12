"use client";

import {
  Star, Check, Lock, ArrowClockwise, Flag, Medal, Lightning, Trophy, Gift,
} from "@phosphor-icons/react";
import type { CaminoNode, CaminoUnit } from "@/lib/camino";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<CaminoNode["type"], typeof Star> = {
  lesson: Star,
  review: ArrowClockwise,
  checkpoint: Flag,
  exam: Medal,
  challenge: Lightning,
  chest: Gift,
  milestone: Trophy,
};

const TYPE_LABEL: Record<CaminoNode["type"], string> = {
  lesson: "Lección",
  review: "Repaso",
  checkpoint: "Checkpoint",
  exam: "Examen",
  challenge: "Desafío",
  chest: "Cofre",
  milestone: "Hito",
};

export const STATUS_LABEL: Record<CaminoNode["status"], string> = {
  completed: "Completada",
  "in-progress": "Tu siguiente paso",
  available: "Disponible",
  locked: "Bloqueada",
  review: "Para repasar",
};

export function PathNode({
  node,
  unit,
  showStart,
  onSelect,
}: {
  node: CaminoNode;
  unit: CaminoUnit;
  showStart: boolean;
  onSelect: (node: CaminoNode) => void;
}) {
  const Icon = node.status === "completed" ? Check : node.status === "locked" ? Lock : TYPE_ICON[node.type];
  const isChest = node.type === "chest" || node.type === "milestone";
  const active = node.status === "in-progress";
  const done = node.status === "completed";

  const face = done || active
    ? { background: unit.color, borderColor: unit.deep, color: "#fff" }
    : node.status === "available"
      ? undefined
      : undefined;

  return (
    <div className="relative mx-auto w-fit">
      {active && showStart && (
        <>
          <span aria-hidden className="artop-breathe absolute top-1/2 left-1/2 size-[84px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-surface-3)]" />
          <span className="artop-node-pop absolute -top-[48px] left-1/2 z-10 -translate-x-1/2">
            <span className="artop-bounce-soft block rounded-[12px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-display text-[15px] font-extrabold tracking-wide text-[var(--color-brand-ink)] shadow-[var(--shadow-card)]">
              EMPIEZA
            </span>
            <span aria-hidden className="mx-auto -mt-[7px] block size-3 rotate-45 border-b-2 border-r-2 border-[var(--color-border)] bg-[var(--color-surface)]" />
          </span>
        </>
      )}
      <button
        onClick={() => onSelect(node)}
        aria-label={`${TYPE_LABEL[node.type]}: ${node.title}. ${STATUS_LABEL[node.status]}. ${node.xp} XP.`}
        style={face}
        className={cn(
          "artop-press relative flex items-center justify-center border-b-8",
          isChest ? "size-[72px] rounded-[24px]" : "size-[68px] rounded-full",
          done || active ? "text-white" : "",
          node.status === "available" && "bg-[var(--color-surface)] border-[var(--color-border)]",
          node.status === "locked" && "bg-[#e5e5e5] border-[#cfcfcf] text-[#afafaf] ",
          active && "artop-complete-pop"
        )}
      >
        {node.status === "available" && (
          <span aria-hidden className="absolute inset-0 rounded-[inherit] border-2" style={{ borderColor: unit.color }} />
        )}
        <Icon
          size={isChest ? 34 : 30}
          weight={done || active ? "fill" : "bold"}
          aria-hidden
          className={cn(node.status === "available" && "shrink-0")}
          color={node.status === "available" ? unit.color : undefined}
        />
      </button>
    </div>
  );
}
