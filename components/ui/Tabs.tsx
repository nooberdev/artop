"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ items, defaultId }: { items: TabItem[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  return (
    <div>
      <div role="tablist" aria-label="Pestañas" className="flex gap-2 overflow-x-auto rounded-[16px] bg-[var(--color-surface-3)] border border-[var(--color-border)] p-1.5">
        {items.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={cn(
                "artop-press min-h-[44px] flex-1 whitespace-nowrap rounded-[12px] px-4 text-[15px] font-display font-extrabold",
                isActive ? "bg-[var(--color-brand)] text-white shadow" : "text-[var(--color-text-2)] hover:text-[var(--color-text)]"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-4">
        {items.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
