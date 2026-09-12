"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-flow-col gap-1 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-3)] p-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "artop-press min-h-[44px] rounded-[12px] px-4 text-[14px] font-display font-extrabold",
            value === o.value ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow border border-[var(--color-border)]" : "text-[var(--color-text-3)] hover:text-[var(--color-text)]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
