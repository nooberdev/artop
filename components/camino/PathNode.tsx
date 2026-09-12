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

/** Verde éxito estilo Duo — completados siempre verdes, no el color de unidad. */
const SUCCESS = { background: "#58CC02", borderColor: "#46A302", color: "#fff" };

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

  const face = done
    ? SUCCESS
    : active
      ? { background: unit.color, borderColor: unit.deep, color: "#fff" }
      : undefined;

  return (
    <div className="relative mx-auto w-fit">
      {active && showStart && (
        <>
          {/* Soft playful halo — no neon rings */}
          <span
            aria-hidden
            className="artop-breathe absolute top-1/2 left-1/2 size-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand-tint)]"
          />
          <span className="artop-node-pop absolute -top-[52px] left-1/2 z-10 -translate-x-1/2">
            <span className="artop-bounce-soft block rounded-[16px] border-2 border-b-[5px] border-[var(--color-brand-deep)] bg-[var(--color-surface)] px-5 py-2.5 font-display text-[16px] font-extrabold tracking-[0.08em] text-[var(--color-brand-ink)] shadow-[var(--shadow-card)]">
              EMPIEZA
            </span>
            <span
              aria-hidden
              className="mx-auto -mt-[8px] block size-3.5 rotate-45 border-b-2 border-r-2 border-[var(--color-brand-deep)] bg-[var(--color-surface)]"
            />
          </span>
        </>
      )}
      <button
        onClick={() => onSelect(node)}
        aria-label={`${TYPE_LABEL[node.type]}: ${node.title}. ${STATUS_LABEL[node.status]}. ${node.xp} XP.`}
        style={face}
        className={cn(
          "artop-press relative z-[1] flex items-center justify-center border-b-8",
          isChest ? "size-[74px] rounded-[24px]" : "size-[70px] rounded-full",
          done || active ? "text-white" : "",
          available && "bg-[var(--color-surface)] border-[#e5e5e5] shadow-[var(--shadow-card)]",
          node.status === "locked" && "bg-[#e5e5e5] border-[#cfcfcf] text-[#afafaf]",
          node.status === "review" && "bg-[#FEF9C3] border-[#EAB308] text-[#A16207]",
          active && "artop-complete-pop"
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
          size={isChest ? 34 : 32}
          weight={done || active ? "fill" : "bold"}
          aria-hidden
          className={cn(available && "shrink-0")}
          color={available ? unit.color : undefined}
        />
      </button>
    </div>
  );
}
