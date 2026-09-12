"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
interface ToastItem { id: number; title: string; body?: string; tone: ToastTone }

const ToastCtx = createContext<{ push: (t: Omit<ToastItem, "id">) => void }>({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

let seq = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = seq++;
    setItems((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-24 lg:bottom-8 left-1/2 z-[90] flex w-full max-w-[420px] -translate-x-1/2 flex-col gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "artop-rise pointer-events-auto flex items-start gap-3 rounded-[16px] border p-4 shadow-xl backdrop-blur",
              "bg-[var(--color-surface)] border-[var(--color-border)]"
            )}
          >
            <span className={cn(
              "mt-0.5",
              t.tone === "success" && "text-[#16a34a]",
              t.tone === "error" && "text-[#dc2626]",
              t.tone === "info" && "text-[#0284c7]"
            )}>
              {t.tone === "success" ? <CheckCircle size={22} weight="fill" /> : t.tone === "error" ? <WarningCircle size={22} weight="fill" /> : <Info size={22} weight="fill" />}
            </span>
            <span>
              <span className="block font-display text-[15px] font-extrabold leading-tight">{t.title}</span>
              {t.body && <span className="mt-0.5 block text-[14px] font-medium text-[var(--color-text-2)]">{t.body}</span>}
            </span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
