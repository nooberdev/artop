"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Radio = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }>(function Radio(
  { label, hint, id, className, ...rest },
  ref
) {
  const rid = id ?? `radio-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label htmlFor={rid} className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:border-[var(--color-artop-violet)] has-checked:border-[var(--color-artop-violet)] has-checked:bg-[#7000ff0d]">
      <input ref={ref} id={rid} type="radio" className="mt-1 size-[22px] shrink-0 cursor-pointer accent-[#7000FF]" {...rest} />
      <span>
        <span className="block font-display text-[15px] font-extrabold leading-tight">{label}</span>
        {hint && <span className="mt-0.5 block text-[14px] font-medium text-[var(--color-text-2)]">{hint}</span>}
      </span>
    </label>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }>(function Checkbox(
  { label, hint, id, className, ...rest },
  ref
) {
  const cid = id ?? `check-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label htmlFor={cid} className={cn("flex min-h-[48px] cursor-pointer items-start gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:border-[var(--color-artop-violet)] has-checked:border-[var(--color-artop-violet)]", className)}>
      <input ref={ref} id={cid} type="checkbox" className="mt-1 size-[22px] shrink-0 cursor-pointer accent-[#FF007F]" {...rest} />
      <span>
        <span className="block font-display text-[15px] font-extrabold leading-tight">{label}</span>
        {hint && <span className="mt-0.5 block text-[14px] font-medium text-[var(--color-text-2)]">{hint}</span>}
      </span>
    </label>
  );
});
