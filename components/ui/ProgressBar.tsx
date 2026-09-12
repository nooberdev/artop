"use client";

import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/anim";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "brand" | "gradient" | "success" | "cobalt";
  className?: string;
}

export function ProgressBar({ value, max = 100, label, showValue, size = "md", tone = "brand", className }: ProgressBarProps) {
  const mounted = useMounted();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === "sm" ? "h-2.5" : size === "md" ? "h-4" : "h-5";
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-[13px] font-bold">
          {label && <span className="text-[var(--color-text-2)] uppercase tracking-[0.08em]">{label}</span>}
          {showValue && <span className="text-[var(--color-text)] font-display">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progreso"}
        className={cn("w-full overflow-hidden rounded-full bg-[var(--color-surface-3)] border border-[var(--color-border)]", h)}
      >
        <div
          className={cn(
            "artop-progress-fill h-full rounded-full",
            (tone === "brand" || tone === "gradient") && "bg-[var(--color-brand)]",
            tone === "success" && "bg-[#22c55e]",
            tone === "cobalt" && "bg-[#00a6ff]"
          )}
          style={{ width: mounted ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}
