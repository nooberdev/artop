"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "dark";
export type ButtonSize = "sm" | "md" | "lg" | "xl";
export type ButtonState = "default" | "loading" | "success" | "error";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  fullWidth?: boolean;
}

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-4 text-[15px] rounded-[12px]",
  md: "min-h-[48px] px-5 text-[15px] rounded-[14px]",
  lg: "min-h-[52px] px-6 text-[16px] rounded-[16px]",
  xl: "min-h-[56px] px-7 text-[17px] rounded-[18px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "lg", state = "default", fullWidth, className, children, disabled, ...rest },
  ref
) {
  const isDisabled = disabled || state === "loading";
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-busy={state === "loading"}
      className={cn(
        "artop-press inline-flex items-center justify-center gap-2 font-display font-extrabold tracking-tight select-none",
        "border-b-4 active:border-b-0 active:translate-y-[2px]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:border-b-0",
        sizes[size],
        fullWidth && "w-full",
        variant === "primary" && "bg-[var(--color-brand)] text-white border-[var(--color-brand-deep)] hover:bg-[#b800bb] ",
        variant === "secondary" && "bg-[var(--color-surface-3)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-border)]",
        variant === "ghost" && "bg-transparent text-[var(--color-text)] border-transparent hover:bg-[var(--color-surface-3)]",
        variant === "outline" && "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] border-2 border-b-4 hover:border-[var(--color-artop-violet)]",
        variant === "dark" && "bg-[#111116] text-white border-black hover:bg-black ",
        state === "success" && "bg-[#22c55e]! text-white! border-[#15803d]!",
        state === "error" && "bg-[#ef4444]! text-white! border-[#b91c1c]!",
        className
      )}
      {...rest}
    >
      {state === "loading" && <CircleNotch size={20} weight="bold" className="animate-spin" aria-hidden />}
      <span className="leading-none">{children}</span>
    </button>
  );
});
