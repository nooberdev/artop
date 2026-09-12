"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[10px] bg-[#111116] px-3 py-2 text-[13px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 "
      >
        {label}
      </span>
    </span>
  );
}
