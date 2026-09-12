"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { primaryNav } from "./SideNav";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal móvil" className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto grid max-w-[560px] grid-cols-5 gap-1 px-2 py-2">
        {primaryNav.map((item) => {
          const active = item.href === "/camino" ? pathname === "/" || pathname.startsWith("/camino") : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-[14px] text-[11px] font-display font-extrabold tracking-tight",
                  active ? "text-[var(--color-text)]" : "text-[var(--color-text-3)]"
                )}
              >
                <span
                  key={active ? `on-${item.href}` : `off-${item.href}`}
                  className={cn(
                    "flex h-[32px] w-[56px] items-center justify-center rounded-full transition-all duration-250",
                    active ? "bg-[var(--color-brand)] text-white artop-pop-key" : "text-[var(--color-text-3)]"
                  )}
                >
                  <Icon size={22} weight={active ? "fill" : "bold"} aria-hidden />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
