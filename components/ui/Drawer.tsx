"use client";

import { ReactNode, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-[80]", !open && "pointer-events-none")} aria-hidden={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/60 transition-opacity duration-250", open ? "opacity-100" : "opacity-0")} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-[420px] bg-[var(--color-surface)] border-l border-[var(--color-border)] p-6 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-[20px] font-extrabold tracking-tight">{title}</h2>
          <IconButton label="Cerrar panel" onClick={onClose}>
            <X size={20} weight="bold" />
          </IconButton>
        </div>
        {children}
      </aside>
    </div>
  );
}
