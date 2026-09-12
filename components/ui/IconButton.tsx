"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  size?: "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, active, size = "md", className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      ref-label={undefined}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "artop-press inline-flex items-center justify-center rounded-full border-2 shrink-0",
        size === "md" ? "size-[44px]" : "size-[52px]",
        active
          ? "bg-[var(--color-brand)] text-white border-transparent"
          : "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-artop-violet)] hover:text-[var(--color-artop-violet)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
