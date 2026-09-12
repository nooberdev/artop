"use client";

import Link from "next/link";
import { Trophy, Check, Sword, Diamond } from "@phosphor-icons/react";
import { AppShell } from "@/components/shell/AppShell";
import { Badge, Card, CardSub, CardTitle, ProgressBar } from "@/components/ui";
import { useStore } from "@/lib/store";
import { RANKS, getRank } from "@/lib/metas";
import { cn } from "@/lib/utils";

export default function ClasificacionPage() {
  const { rankPoints } = useStore();
  const { rank, index, next, progress, missing } = getRank(rankPoints);

  return (
    <AppShell title="Clasificación" subtitle="Ranked solo: compites contra ti, no contra otros">
      <div className="flex flex-col gap-4">
        <Card accentBorder className="artop-rise text-center">
          <span
            className="mx-auto flex size-[76px] items-center justify-center rounded-full border-b-8"
            style={{ background: rank.color, borderColor: "rgb(0 0 0 / 0.3)" }}
          >
            <Trophy size={44} weight="fill" className="text-white" aria-hidden />
          </span>
          <h2 className="mt-3 font-display text-[24px] font-extrabold tracking-tight">{rank.name}</h2>
          <p className="font-display text-[16px] font-extrabold text-[var(--color-text-2)]">{rankPoints} PR</p>
          <div className="mt-4 text-left">
            <ProgressBar value={progress} label={next ? `Camino a ${next.name}` : "Rango máximo"} />
            <p className="mt-1.5 text-right text-[13px] font-extrabold text-[var(--color-text-2)]">
              {next ? `Te faltan ${missing} PR` : "Eres Campeón. Leyenda."}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 font-display text-[16px] font-extrabold">
            <Sword size={20} weight="bold" className="text-[var(--color-brand)]" /> Solo contra ti
          </div>
          <CardSub className="mt-1">Sin rivales ni presión: cada lección te da +12 PR. Mantén tu racha para subir más rápido.</CardSub>
          <div className="mt-3">
            <Link href="/camino" className="artop-press flex min-h-[52px] items-center justify-center rounded-[16px] bg-[var(--color-brand)] px-6 font-display text-[16px] font-extrabold text-white border-b-4 border-[var(--color-brand-deep)]">
              Ganar PR ahora
            </Link>
          </div>
        </Card>

        <Card padded={false} aria-label="Rangos">
          <ul className="flex flex-col gap-1 p-2">
            {RANKS.map((r, i) => {
              const reached = i < index;
              const current = i === index;
              return (
                <li
                  key={r.name}
                  className={cn(
                    "flex min-h-[60px] items-center gap-3 rounded-[14px] border-2 px-3",
                    current ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)]" : "border-transparent"
                  )}
                >
                  <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full border-b-4" style={{ background: r.color, borderColor: "rgb(0 0 0 / 0.25)" }}>
                    <Trophy size={20} weight="fill" className="text-white" aria-hidden />
                  </span>
                  <span className="flex-1 font-display text-[16px] font-extrabold">
                    {r.name}
                    {current && <Badge tone="brand" className="ml-2">TÚ</Badge>}
                  </span>
                  {reached || current ? (
                    <Check size={20} weight="bold" className="text-[#16A34A]" aria-label={current ? "Rango actual" : "Rango superado"} />
                  ) : (
                    <span className="text-[13px] font-extrabold text-[var(--color-text-3)]">{r.min} PR</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 font-display text-[16px] font-extrabold">
            <Diamond size={20} weight="fill" className="text-[#00A6FF]" /> Recompensa de temporada
          </div>
          <CardSub className="mt-1">Temporada 1 · Episodio 0. Al cerrar: Oro +20 rombos, Platino +40, Diamante +80, Campeón +150.</CardSub>
        </Card>
      </div>
    </AppShell>
  );
}
