"use client";

import Link from "next/link";
import { Flame, CheckCircle, Trophy, Gift } from "@phosphor-icons/react";
import { Card } from "@/components/ui";
import { useMounted } from "@/lib/anim";
import { useStore } from "@/lib/store";
import { getRank } from "@/lib/metas";
import { caminoMastered, caminoQuests } from "@/lib/camino";

function QuestBar({ done, goal, label }: { done: number; goal: number; label: string }) {
  const mounted = useMounted();
  const pct = Math.max(0, Math.min(100, (done / goal) * 100));
  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={label}
        className="h-3.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]"
      >
        <div
          className="artop-progress-fill h-full rounded-full bg-[#FFC800]"
          style={{ width: mounted ? `${pct}%` : "0%" }}
        />
      </div>
      <p className="mt-1 text-right text-[12px] font-extrabold text-[var(--color-text-3)]">
        {done} / {goal}
      </p>
    </div>
  );
}

export function CaminoAside() {
  const { streak, rankPoints } = useStore();
  const { rank, next, missing } = getRank(rankPoints);
  const week = [40, 65, 30, 80, 55, 90, 72];
  return (
    <div className="flex flex-col gap-4">
      <Card aria-label="Racha" className="rounded-[22px]!">
        <div className="flex items-center gap-3">
          <span className="flex size-[48px] items-center justify-center rounded-[16px] bg-[#FFF4E5]">
            <Flame size={28} weight="fill" className="text-[#FF9600]" aria-hidden />
          </span>
          <div>
            <p className="font-display text-[20px] font-extrabold leading-none">{streak} días</p>
            <p className="mt-1 text-[13px] font-bold text-[var(--color-text-2)]">de racha. No la rompas.</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {week.map((v, i) => (
            <span
              key={i}
              title={`${v} XP`}
              className={
                v >= 50
                  ? "h-2.5 flex-1 rounded-full bg-[#FF9600]"
                  : "h-2.5 flex-1 rounded-full bg-[var(--color-surface-3)]"
              }
            />
          ))}
        </div>
      </Card>

      <Card aria-label="Misiones del día" className="rounded-[22px]!">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[17px] font-extrabold">Misiones del día</h2>
</div>
        <ul className="mt-4 flex flex-col gap-4">
          {caminoQuests.map((q) => (
            <li key={q.id} className="flex items-center gap-3">
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[14px] bg-[#F3E8FF]">
                <Gift size={22} weight="duotone" className="text-[#CE82FF]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold">{q.title}</p>
                <QuestBar done={q.done} goal={q.goal} label={q.title} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card aria-label="Tu clasificación" className="rounded-[22px]!">
        <h2 className="font-display text-[17px] font-extrabold">Clasificación</h2>
        <div className="mt-3 flex items-center gap-3">
          <span
            className="flex size-[48px] shrink-0 items-center justify-center rounded-full border-b-4"
            style={{ background: rank.color, borderColor: "rgb(0 0 0 / 0.25)" }}
          >
            <Trophy size={22} weight="fill" className="text-white" aria-hidden />
          </span>
          <p className="text-[14px] font-medium text-[var(--color-text-2)]">
            <strong className="text-[var(--color-text)]">
              {rank.name} · {rankPoints} PR
            </strong>
            {next ? ` · ${missing} PR para ${next.name}` : " · Rango máximo"}
          </p>
        </div>
        <Link
          href="/clasificacion"
          className="artop-press mt-3 flex min-h-[48px] items-center justify-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-3)] font-display text-[14px] font-extrabold hover:border-[var(--color-brand)]"
        >
          Ver clasificación
        </Link>
      </Card>

      <Card aria-label="Conceptos dominados" className="rounded-[22px]!">
        <h2 className="font-display text-[17px] font-extrabold">Ya dominas</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {caminoMastered.map((c) => (
            <li
              key={c}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 text-[13px] font-extrabold text-[#15803D]"
            >
              <CheckCircle size={16} weight="fill" className="text-[#58CC02]" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
