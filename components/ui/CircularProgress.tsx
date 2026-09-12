"use client";

import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/anim";

const STROKE: Record<string, string> = {
  brand: "var(--color-brand)",
  success: "#22c55e",
  cobalt: "#00a6ff",
  amber: "#eab308",
};

export function CircularProgress({
  value,
  size = 64,
  stroke = 7,
  label,
  tone = "brand",
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  tone?: keyof typeof STROKE;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const mounted = useMounted();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = ((mounted ? pct : 0) / 100) * c;
  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progreso circular"}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-[var(--color-surface-3)]" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={STROKE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="artop-progress-fill"
          style={{ transition: "stroke-dasharray 300ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      {label && <span className="font-display text-[13px] font-extrabold">{label}</span>}
    </div>
  );
}
