"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, hint, error, options, id, className, ...rest }, ref) {
  const selectId = id ?? `sel-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="font-display text-[14px] font-extrabold tracking-tight">
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        className={cn(
          "min-h-[48px] w-full appearance-none rounded-[14px] border-2 bg-[var(--color-surface)] px-4 pr-10 text-[16px] font-medium",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22m4%206%204%204%204-4%22%20stroke%3D%22%23777%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat",
          error ? "border-[#ef4444]" : "border-[var(--color-border)] hover:border-[#b9bac4]",
          "disabled:opacity-60",
          className
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-[13px] font-medium text-[var(--color-text-3)]">{hint}</p>}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-[13px] font-bold text-[#dc2626]">
          <WarningCircle size={16} weight="fill" /> {error}
        </p>
      )}
    </div>
  );
});
