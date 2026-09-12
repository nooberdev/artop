"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapTrifold, Flame, Ticket, Ranking, User, GearSix, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ArtopLogo } from "./Logo";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export const primaryNav: NavItem[] = [
  { href: "/camino", label: "Mi Camino", icon: MapTrifold },
  { href: "/racha", label: "Racha", icon: Flame },
  { href: "/pase", label: "Pase", icon: Ticket },
  { href: "/clasificacion", label: "Clasificación", icon: Ranking },
  { href: "/perfil", label: "Perfil", icon: User },
];

function isActive(path: string, href: string) {
  if (href === "/camino") return path === "/" || path.startsWith("/camino");
  return path.startsWith(href);
}

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="flex h-full flex-col gap-2">
      <div className="px-2 pb-4 pt-1">
        <ArtopLogo />
      </div>
      <ul className="flex flex-col gap-1.5">
        {primaryNav.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "artop-press group relative flex min-h-[56px] items-center gap-3.5 rounded-[16px] border-2 px-4 text-[16px] font-display font-extrabold tracking-tight",
                  active
                    ? "bg-[var(--color-brand-tint)] text-[var(--color-brand-ink)] border-[var(--color-brand)]"
                    : "border-transparent text-[var(--color-text-2)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]"
                )}
              >
                <span key={active ? `on-${item.href}` : `off-${item.href}`} className={cn("inline-flex shrink-0", active && "artop-pop-key")}>
                  <Icon size={24} weight={active ? "fill" : "bold"} aria-hidden />
                </span>
                {item.label}
                {active && (
                  <span aria-hidden className="absolute -left-[18px] h-9 w-1.5 rounded-full bg-[var(--color-brand)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border-t border-[var(--color-border)] pt-4">
        <p className="px-4 pb-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--color-text-3)]">Ajustes</p>
        <Link
          href="/perfil?tab=config"
          className={cn(
            "artop-press flex min-h-[52px] items-center gap-3.5 rounded-[16px] border-2 border-transparent px-4 text-[15px] font-display font-bold",
            pathname.includes("config")
              ? "bg-[var(--color-surface-3)] text-[var(--color-text)] border-[var(--color-border)]"
              : "text-[var(--color-text-2)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
          )}
        >
          <GearSix size={22} weight="bold" aria-hidden />
          Configuración
        </Link>
      </div>
      <div className="mt-auto px-2">
        <div className="rounded-[20px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="font-display text-[15px] font-extrabold leading-tight">Crea tu curso con IA</p>
          <p className="mt-1 text-[13px] font-medium leading-snug text-[var(--color-text-2)]">Dime qué quieres aprender. Yo construyo el camino.</p>
          <span className="mt-3 flex min-h-[44px] items-center justify-center gap-1.5 rounded-[12px] bg-[var(--color-brand)] text-[14px] font-display font-extrabold text-white">
            <Plus size={16} weight="bold" /> Nuevo curso
          </span>
        </div>
      </div>
    </nav>
  );
}
