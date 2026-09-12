import { ReactNode } from "react";
import { Button } from "./Button";

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
      <div className="mb-4 flex size-[56px] items-center justify-center rounded-[20px] bg-[var(--color-surface-3)] text-[var(--color-text-2)]">{icon}</div>
      <h3 className="font-display text-[20px] font-extrabold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-[36ch] text-[15px] font-medium leading-relaxed text-[var(--color-text-2)]">{body}</p>
      {actionLabel && (
        <div className="mt-6">
          <Button variant="secondary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
