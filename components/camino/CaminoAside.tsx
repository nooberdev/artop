"use client";

import Link from "next/link";
import { Flame, CheckCircle, Trophy, Crosshair, Lightning, Timer } from "@phosphor-icons/react";
import { useMounted } from "@/lib/anim";
import { useStore } from "@/lib/store";
import { getRank } from "@/lib/metas";
import { caminoMastered, caminoQuests } from "@/lib/camino";
import { cn } from "@/lib/utils";
import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "@phosphor-icons/react";

const QUEST_ICONS: ComponentType<IconProps>[] = [Lightning, Crosshair, Timer];

function HudPanel({
  ariaLabel,
  label,
  children,
  className,
}: {
  ariaLabel: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={ariaLabel} className={cn("artop-hud-panel p-4 sm:p-5", className)}>
      <span aria-hidden className="artop-hud-corner artop-hud-corner-tl" />
      <span aria-hidden className="artop-hud-corner artop-hud-corner-tr" />
      <span aria-hidden className="artop-hud-corner artop-hud-corner-bl" />
      <span aria-hidden className="artop-hud-corner artop-hud-corner-br" />
      <div className="relative z-[1]">
        <div className="mb-3 flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_rgb(255_0_127_/_0.8)]" />
          <p className="artop-hud-label">{label}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function QuestMeter({ done, goal, label }: { done: number; goal: number; label: string }) {
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
        className="artop-hud-meter w-full"
      >
        <span style={{ width: mounted ? `${pct}%` : "0%" }} />
      </div>
      <p className="mt-1.5 flex items-center justify-between text-[11px] font-extrabold tracking-wide text-[var(--color-text-3)]">
        <span className="uppercase opacity-80">signal</span>
        <span className="tabular-nums text-[var(--color-neon-ink)]">
          {done}/{goal}
        </span>
      </p>
    </div>
  );
}

export function CaminoAside() {
  const { streak, rankPoints } = useStore();
  const { rank, next, missing } = getRank(rankPoints);
  const week = [40, 65, 30, 80, 55, 90, 72];
  return (
    <div className="flex flex-col gap-3.5">
      <HudPanel ariaLabel="Racha" label="Racha // live">
        <div className="flex items-center gap-3">
          <span className="relative flex size-[52px] items-center justify-center rounded-[14px] border border-[var(--color-neon)]/25 bg-[var(--color-neon-mist)] shadow-[inset_0_0_16px_rgb(255_0_127_/_0.12)]">
            <span
              aria-hidden
              className="absolute inset-[3px] rounded-[11px] border border-dashed border-[var(--color-neon)]/25"
            />
            <Flame size={28} weight="fill" className="artop-flicker relative text-[#FF9600]" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[24px] font-extrabold leading-none tracking-tight tabular-nums">
              {streak}
              <span className="ml-1 text-[13px] font-extrabold tracking-[0.12em] text-[var(--color-neon-ink)] uppercase">
                días
              </span>
            </p>
            <p className="mt-1.5 text-[13px] font-bold text-[var(--color-text-2)]">
              Señal activa. No la rompas.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden>
          {week.map((v, i) => (
            <span
              key={i}
              title={`${v} XP`}
              className={cn(
                "h-8 flex-1 rounded-[6px] border",
                v >= 50
                  ? "border-[var(--color-neon)]/35 bg-[var(--color-neon)]/85 shadow-[0_0_10px_rgb(255_0_127_/_0.35)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-3)]/80"
              )}
              style={v >= 50 ? { opacity: 0.55 + (v / 100) * 0.45 } : undefined}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-3)]">
          7-day uplink
        </p>
      </HudPanel>

      <HudPanel ariaLabel="Misiones del día" label="Misiones // hoy">
        <ul className="flex flex-col gap-3.5">
          {caminoQuests.map((q, i) => {
            const Icon = QUEST_ICONS[i % QUEST_ICONS.length];
            return (
              <li
                key={q.id}
                className="rounded-[14px] border border-[var(--color-neon)]/15 bg-white/70 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.6)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-neon)]/30 bg-[var(--color-neon-tint)]">
                    <Icon size={20} weight="bold" className="text-[var(--color-neon)]" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-extrabold tracking-tight">{q.title}</p>
                    <div className="mt-1.5">
                      <QuestMeter done={q.done} goal={q.goal} label={q.title} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </HudPanel>

      <HudPanel ariaLabel="Tu clasificación" label="Rank // PR">
        <div className="flex items-center gap-3">
          <span
            className="relative flex size-[52px] shrink-0 items-center justify-center rounded-[14px] border-2 border-white/40 shadow-[0_0_18px_rgb(0_0_0_/_0.12)]"
            style={{ background: rank.color }}
          >
            <span
              aria-hidden
              className="absolute inset-[4px] rounded-[10px] border border-dashed border-white/35"
            />
            <Trophy size={22} weight="fill" className="relative text-white" aria-hidden />
          </span>
          <p className="text-[14px] font-medium leading-snug text-[var(--color-text-2)]">
            <strong className="font-extrabold text-[var(--color-text)]">
              {rank.name} · {rankPoints} PR
            </strong>
            {next ? ` · ${missing} PR para ${next.name}` : " · Rango máximo"}
          </p>
        </div>
        <Link
          href="/clasificacion"
          className="artop-press mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] border-2 border-[var(--color-neon)] bg-[var(--color-neon)] font-display text-[14px] font-extrabold tracking-wide text-white shadow-[0_0_18px_rgb(255_0_127_/_0.35)] hover:bg-[#e60072]"
        >
          Abrir clasificación
        </Link>
      </HudPanel>

      <HudPanel ariaLabel="Conceptos dominados" label="Unlocks // core">
        <ul className="flex flex-wrap gap-2">
          {caminoMastered.map((c) => (
            <li
              key={c}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[10px] border border-[var(--color-neon)]/25 bg-[var(--color-neon-mist)] px-3 text-[13px] font-extrabold text-[var(--color-neon-ink)]"
            >
              <CheckCircle size={15} weight="fill" className="text-[var(--color-neon)]" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </HudPanel>
    </div>
  );
}
