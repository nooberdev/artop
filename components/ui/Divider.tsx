import { cn } from "@/lib/utils";

export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) return <hr className={cn("border-t border-[var(--color-border)]", className)} />;
  return (
    <div className={cn("flex items-center gap-3", className)} role="separator">
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--color-text-3)]">{label}</span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}
