"use client";

import { useMemo } from "react";
import { ArrowDown } from "@phosphor-icons/react";
import type { CaminoNode, CaminoUnit } from "@/lib/camino";
import { useStore } from "@/lib/store";
import { UnitBanner } from "./UnitBanner";
import { PathNode } from "./PathNode";
import { LessonCard } from "./LessonCard";
import { cn } from "@/lib/utils";

/** Zigzag Duolingo: offsets literales para que Tailwind los detecte. */
const OFFSETS = [
  "",
  "translate-x-[-30px] sm:translate-x-[-45px]",
  "translate-x-[-52px] sm:translate-x-[-80px]",
  "translate-x-[-30px] sm:translate-x-[-45px]",
  "",
  "translate-x-[30px] sm:translate-x-[45px]",
  "translate-x-[52px] sm:translate-x-[80px]",
  "translate-x-[30px] sm:translate-x-[45px]",
];

export function WindingPath({
  units,
  openNodeId,
  onSelect,
  onAction,
}: {
  units: CaminoUnit[];
  openNodeId: string | null;
  onSelect: (node: CaminoNode, unit: CaminoUnit) => void;
  onAction: () => void;
}) {
  const { completedLessons } = useStore();
  // Las lecciones completadas (store local) pintan el camino: se marcan
  // como completadas y el primer nodo pendiente se vuelve el activo.
  const effective = useMemo(() => {
    let activated = false;
    return units.map((u) => ({
      ...u,
      nodes: u.nodes.map((n) => {
        const done = n.status === "completed" || completedLessons.includes(n.id);
        if (done) return { ...n, status: "completed" as const };
        if (!activated) {
          activated = true;
          return { ...n, status: "in-progress" as const };
        }
        return n;
      }),
    }));
  }, [units, completedLessons]);

  const activeUnitId = effective.find((u) => u.nodes.some((n) => n.status === "in-progress"))?.id;
  let jumpShown = false;
  return (
    <div className="flex flex-col gap-9">
      {effective.map((unit, ui) => {
        const showJump = unit.locked && !jumpShown;
        if (unit.locked) jumpShown = true;
        return (
          <div key={unit.id} className="flex flex-col gap-6">
            <div className="artop-rise" style={{ animationDelay: `${Math.min(ui * 70, 400)}ms` }}>
              <UnitBanner unit={unit} id={unit.id === activeUnitId ? "unidad-actual" : undefined} />
            </div>
            {showJump && (
              <div className="flex justify-center">
                <a
                  href="#unidad-actual"
                  className="artop-press inline-flex min-h-[52px] items-center gap-2 rounded-[16px] border-b-4 border-[var(--color-neon-deep)] bg-[var(--color-neon)] px-6 font-display text-[15px] font-extrabold tracking-[0.06em] text-white shadow-[var(--shadow-neon-soft)] hover:bg-[#e60072]"
                >
                  SALTAR AQUÍ <ArrowDown size={18} weight="bold" aria-hidden />
                </a>
              </div>
            )}
            <ol aria-label={`Nodos de ${unit.title}`} className="relative flex flex-col gap-5">
              {unit.nodes.map((node, i) => {
                const open = openNodeId === node.id;
                return (
                  <li key={node.id} className={cn("relative", OFFSETS[i % OFFSETS.length], open && "z-20")}>
                    <div className="artop-rise" style={{ animationDelay: `${Math.min(120 + ui * 70 + i * 40, 650)}ms` }}>
                      <PathNode node={node} unit={unit} showStart={!openNodeId} onSelect={(n) => onSelect(n, unit)} />
                      {open && <LessonCard node={node} unit={unit} onAction={onAction} />}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
