"use client";

import { AvatarFigure } from "@/components/avatar";
import type { AvatarConfig } from "@/lib/avatar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: number;
  config?: AvatarConfig;
  className?: string;
}

/** Avatar customizable del usuario. Sin config usa la guardada en el store. */
export function Avatar({ name, size = 48, config, className }: AvatarProps) {
  const { avatar } = useStore();
  return (
    <span
      role="img"
      aria-label={`Avatar de ${name}`}
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white dark:border-white/15 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <AvatarFigure config={config ?? avatar} />
    </span>
  );
}
