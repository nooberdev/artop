"use client";

import { Flame, Lightning, Diamond, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { mockUser } from "@/lib/mock";
import { Avatar, IconButton, Tooltip } from "@/components/ui";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { theme, toggle } = useTheme();
  const { streak, xp, gems, energy } = useStore();
  return (
    <header className="sticky top-0 z-[50] border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/85 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[1120px] items-center gap-2.5 px-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[20px] sm:text-[22px] font-extrabold tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-[13px] font-medium text-[var(--color-text-2)]">{subtitle}</p>}
        </div>
        <Tooltip label={`Racha de ${streak} días`}>
          <span className="hidden xsm:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-[14px] font-display font-extrabold min-h-[44px]">
            <Flame size={20} weight="fill" className="text-[#ff6b00]" aria-hidden />
            {streak}
          </span>
        </Tooltip>
        <Tooltip label={`${xp} XP`}>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-[14px] font-display font-extrabold min-h-[44px]">
            <Lightning size={20} weight="fill" className="text-[#00A6FF]" aria-hidden />
            {xp}
          </span>
        </Tooltip>
        <Tooltip label={`${gems} rombos`}>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-[14px] font-display font-extrabold min-h-[44px]">
            <Diamond size={20} weight="fill" className="text-[#00A6FF]" aria-hidden />
            {gems}
          </span>
        </Tooltip>
        <Tooltip label={`${energy} de energía`}>
          <span className="hidden mdl:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-[14px] font-display font-extrabold min-h-[44px]">
            <Lightning size={20} weight="fill" className="text-[#EAB308]" aria-hidden />
            {energy}
          </span>
        </Tooltip>
        <Tooltip label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}>
          <IconButton label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"} onClick={toggle}>
            {theme === "light" ? <Moon size={20} weight="bold" /> : <Sun size={20} weight="bold" />}
          </IconButton>
        </Tooltip>
        <Avatar name={mockUser.name} size={44} />
      </div>
    </header>
  );
}
