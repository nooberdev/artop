// Mocks de Racha (energía), Pase de batalla y Clasificación ranked.
// Todo local hasta conectar backend. Sin pagos: los rombos se ganan aprendiendo.
export const rachaInfo = {
  days: 6,
  best: 12,
  totalXp: 1240,
  freezes: 2,
};

/* ---------- Clasificación: ranked solo, sin rivales ---------- */

export interface Rank {
  name: string;
  min: number;
  color: string;
}

export const RANKS: Rank[] = [
  { name: "Bronce", min: 0, color: "#CD7F32" },
  { name: "Plata", min: 100, color: "#AFAFAF" },
  { name: "Oro", min: 250, color: "#EAB308" },
  { name: "Platino", min: 450, color: "#00A6FF" },
  { name: "Diamante", min: 700, color: "#B388FF" },
  { name: "Élite", min: 1000, color: "#FF007F" },
  { name: "Campeón", min: 1400, color: "#FF9600" },
];

export function getRank(points: number): { rank: Rank; index: number; next: Rank | null; progress: number; missing: number } {
  let index = 0;
  RANKS.forEach((r, i) => {
    if (points >= r.min) index = i;
  });
  const rank = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const progress = next ? Math.min(100, ((points - rank.min) / (next.min - rank.min)) * 100) : 100;
  return { rank, index, next, progress, missing: next ? next.min - points : 0 };
}

/* ---------- Pase de batalla: Temporada 1, Episodio 0 ---------- */

export const PASS_INFO = {
  season: "Temporada 1",
  episode: "Episodio 0",
  premiumCost: 10,
  claimCost: 1,
};

export type RewardKind = "xp" | "rombos" | "freeze" | "bundle";

export interface PassReward {
  id: string;
  tier: number;
  track: "free" | "premium";
  kind: RewardKind;
  label: string;
  amount: string;
  xp?: number;
  rombos?: number;
  freezes?: number;
}

/** Energía total ganada necesaria para desbloquear cada tier. */
export const TIER_UNLOCK = [0, 2, 4, 6, 9, 12, 15, 18];
export const TIER_COUNT = 8;

export const PASS_REWARDS: PassReward[] = [
  { id: "t1-free", tier: 1, track: "free", kind: "freeze", label: "Protector", amount: "+1", freezes: 1 },
  { id: "t1-premium", tier: 1, track: "premium", kind: "rombos", label: "Rombos", amount: "+5", rombos: 5 },
  { id: "t2-free", tier: 2, track: "free", kind: "xp", label: "XP", amount: "+50", xp: 50 },
  { id: "t2-premium", tier: 2, track: "premium", kind: "bundle", label: "Cofre", amount: "+100", xp: 100, rombos: 3 },
  { id: "t3-free", tier: 3, track: "free", kind: "rombos", label: "Rombos", amount: "+3", rombos: 3 },
  { id: "t3-premium", tier: 3, track: "premium", kind: "freeze", label: "Protectores", amount: "+2", freezes: 2 },
  { id: "t4-free", tier: 4, track: "free", kind: "xp", label: "XP", amount: "+100", xp: 100 },
  { id: "t4-premium", tier: 4, track: "premium", kind: "rombos", label: "Rombos", amount: "+10", rombos: 10 },
  { id: "t5-free", tier: 5, track: "free", kind: "freeze", label: "Protectores", amount: "+2", freezes: 2 },
  { id: "t5-premium", tier: 5, track: "premium", kind: "bundle", label: "Cofre", amount: "+150", xp: 150, rombos: 5 },
  { id: "t6-free", tier: 6, track: "free", kind: "rombos", label: "Rombos", amount: "+8", rombos: 8 },
  { id: "t6-premium", tier: 6, track: "premium", kind: "xp", label: "XP", amount: "+200", xp: 200 },
  { id: "t7-free", tier: 7, track: "free", kind: "xp", label: "XP", amount: "+150", xp: 150 },
  { id: "t7-premium", tier: 7, track: "premium", kind: "freeze", label: "Protectores", amount: "+3", freezes: 3 },
  { id: "t8-free", tier: 8, track: "free", kind: "rombos", label: "Rombos", amount: "+15", rombos: 15 },
  { id: "t8-premium", tier: 8, track: "premium", kind: "bundle", label: "Gran cofre", amount: "+300", xp: 300, rombos: 10 },
];

export function currentTier(totalEarned: number): number {
  let tier = 1;
  TIER_UNLOCK.forEach((min, i) => {
    if (totalEarned >= min) tier = i + 1;
  });
  return tier;
}
