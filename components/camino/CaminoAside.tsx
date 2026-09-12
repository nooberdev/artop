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
          className="artop-progress-fill h-full rounded-full bg-[var(--color-neon)]"
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
      <Card aria-label="Racha" className="artop-card-cyber relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-[#FFF4E5]"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex size-[48px] items-center justify-center rounded-[16px] bg-[#FFF4E5]">
            <Flame size={30} weight="fill" className="artop-flicker text-[#FF9600]" aria-hidden />
          </span>
          <div>
            <p className="font-display text-[22px] font-extrabold leading-none tracking-tight">{streak} días</p>
            <p className="mt-1 text-[13px] font-bold text-[var(--color-text-2)]">de racha. No la rompas.</p>
          </div>
        </div>
        <div className="relative mt-3.5 flex gap-1.5" aria-hidden>
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

      <Card aria-label="Misiones del día" className="artop-card-cyber">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-[17px] font-extrabold tracking-tight">Misiones del día</h2>
        </div>
        <ul className="mt-4 flex flex-col gap-4">
          {caminoQuests.map((q) => (
            <li key={q.id} className="flex items-center gap-3">
              <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[14px] bg-[var(--color-neon-tint)]">
                <Gift size={24} weight="duotone" className="text-[var(--color-neon)]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold">{q.title}</p>
                <QuestBar done={q.done} goal={q.goal} label={q.title} />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card aria-label="Tu clasificación" className="artop-card-cyber">
        <h2 className="font-display text-[17px] font-extrabold tracking-tight">Clasificación</h2>
        <div className="mt-3 flex items-center gap-3">
          <span
            className="flex size-[48px] shrink-0 items-center justify-center rounded-[16px] border-b-4"
            style={{ background: rank.color, borderColor: "rgb(0 0 0 / 0.25)" }}
          >
            <Trophy size={22} weight="fill" className="text-white" aria-hidden />
          </span>
          <p className="text-[14px] font-medium text-[var(--color-text-2)]">
            <strong className="text-[var(--color-text)]">{rank.name} · {rankPoints} PR</strong>
            {next ? ` · ${missing} PR para ${next.name}` : " · Rango máximo"}
          </p>
        </div>
        <Link
          href="/clasificacion"
          className="artop-press mt-3.5 flex min-h-[48px] items-center justify-center rounded-[14px] border-2 border-[var(--color-neon)]/25 bg-[var(--color-neon-mist)] font-display text-[14px] font-extrabold text-[var(--color-neon-ink)] hover:border-[var(--color-neon)] hover:bg-[var(--color-neon-tint)]"
        >
          Ver clasificación
        </Link>
      </Card>

      <Card aria-label="Conceptos dominados" className="artop-card-cyber">
        <h2 className="font-display text-[17px] font-extrabold tracking-tight">Ya dominas</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {caminoMastered.map((c) => (
            <li
              key={c}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#bbf7d0] bg-[#dcfce7] px-3 text-[13px] font-extrabold text-[#15803d]"
            >
              <CheckCircle size={16} weight="fill" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
