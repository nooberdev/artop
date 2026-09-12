"use client";

import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";

export function AppShell({ title, subtitle, children, aside }: { title: string; subtitle?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface-2)] text-[var(--color-text)]">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-[60] hidden w-[272px] border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:block">
        <SideNav />
      </div>
      <div className="lg:pl-[272px]">
        <TopBar title={title} subtitle={subtitle} />
        <div className="mx-auto flex w-full max-w-[1120px] items-start gap-6 px-4 sm:px-6 pb-28 lg:pb-12 pt-6">
          <main className="min-w-0 flex-1" aria-label={title}>
            <div className="mx-auto w-full max-w-[680px] xl:max-w-none">
              {children}
            </div>
          </main>
          {aside}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
