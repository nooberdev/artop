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
  const available = node.status === "available";

  const face = done || active
    ? { background: unit.color, borderColor: unit.deep, color: "#fff" }
    : undefined;

  return (
    <div className="relative mx-auto w-fit">
      {active && showStart && (
        <>
          <span
            aria-hidden
            className="artop-halo-pulse artop-path-halo absolute top-1/2 left-1/2 size-[132px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
          <span
            aria-hidden
            className="artop-ring-pulse artop-path-ring absolute top-1/2 left-1/2 size-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-neon)]/55"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 size-[78px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-neon)]/40"
          />
          <span className="artop-node-pop absolute -top-[64px] left-1/2 z-10 -translate-x-1/2">
            <span className="artop-empieza-chip block rounded-[16px] border-b-[5px] px-5 py-2.5 font-display text-[17px] font-extrabold tracking-[0.12em] uppercase">
              EMPIEZA
            </span>
            <span
              aria-hidden
              className="mx-auto -mt-[7px] block size-3.5 rotate-45 border-b-[3px] border-r-[3px] border-[var(--color-neon-deep)] bg-[var(--color-neon)] shadow-[0_0_12px_rgb(255_0_127_/_0.55)]"
            />
          </span>
        </>
      )}
      <button
        onClick={() => onSelect(node)}
        aria-label={`${TYPE_LABEL[node.type]}: ${node.title}. ${STATUS_LABEL[node.status]}. ${node.xp} XP.`}
        style={face}
        className={cn(
          "artop-press relative flex items-center justify-center border-b-8",
          isChest ? "size-[74px] rounded-[24px]" : "size-[70px] rounded-full",
          done || active ? "text-white" : "",
          available && "bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-card)]",
          node.status === "locked" && "bg-[#ececf1] border-[#d4d4dc] text-[#9a9aa8]",
          node.status === "review" && "bg-[var(--color-neon-tint)] border-[var(--color-neon)] text-[var(--color-neon-ink)]",
          active && "artop-complete-pop artop-neon-pulse z-[1]"
        )}
      >
        {available && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] border-[2.5px]"
            style={{ borderColor: unit.color }}
          />
        )}
        <Icon
          size={isChest ? 34 : 30}
          weight={done || active ? "fill" : "bold"}
          aria-hidden
          className={cn(available && "shrink-0")}
          color={available ? unit.color : undefined}
        />
      </button>
    </div>
  );
}
