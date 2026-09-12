"use client";

import { ReactNode, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
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

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={cn("artop-rise relative w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl", wide ? "max-w-[640px]" : "max-w-[480px]")}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-[22px] font-extrabold tracking-tight">{title}</h2>
          <IconButton label="Cerrar diálogo" onClick={onClose}>
            <X size={20} weight="bold" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}
