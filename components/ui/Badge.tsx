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
        tone === "success" && "bg-[#dcfce7] text-[#15803d] border-[#86efac] dark:bg-[#052e16] dark:text-[#86efac] dark:border-[#14532d]",
        tone === "warning" && "bg-[#fef3c7] text-[#92400e] border-[#fcd34d] dark:bg-[#451a03] dark:text-[#fcd34d] dark:border-[#92400e]",
        tone === "danger" && "bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5] dark:bg-[#450a0a] dark:text-[#fca5a5] dark:border-[#7f1d1d]",
        tone === "info" && "bg-[#e0f2fe] text-[#0369a1] border-[#7dd3fc] dark:bg-[#082f49] dark:text-[#7dd3fc] dark:border-[#0c4a6e]",
        className
      )}
      {...rest}
    />
  );
}
