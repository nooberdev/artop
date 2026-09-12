"use client";

import Link from "next/link";
import { Check, Lock, Lightning, Diamond, Snowflake, Gift } from "@phosphor-icons/react";
import { AppShell } from "@/components/shell/AppShell";
import { Badge, Button, Card, CardSub, CardTitle, ProgressBar, useToast } from "@/components/ui";
import { useStore } from "@/lib/store";
import {
  PASS_INFO, PASS_REWARDS, TIER_COUNT, TIER_UNLOCK, currentTier, type PassReward, type RewardKind,
} from "@/lib/metas";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<RewardKind, typeof Gift> = {
  xp: Lightning,
  rombos: Diamond,
  freeze: Snowflake,
  bundle: Gift,
};

const KIND_BG: Record<RewardKind, string> = {
  xp: "bg-[#FEF3C7] text-[#B45309] dark:bg-[#451A03] dark:text-[#FCD34D]",
  rombos: "bg-[#E0F2FE] text-[#0284C7] dark:bg-[#082F49] dark:text-[#7DD3FC]",
  freeze: "bg-[#E0F2FE] text-[#0284C7] dark:bg-[#082F49] dark:text-[#7DD3FC]",
  bundle: "bg-[#FAE2FB] text-[#9E00A1] dark:bg-[#331233] dark:text-[#F487F4]",
};

function RewardRow({
  reward, state, reason, onClaim,
}: {
  reward: PassReward;
  state: "claimed" | "claimable" | "locked";
  reason: string;
  onClaim: () => void;
}) {
  const Icon = KIND_ICON[reward.kind];
  const premium = reward.track === "premium";
  return (
    <button
      onClick={onClaim}
      aria-label={`${premium ? "Premium" : "Pase libre"}: ${reward.label} ${reward.amount}. ${state === "claimed" ? "Reclamada" : state === "claimable" ? "Toca para reclamar" : reason}.`}
      className={cn(
        "artop-press flex min-h-[68px] w-full items-center gap-3 rounded-[16px] border-2 p-3 text-left",
        state === "claimable"
          ? "bg-[var(--color-surface)] border-[var(--color-brand)]"
          : premium
            ? "bg-[#FDF3DC] border-[#E8C86A] dark:bg-[#2E230A] dark:border-[#5A4517]"
            : "bg-[var(--color-surface)] border-[var(--color-border)]",
        state === "claimed" && "opacity-70"
      )}
    >
      <span className={cn("flex size-[48px] shrink-0 items-center justify-center rounded-[14px]", KIND_BG[reward.kind])}>
        <Icon size={28} weight="fill" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] font-extrabold leading-tight">
          {reward.label} {reward.amount}
        </span>
        <span className="mt-0.5 block text-[12px] font-bold text-[var(--color-text-3)]">
          {state === "claimed" ? "En tu cuenta" : state === "claimable" ? `Cuesta ${PASS_INFO.claimCost} de energía` : reason}
        </span>
      </span>
      {state === "claimed" ? (
        <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white" aria-hidden>
          <Check size={20} weight="bold" />
        </span>
      ) : state === "claimable" ? (
        <span className="artop-pulse flex min-h-[44px] shrink-0 items-center rounded-full bg-[#22C55E] px-4 font-display text-[14px] font-extrabold text-white" aria-hidden>
          Tomar
        </span>
      ) : (
        <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-3)]" aria-hidden>
          <Lock size={18} weight="bold" />
        </span>
      )}
    </button>
  );
}

