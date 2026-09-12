"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GearSix, Bell, Globe, Question, SignOut,
  Flame, Trophy, MagnifyingGlass,
} from "@phosphor-icons/react";
import { AppShell } from "@/components/shell/AppShell";
import {
  Card, CardTitle, CardSub, Button, ProgressBar, Badge, Avatar,
  Tabs, SegmentedControl, Select, Radio, Checkbox, useToast,
} from "@/components/ui";
import { mockUser } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

function ConfigPanel() {
  const { theme, set } = useTheme();
  const { push } = useToast();
  const [level, setLevel] = useState("intermedio");
  const [lang, setLang] = useState("es");
  const [diff, setDiff] = useState("suave");
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Apariencia</CardTitle>
        <CardSub>Elige cómo se ve artop. Lo guardamos en tu dispositivo.</CardSub>
        <div className="mt-4"><SegmentedControl label="Tema" value={theme} onChange={(v) => set(v as "light" | "dark")} options={[{ value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }]} /></div>
      </Card>
      <Card>
        <CardTitle>Aprendizaje</CardTitle>
        <div className="mt-4 grid gap-4">
          <Select label="Nivel por defecto" value={level} onChange={(e) => setLevel(e.target.value)} options={[{ value: "principiante", label: "Principiante" }, { value: "intermedio", label: "Intermedio" }, { value: "avanzado", label: "Avanzado" }]} />
          <Select label="Idioma" value={lang} onChange={(e) => setLang(e.target.value)} options={[{ value: "es", label: "Español" }, { value: "en", label: "English" }]} />
          <div className="grid gap-2.5">
            <Radio name="diff" label="Ritmo suave" hint="Sesiones cortas, mucho refuerzo" checked={diff === "suave"} onChange={() => setDiff("suave")} />
            <Radio name="diff" label="Ritmo intenso" hint="Más conceptos nuevos por lección" checked={diff === "intenso"} onChange={() => setDiff("intenso")} />
          </div>
          <div className="grid gap-2.5">
            <Checkbox label="Recordarme practicar" hint="Notificación diaria amable" defaultChecked />
            <Checkbox label="Incluir audio cuando ayude" hint="Idiomas y pronunciación" />
          </div>
          <Button size="md" fullWidth onClick={() => push({ title: "Ajustes guardados", body: "Tu forma de aprender quedó lista.", tone: "success" })}>Guardar cambios</Button>
        </div>
      </Card>
      <Card>
        <CardTitle>Cuenta</CardTitle>
        <div className="mt-3 grid gap-1">
          {[
            { icon: Bell, label: "Notificaciones" },
            { icon: Globe, label: "Idioma y región" },
            { icon: Question, label: "Ayuda" },
            { icon: SignOut, label: "Cerrar sesión", danger: true },
          ].map((r) => (
            <button key={r.label} className="artop-press flex min-h-[52px] items-center gap-3 rounded-[12px] px-3 text-left font-display text-[15px] font-bold hover:bg-[var(--color-surface-3)]">
              <r.icon size={20} weight="bold" className={r.danger ? "text-[#dc2626]" : ""} /> <span className={r.danger ? "text-[#dc2626]" : ""}>{r.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PerfilInner() {
  const params = useSearchParams();
  const { streak, gems, xp } = useStore();
  const tab = params.get("tab");
  const initial = tab === "config" ? "config" : "resumen";
  return (
    <AppShell title="Tu perfil" subtitle={`${mockUser.handle} - Nivel ${mockUser.level}`}>
      <div className="flex flex-col gap-4">
        <Card accentBorder>
          <div className="flex items-center gap-4">
            <Avatar name={mockUser.name} size={64} />
            <div>
              <CardTitle className="text-[22px]!">{mockUser.name}</CardTitle>
              <CardSub>{mockUser.handle}</CardSub>
              <div className="mt-2 flex flex-wrap gap-2"><Badge tone="brand">Nivel {mockUser.level}</Badge><Badge tone="neutral">🔥 {streak} días</Badge><Badge tone="neutral">◆ {gems} rombos</Badge></div>
              <Link href="/avatares" className="artop-press mt-3 inline-flex min-h-[48px] items-center justify-center rounded-[14px] bg-[var(--color-surface-3)] border border-[var(--color-border)] px-5 font-display text-[14px] font-extrabold hover:border-[var(--color-brand)]">
                Editar avatar
              </Link>
            </div>
          </div>
          <div className="mt-4"><ProgressBar value={xp} max={mockUser.xpGoal} label="Camino al nivel 8" showValue /></div>
        </Card>
        <Tabs
          key={initial}
          defaultId={initial}
          items={[
            { id: "resumen", label: "Resumen", content: (
              <div className="grid gap-3">
                <Card><div className="flex items-center gap-2 font-display font-extrabold"><GearSix size={18} /> Logros recientes</div><CardSub className="mt-1">5 de 5 en Variables - Racha de 6 días - Etapa 1 completa.</CardSub></Card>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/racha" className="artop-press flex min-h-[56px] items-center justify-center gap-2 rounded-[16px] bg-[var(--color-surface-3)] border border-[var(--color-border)] font-display text-[15px] font-extrabold hover:border-[var(--color-brand)]">
                    <Flame size={20} weight="fill" className="text-[#FF9600]" /> Mi racha
                  </Link>
                  <Link href="/clasificacion" className="artop-press flex min-h-[56px] items-center justify-center gap-2 rounded-[16px] bg-[var(--color-surface-3)] border border-[var(--color-border)] font-display text-[15px] font-extrabold hover:border-[var(--color-brand)]">
                    <Trophy size={20} weight="fill" className="text-[#FFC800]" /> Clasificación
                  </Link>
                </div>
                <Card><Button variant="secondary" size="md" fullWidth><MagnifyingGlass size={18} /> Buscar en mi actividad</Button></Card>
              </div>
            )},
            { id: "config", label: "Configuración", content: <ConfigPanel /> },
          ]}
        />
      </div>
    </AppShell>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando perfil...</div>}>
      <PerfilInner />
    </Suspense>
  );
}
