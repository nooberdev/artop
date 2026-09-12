import { cn } from "@/lib/utils";

export function Skeleton({ className, label = "Cargando" }: { className?: string; label?: string }) {
  return <div role="status" aria-label={label} className={cn("artop-shimmer rounded-[12px] bg-[var(--color-surface-3)] border border-[var(--color-border)] min-h-[20px]", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-3">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-12 w-full rounded-[14px]" />
    </div>
  );
}