export default function PasePage() {
  const { push } = useToast();
  const {
    energy, gems, totalEnergyEarned, premiumPass, claimedRewards,
    spendEnergy, claimReward, buyPremium, addXp, earnGems, addFreezes,
  } = useStore();

  const tier = currentTier(totalEnergyEarned);
  const maxed = tier >= TIER_COUNT;
  const spanBase = TIER_UNLOCK[tier - 1];
  const spanNext = maxed ? spanBase + 1 : TIER_UNLOCK[tier];

  function apply(r: PassReward) {
    if (r.xp) addXp(r.xp);
    if (r.rombos) earnGems(r.rombos);
    if (r.freezes) addFreezes(r.freezes);
  }

  function describe(r: PassReward): { state: "claimed" | "claimable" | "locked"; reason: string } {
    if (claimedRewards.includes(r.id)) return { state: "claimed", reason: "" };
    if (r.tier > tier) return { state: "locked", reason: `Llega al Tier ${r.tier}` };
    if (r.track === "premium" && !premiumPass) return { state: "locked", reason: "Pase premium" };
    return { state: "claimable", reason: "" };
  }

  function tryClaim(r: PassReward) {
    const s = describe(r);
    if (s.state === "claimed") {
      push({ title: "Ya reclamada", body: "Esta recompensa ya es tuya.", tone: "info" });
      return;
    }
    if (s.state === "locked") {
      push({ title: "Bloqueada", body: s.reason === "Pase premium" ? `Consigue el premium por ${PASS_INFO.premiumCost} rombos.` : "Gana energía en Racha y lecciones para llegar.", tone: "info" });
      return;
    }
    if (energy < PASS_INFO.claimCost) {
      push({ title: "Sin energía", body: "Reclama días de racha para conseguir energía.", tone: "error" });
      return;
    }
    spendEnergy(PASS_INFO.claimCost);
    claimReward(r.id);
    apply(r);
    push({ title: `${r.label} ${r.amount} reclamado`, body: "Buen botín por aprender.", tone: "success" });
  }

  function buy() {
    if (buyPremium(PASS_INFO.premiumCost)) {
      push({ title: "Pase premium activado", body: "Toda la columna dorada es reclamable.", tone: "success" });
    } else {
      push({ title: "Te faltan rombos", body: "Gana rombos en el pase libre y la clasificación.", tone: "error" });
    }
  }

  return (
    <AppShell title="Pase de batalla" subtitle={`${PASS_INFO.season} · ${PASS_INFO.episode}`}>
      <div className="flex flex-col gap-4">
        <Card accentBorder>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] bg-[var(--color-surface-3)] px-3.5 font-display text-[16px] font-extrabold">
                <Lightning size={20} weight="fill" className="text-[#EAB308]" aria-hidden /> {energy}
              </span>
              <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] bg-[var(--color-surface-3)] px-3.5 font-display text-[16px] font-extrabold">
                <Diamond size={20} weight="fill" className="text-[#00A6FF]" aria-hidden /> {gems}
              </span>
            </div>
            <Badge tone="brand" className="text-[15px]! px-4! py-2!">TIER {tier}</Badge>
          </div>
          <div className="mt-4">
            <ProgressBar value={totalEnergyEarned - spanBase} max={Math.max(1, spanNext - spanBase)} label={maxed ? "Nivel máximo" : `Energía al Tier ${tier + 1}`} />
            <p className="mt-1.5 text-right text-[13px] font-extrabold text-[var(--color-text-2)]">
              {maxed ? "MAX" : `${totalEnergyEarned - spanBase} / ${spanNext - spanBase}`}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-[44px_1fr_1fr] gap-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-text-3)]">
          <span />
          <span>Pase libre</span>
          <span>Premium</span>
        </div>

        <ol className="flex flex-col gap-2.5" aria-label="Niveles del pase">
          {Array.from({ length: TIER_COUNT }, (_, i) => {
            const n = i + 1;
            const free = PASS_REWARDS.find((x) => x.tier === n && x.track === "free")!;
            const prem = PASS_REWARDS.find((x) => x.tier === n && x.track === "premium")!;
            const df = describe(free);
            const dp = describe(prem);
            const reached = n <= tier;
            return (
              <li key={n} className="artop-rise grid grid-cols-[44px_1fr_1fr] items-stretch gap-2" style={{ animationDelay: `${Math.min(i * 50, 350)}ms` }}>
                <span
                  aria-hidden
                  className={
                    reached
                      ? "flex items-center justify-center rounded-[14px] bg-[var(--color-brand)] font-display text-[17px] font-extrabold text-white"
                      : "flex items-center justify-center rounded-[14px] bg-[var(--color-surface-3)] font-display text-[17px] font-extrabold text-[var(--color-text-3)]"
                  }
                >
                  {n}
                </span>
                <RewardRow reward={free} state={df.state} reason={df.reason} onClaim={() => tryClaim(free)} />
                <RewardRow reward={prem} state={dp.state} reason={dp.reason} onClaim={() => tryClaim(prem)} />
              </li>
            );
          })}
        </ol>

        {!premiumPass ? (
          <Card accentBorder>
            <CardTitle>Pase premium</CardTitle>
            <CardSub>Desbloquea toda la columna dorada: rombos, protectores y cofres.</CardSub>
            <div className="mt-4">
              <Button size="lg" fullWidth onClick={buy}>
                <Diamond size={20} weight="fill" /> Conseguir por {PASS_INFO.premiumCost} rombos
              </Button>
            </div>
            <p className="mt-2.5 text-center text-[13px] font-bold text-[var(--color-text-2)]">Sin pagos: los rombos se ganan aprendiendo.</p>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center gap-2 font-display text-[16px] font-extrabold">
              <Check size={20} weight="bold" className="text-[#16A34A]" /> Pase premium activo
            </div>
            <CardSub className="mt-1">Reclama la columna dorada con tu energía.</CardSub>
          </Card>
        )}

        <Link href="/camino" className="artop-press flex min-h-[56px] flex-col items-center justify-center rounded-[20px] bg-[var(--color-brand)] font-display text-[18px] font-extrabold text-white border-b-4 border-[var(--color-brand-deep)]">
          Seguir aprendiendo
          <span className="text-[13px] font-bold opacity-90">Gana XP, energía y PR</span>
        </Link>
      </div>
    </AppShell>
  );
}
