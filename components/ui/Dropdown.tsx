"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Dropdown({ label, trigger, children }: { label: string; trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="artop-press inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[15px] font-bold hover:border-[var(--color-artop-violet)]"
      >
        {trigger}
        <CaretDown size={16} weight="bold" className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div role="menu" aria-label={label} className="artop-rise absolute right-0 z-50 mt-2 w-[240px] rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ onClick, children, danger }: { onClick?: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex min-h-[44px] w-full items-center gap-2 rounded-[10px] px-3 text-left text-[15px] font-semibold hover:bg-[var(--color-surface-3)]",
        danger ? "text-[#dc2626]" : "text-[var(--color-text)]"
      )}
    >
      {children}
    </button>
  );
}
