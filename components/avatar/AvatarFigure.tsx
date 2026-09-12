"use client";

import { useEffect, useState } from "react";
import { diceBearOptions, type AvatarConfig } from "@/lib/avatar";
import { cn } from "@/lib/utils";

/**
 * Figura DiceBear (adventurer). El paquete (~300KB) se importa en diferido
 * para no engordar la carga inicial; mientras tanto, fondo plano del color
 * elegido para no mover el layout.
 */
export function AvatarFigure({ config, className }: { config: AvatarConfig; className?: string }) {
  const [uri, setUri] = useState<string | null>(null);
  const key = JSON.stringify(config);

  useEffect(() => {
    let live = true;
    setUri(null);
    const opts = diceBearOptions(config);
    Promise.all([import("@dicebear/core"), import("@dicebear/adventurer")]).then(
      ([{ createAvatar }, adventurer]) => {
        if (!live) return;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setUri(createAvatar(adventurer as any, opts as any).toDataUri());
        } catch {
          // se queda el fondo plano
        }
      }
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!uri) {
    return (
      <span aria-hidden className={cn("block size-full", className)} style={{ background: `#${config.bg}` }} />
    );
  }
  return (
    <img
      src={uri}
      alt="Avatar personalizado"
      draggable={false}
      className={cn("size-full object-cover", className)}
    />
  );
}
