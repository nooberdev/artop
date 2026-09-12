import type { Metadata, Viewport } from "next";
// Fuentes auto-hospedadas: viven en node_modules/@fontsource, cero red.
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "artop - Aprende cualquier cosa",
  description: "Plataforma de aprendizaje generativa. Dime qué quieres aprender. Yo construyo el camino.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <StoreProvider>
            <ToastProvider>{children}</ToastProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
