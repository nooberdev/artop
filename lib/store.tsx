"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { mockUser } from "@/lib/mock";
import { DEFAULT_AVATAR, type AvatarConfig } from "@/lib/avatar";

// Filosofía local-first del GDD: Course State, progreso y configuración
// viven en el dispositivo. La IA solo genera; artop recuerda.
const KEY = "artop-store-v2";

interface Persisted {
  xp: number;
  /** Rombos: moneda valiosa. Se gana aprendiendo, sin pagos. */
  gems: number;
  /** Energía: se reclama con la racha y se gasta en el pase. */
  energy: number;
  totalEnergyEarned: number;
  claimedEnergyDays: string[];
  rankPoints: number;
  premiumPass: boolean;
  claimedRewards: string[];
  streak: number;
  best: number;
  freezes: number;
  completedLessons: string[];
  owned: string[];
  equipped: string | null;
  lastStreakDate: string | null;
  avatar: AvatarConfig;
}

const DEFAULTS: Persisted = {
  xp: mockUser.xp,
  gems: mockUser.gems,
  energy: 0,
  totalEnergyEarned: 0,
  claimedEnergyDays: [],
  rankPoints: 130,
  premiumPass: false,
  claimedRewards: [],
  streak: mockUser.streak,
  best: 12,
  freezes: 2,
  completedLessons: [],
  owned: ["s3"],
  equipped: null,
  lastStreakDate: null,
  avatar: DEFAULT_AVATAR,
};

interface Store extends Persisted {
  ready: boolean;
  addXp: (n: number) => void;
  spendGems: (n: number) => boolean;
  earnGems: (n: number) => void;
  addFreezes: (n: number) => void;
  spendEnergy: (n: number) => boolean;
  /** Reclama 1 de energía por cada fecha de racha no reclamada. Devuelve cuántas. */
  claimStreakEnergy: (dates: string[]) => number;
  buyPremium: (cost: number) => boolean;
  claimReward: (id: string) => void;
  /** Marca lección como completada: XP, +1 energía, +12 PR y racha diaria. */
  completeLesson: (id: string, xp: number) => void;
  buyItem: (id: string, price: number) => boolean;
  equip: (id: string) => void;
  updateAvatar: (patch: Partial<AvatarConfig>) => void;
  setAvatar: (config: AvatarConfig) => void;
}

const Ctx = createContext<Store>({ ...DEFAULTS, ready: false, addXp: () => {}, spendGems: () => false, earnGems: () => {}, addFreezes: () => {}, spendEnergy: () => false, claimStreakEnergy: () => 0, buyPremium: () => false, claimReward: () => {}, completeLesson: () => {}, buyItem: () => false, equip: () => {}, updateAvatar: () => {}, setAvatar: () => {} });

function load(): Persisted {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    return DEFAULTS;
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // almacenamiento lleno o privado: la app sigue funcionando en memoria
    }
  }, [state, ready]);

  const addXp = useCallback((n: number) => setState((s) => ({ ...s, xp: s.xp + n })), []);
  const earnGems = useCallback((n: number) => setState((s) => ({ ...s, gems: s.gems + n })), []);
  // Espejo síncrono para decidir compras antes del re-render (los updaters son diferidos).
  const ref = useRef(state);
  ref.current = state;

  const spendGems = useCallback((n: number) => {
    if (ref.current.gems < n) return false;
    setState((s) => ({ ...s, gems: s.gems - n }));
    return true;
  }, []);

  const completeLesson = useCallback((id: string, xp: number) => {
    setState((s) => {
      if (s.completedLessons.includes(id)) return { ...s, xp: s.xp + xp, energy: s.energy + 1, totalEnergyEarned: s.totalEnergyEarned + 1, rankPoints: s.rankPoints + 12 };
      const t = today();
      const streakUp = s.lastStreakDate !== t;
      return {
        ...s,
        xp: s.xp + xp,
        energy: s.energy + 1,
        totalEnergyEarned: s.totalEnergyEarned + 1,
        rankPoints: s.rankPoints + 12,
        completedLessons: [...s.completedLessons, id],
        streak: streakUp ? s.streak + 1 : s.streak,
        best: streakUp ? Math.max(s.best, s.streak + 1) : s.best,
        lastStreakDate: t,
      };
    });
  }, []);

  const addFreezes = useCallback((n: number) => setState((s) => ({ ...s, freezes: s.freezes + n })), []);

  const spendEnergy = useCallback((n: number) => {
    if (ref.current.energy < n) return false;
    setState((s) => ({ ...s, energy: s.energy - n }));
    return true;
  }, []);

  const claimStreakEnergy = useCallback((dates: string[]) => {
    const fresh = dates.filter((d) => !ref.current.claimedEnergyDays.includes(d));
    if (fresh.length === 0) return 0;
    setState((s) => ({
      ...s,
      energy: s.energy + fresh.length,
      totalEnergyEarned: s.totalEnergyEarned + fresh.length,
      claimedEnergyDays: [...s.claimedEnergyDays, ...fresh],
    }));
    return fresh.length;
  }, []);

  const buyPremium = useCallback((cost: number) => {
    if (ref.current.premiumPass || ref.current.gems < cost) return false;
    setState((s) => ({ ...s, gems: s.gems - cost, premiumPass: true }));
    return true;
  }, []);

  const claimReward = useCallback((id: string) => {
    setState((s) => (s.claimedRewards.includes(id) ? s : { ...s, claimedRewards: [...s.claimedRewards, id] }));
  }, []);

  const buyItem = useCallback((id: string, price: number) => {
    if (ref.current.owned.includes(id) || ref.current.gems < price) return false;
    setState((s) => ({ ...s, gems: s.gems - price, owned: [...s.owned, id] }));
    return true;
  }, []);

  const equip = useCallback((id: string) => setState((s) => ({ ...s, equipped: id })), []);
  const updateAvatar = useCallback((patch: Partial<AvatarConfig>) => {
    setState((s) => ({ ...s, avatar: { ...s.avatar, ...patch } }));
  }, []);
  const setAvatar = useCallback((config: AvatarConfig) => setState((s) => ({ ...s, avatar: config })), []);

  const value = useMemo(
    () => ({ ...state, ready, addXp, earnGems, spendGems, addFreezes, spendEnergy, claimStreakEnergy, buyPremium, claimReward, completeLesson, buyItem, equip, updateAvatar, setAvatar }),
    [state, ready, addXp, earnGems, spendGems, addFreezes, spendEnergy, claimStreakEnergy, buyPremium, claimReward, completeLesson, buyItem, equip, updateAvatar, setAvatar]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  return useContext(Ctx);
}
