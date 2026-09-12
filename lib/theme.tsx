"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "artop-theme";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void; set: (t: Theme) => void }>({
  theme: "light",
  toggle: () => {},
  set: () => {},
});

function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyDom(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Arranca alineado con el DOM si el boot script ya corrió (evita icono/theme desfasados).
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    const initial = readTheme();
    setTheme(initial);
    applyDom(initial);
  }, []);

  const set = useCallback((t: Theme) => {
    setTheme(t);
    applyDom(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* private mode */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyDom(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  return <ThemeCtx.Provider value={{ theme, toggle, set }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
