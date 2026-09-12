import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "gradient" | "neutral" | "success" | "warning" | "danger" | "info";

export function Badge({ tone = "neutral", className, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold font-display tracking-tight border min-h-[28px]",
        (tone === "brand" || tone === "gradient") && "bg-[var(--color-brand)] text-white border-transparent",
        tone === "neutral" && "bg-[var(--color-surface-3)] text-[var(--color-text)] border-[var(--color-border)]",
        tone === "success" && "bg-[#dcfce7] text-[#15803d] border-[#86efac] ",
        tone === "warning" && "bg-[#fef3c7] text-[#92400e] border-[#fcd34d] ",
        tone === "danger" && "bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5] ",
        tone === "info" && "bg-[#e0f2fe] text-[#0369a1] border-[#7dd3fc] ",
        className
      )}
      {...rest}
    />
  );
}
