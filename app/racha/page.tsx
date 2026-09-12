"use client";

import Link from "next/link";
import { Flame, Trophy, Lightning, Snowflake, ShieldCheck } from "@phosphor-icons/react";
import { AppShell } from "@/components/shell/AppShell";
import { Card, CardTitle, CardSub, Button, useToast } from "@/components/ui";
import { useCountUp } from "@/lib/anim";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function streakDates(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() - 1);
  }
  return out;
}

const WEEK = ["L", "M", "X", "J", "V", "S", "D"];

function MonthGrid({ streakDays }: { streakDays: number }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("es", { month: "long", year: "numeric" });
  const first = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const total = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <div>
      <p className="font-display text-[15px] font-extrabold capitalize">{monthName}</p>
      <div className="mt-3 grid grid-cols-7 justify-items-center gap-1 sm:gap-1.5" role="img" aria-label={`Racha de ${streakDays} días este mes`}>
        {WEEK.map((d) => (
          <span key={d} className="flex size-9 items-center justify-center pb-1 text-center text-[11px] font-extrabold text-[var(--color-text-3)] sm:size-10">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} className="size-9 sm:size-10" />;
          const active = day <= today && day > today - streakDays;
          const isToday = day === today;
          return (
            <span
              key={day}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-[13px] font-extrabold sm:size-10",
                active ? "bg-[#FFE3C2] text-[#B25E00] " : "text-[var(--color-text-3)]",
                isToday && "ring-2 ring-[#FF9600] ring-offset-2 ring-offset-[var(--color-card)]"
              )}
            >
              {active ? <Flame size={18} weight="fill" className="text-[#FF9600]" aria-hidden /> : day}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[12px] font-bold text-[var(--color-text-3)]">
        <span className="inline-flex items-center gap-1.5"><Flame size={14} weight="fill" className="text-[#FF9600]" /> Día activo</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full ring-2 ring-[#FF9600]" /> Hoy</span>
      </div>
    </div>
  );
}

export default function RachaPage() {
  const { push } = useToast();
  const { streak, best, xp, freezes, energy, claimedEnergyDays, claimStreakEnergy } = useStore();
  const days = useCountUp(streak);
  const pending = streakDates(streak).filter((d) => !claimedEnergyDays.includes(d));

  function claim() {
    const gained = claimStreakEnergy(pending);
    if (gained > 0) {
      push({ title: `+${gained} de energía`, body: "Gástala en el pase de batalla.", tone: "success" });
    } else {
      push({ title: "Todo reclamado", body: "Vuelve mañana por más energía.", tone: "info" });
    }
  }
  return (
    <AppShell title="Mi racha" subtitle={`${streak} días seguidos aprendiendo`}>
      <div className="flex flex-col gap-4">
        <Card className="artop-rise">
          <div className="flex items-center gap-4 sm:gap-5">
            <span className="flex size-[76px] shrink-0 items-center justify-center rounded-full bg-[#FFE3C2] sm:size-[88px]">
              <Flame size={44} weight="fill" className="artop-flicker text-[#FF9600]" aria-hidden />
            </span>
            <div className="min-w-0 text-left">
              <p className="font-display text-[36px] font-extrabold leading-none sm:text-[40px]" aria-live="polite">{days} <span className="text-[18px] text-[var(--color-text-2)]">días</span></p>
              <p className="mt-1 text-[14px] font-bold text-[var(--color-text-2)]">de racha · mejor marca: {best}</p>
            </div>
          </div>
        </Card>

        <Card accentBorder>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Lightning size={36} weight="fill" className="shrink-0 text-[#EAB308]" aria-hidden />
              <div>
                <CardTitle className="text-[17px]!">Energía: {energy}</CardTitle>
                <CardSub className="text-[14px]!">
                  {pending.length > 0 ? `Tienes ${pending.length} días por reclamar.` : "Sin días pendientes. Sigue la racha."}
                </CardSub>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-2.5">
            <Button size="md" fullWidth disabled={pending.length === 0} onClick={claim}>
              <Lightning size={18} weight="fill" /> {pending.length > 0 ? `Reclamar ${pending.length} de energía` : "Todo reclamado"}
            </Button>
            <Link href="/pase" className="artop-press flex min-h-[52px] items-center justify-center rounded-[16px] bg-[var(--color-surface-3)] border border-[var(--color-border)] font-display text-[15px] font-extrabold hover:border-[var(--color-brand)]">
              Gastar en el pase
            </Link>
          </div>
        </Card>

        <Card>
          <MonthGrid streakDays={streak} />
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Trophy, value: String(best), label: "mejor racha", color: "text-[#FFC800]" },
            { icon: Lightning, value: String(xp), label: "XP total", color: "text-[#00A6FF]" },
            { icon: ShieldCheck, value: "#9", label: "Liga Plata", color: "text-[#AFAFAF]" },
          ].map((s) => (
            <Card key={s.label} className="p-4! text-center">
              <s.icon size={26} weight="fill" className={`mx-auto ${s.color}`} aria-hidden />
              <p className="mt-1.5 font-display text-[20px] font-extrabold leading-none">{s.value}</p>
              <p className="mt-1 text-[11px] font-bold text-[var(--color-text-2)]">{s.label}</p>
            </Card>
          ))}
        </div>

        <Card accentBorder>
          <div className="flex items-center gap-3">
            <Snowflake size={36} weight="fill" className="shrink-0 text-[#00A6FF]" aria-hidden />
            <div>
              <CardTitle className="text-[17px]!">Protector de racha: {freezes}</CardTitle>
              <CardSub className="text-[14px]!">Si fallas un día, el protector te salva.</CardSub>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/pase" className="artop-press flex min-h-[52px] items-center justify-center rounded-[16px] bg-[var(--color-brand)] px-6 font-display text-[16px] font-extrabold text-white border-b-4 border-[var(--color-brand-deep)]">
              Conseguir en el pase
            </Link>
          </div>
          <div className="mt-3">
            <Button variant="secondary" size="md" fullWidth>Cómo funciona la racha</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
