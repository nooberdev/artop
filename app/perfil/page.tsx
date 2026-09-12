"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GearSix, Palette, Bell, Globe, Question, SignOut, CheckCircle, WarningCircle,
  MapTrifold, Flame, Ticket, Trophy, MagnifyingGlass, Package, Info,
} from "@phosphor-icons/react";
import { AppShell } from "@/components/shell/AppShell";
import {
  Card, CardTitle, CardSub, Button, IconButton, ProgressBar, Badge, Avatar,
  Tooltip, Modal, Drawer, Tabs, SegmentedControl, Divider, Skeleton, SkeletonCard,
  EmptyState, Dropdown, DropdownItem, Input, Select, Radio, Checkbox, CircularProgress, useToast,
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

function SystemGallery() {
  const { push } = useToast();
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [seg, setSeg] = useState("a");
  return (
    <div className="flex flex-col gap-4">
      <Card><CardTitle>Sistema artop - tokens vivos</CardTitle><CardSub>Botones grandes, radios de 12 a 28px, movimiento de 200 a 300ms, táctil mínimo de 44px.</CardSub>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button size="sm">Primary sm</Button><Button size="md" variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="dark">Dark</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <Button state="loading">Cargando</Button><Button state="success">Éxito</Button><Button state="error">Error</Button><Button disabled>Deshabilitado</Button>
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <IconButton label="Mi Camino"><MapTrifold size={20} weight="bold" /></IconButton>
          <IconButton label="Racha activa" active><Flame size={20} weight="fill" /></IconButton>
          <Tooltip label="Pase con tooltip"><span><IconButton label="Pase"><Ticket size={20} weight="bold" /></IconButton></span></Tooltip>
          <Dropdown label="Abrir menú" trigger={<span>Menú</span>}><DropdownItem>Ver perfil</DropdownItem><DropdownItem>Configuración</DropdownItem><DropdownItem danger>Salir</DropdownItem></Dropdown>
        </div>
      </Card>
      <Card><CardTitle>Progreso y estado</CardTitle>
        <div className="mt-4 grid gap-4">
          <ProgressBar value={68} label="Etapa actual" showValue />
          <ProgressBar value={100} tone="success" label="Completado" showValue />
          <div className="flex items-center gap-5"><CircularProgress value={72} label="Meta" /><CircularProgress value={100} size={52} label="Top" /></div>
          <div className="flex flex-wrap gap-2"><Badge tone="brand">Nuevo</Badge><Badge tone="neutral">Nivel 7</Badge><Badge tone="success"><CheckCircle size={14} weight="fill" /> Listo</Badge><Badge tone="warning">Repasar</Badge><Badge tone="danger"><WarningCircle size={14} weight="fill" /> Débil</Badge><Badge tone="info"><Info size={14} /> Dato</Badge></div>
          <div className="flex items-center gap-3"><Avatar name="Jaziel" /><Avatar name="Mara Vidal" size={40} /><Avatar name="Leo Paz" size={40} /></div>
        </div>
      </Card>
      <Card><CardTitle>Formularios</CardTitle>
        <div className="mt-4 grid gap-4">
          <Input label="Qué quieres aprender" placeholder="Japonés conversacional" hint="Una frase corta basta." />
          <Input label="Con error" defaultValue=" phyton" error="Revisa la ortografía: Python." />
          <Input label="Correcto" defaultValue="Python desde cero" success="Se entiende perfecto." />
          <Select label="Duración" options={[{ value: "s", label: "Corta - 3 etapas" }, { value: "m", label: "Media - 8 etapas" }, { value: "l", label: "Larga - 20 etapas" }]} />
          <SegmentedControl label="Vista" value={seg} onChange={setSeg} options={[{ value: "a", label: "Tarjetas" }, { value: "b", label: "Lista" }]} />
          <div className="flex flex-wrap gap-2.5">
            <Button variant="secondary" size="md" onClick={() => setModal(true)}>Abrir modal</Button>
            <Button variant="secondary" size="md" onClick={() => setDrawer(true)}>Abrir drawer</Button>
            <Button variant="ghost" size="md" onClick={() => push({ title: "Racha guardada", body: "Mañana seguimos.", tone: "info" })}>Lanzar toast</Button>
          </div>
        </div>
      </Card>
      <Card><CardTitle>Carga y vacío</CardTitle><div className="mt-4 grid gap-3"><Skeleton className="h-12" /><SkeletonCard /><EmptyState icon={<Package size={28} />} title="Nada por aquí todavía" body="Cuando generes tu primer curso con IA, aparecerá en este espacio." actionLabel="Crear curso" /></div></Card>
      <Divider label="Fin del sistema" />
      <Modal open={modal} onClose={() => setModal(false)} title="Lección desbloqueada"><p className="text-[15px] font-medium text-[var(--color-text-2)]">Completaste Bucles for. Se desbloqueó Funciones parte 1.</p><div className="mt-5"><Button fullWidth onClick={() => setModal(false)}>Seguir aprendiendo</Button></div></Modal>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Ajustes rápidos"><p className="text-[15px] font-medium text-[var(--color-text-2)]">Cambia el tema o el ritmo sin salir de tu lección.</p></Drawer>
    </div>
  );
}

function PerfilInner() {
  const params = useSearchParams();
  const { streak, gems, xp } = useStore();
  const initial = params.get("tab") === "config" ? "config" : "resumen";
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
            { id: "sistema", label: "Sistema", content: <SystemGallery /> },
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
