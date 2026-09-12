"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  success?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, hint, error, success, id, className, ...rest }, ref) {
  const inputId = id ?? `in-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="font-display text-[14px] font-extrabold tracking-tight">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "min-h-[48px] w-full rounded-[14px] border-2 bg-[var(--color-surface)] px-4 text-[16px] font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-3)]",
          "transition-colors duration-200 hover:border-[#b9bac4]",
          !error && !success && "border-[var(--color-border)]",
          error && "border-[#ef4444] bg-[#fef2f2] dark:bg-[#2a1215]",
          success && "border-[#22c55e] bg-[#f0fdf4] dark:bg-[#0a2415]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
        {...rest}
      />
      {hint && !error && !success && (
        <p id={`${inputId}-hint`} className="text-[13px] font-medium text-[var(--color-text-3)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-err`} role="alert" className="flex items-center gap-1.5 text-[13px] font-bold text-[#dc2626]">
          <WarningCircle size={16} weight="fill" /> {error}
        </p>
      )}
      {success && (
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#16a34a]">
          <CheckCircle size={16} weight="fill" /> {success}
        </p>
      )}
    </div>
  );
});
