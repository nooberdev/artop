"use client";

import Link from "next/link";
import { ArrowLeft, Shuffle, Check } from "@phosphor-icons/react";
import { AppShell } from "@/components/shell/AppShell";
import { AvatarFigure } from "@/components/avatar";
import { Button, Card, CardTitle } from "@/components/ui";
import { useStore } from "@/lib/store";
import {
  AVATAR_BGS, BROWS, EYES, GLASSES, HAIRS, HAIR_COLORS, MOUTHS, SKINS,
  randomAvatar, type AvatarConfig,
} from "@/lib/avatar";
import { cn } from "@/lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardTitle className="text-[16px]!">{title}</CardTitle>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </Card>
  );
}

function Pick({ selected, onClick, label, children }: { selected: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={cn(
        "artop-press flex min-h-[52px] min-w-[52px] items-center justify-center gap-1.5 rounded-[14px] border-2 px-3 font-display text-[14px] font-extrabold",
        selected
          ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)] text-[var(--color-brand-ink)]"
          : "border-[var(--color-border)] text-[var(--color-text-2)] hover:text-[var(--color-text)]"
      )}
    >
      {children}
    </button>
  );
}

function Swatch({ color, on }: { color: string; on: boolean }) {
  return (
    <>
      <span className="size-6 rounded-full" style={{ background: color }} aria-hidden />
      {on && <Check size={16} weight="bold" aria-hidden />}
    </>
  );
}

export default function AvataresPage() {
  const { avatar, updateAvatar, setAvatar } = useStore();

  function set<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) {
    updateAvatar({ [key]: value } as Partial<AvatarConfig>);
  }

  return (
    <AppShell title="Mi avatar" subtitle="Hecho con DiceBear · se guarda en tu dispositivo">
      <div className="flex flex-col gap-4">
        <Card className="artop-rise flex flex-col items-center py-8">
          <span className="block size-[128px] overflow-hidden rounded-[32px] border-4 border-[var(--color-border)]" key={JSON.stringify(avatar)}>
            <AvatarFigure config={avatar} />
          </span>
          <div className="mt-5 grid w-full gap-2.5">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setAvatar(randomAvatar())}
            >
              <Shuffle size={20} weight="bold" /> Aleatorio
            </Button>
          </div>
        </Card>

        <Section title="Piel">
          {SKINS.map((s) => (
            <Pick key={s.id} label={`Piel ${s.label}`} selected={avatar.skin === s.id} onClick={() => set("skin", s.id)}>
              <Swatch color={`#${s.id}`} on={avatar.skin === s.id} />
            </Pick>
          ))}
        </Section>

        <Section title="Pelo">
          {HAIRS.map((h) => (
            <Pick key={h.id} label={`Pelo ${h.label}`} selected={avatar.hair === h.id} onClick={() => set("hair", h.id)}>
              {h.label}
            </Pick>
          ))}
        </Section>

        <Section title="Color de pelo">
          {HAIR_COLORS.map((c) => (
            <Pick key={c.id} label={`Pelo ${c.label}`} selected={avatar.hairColor === c.id} onClick={() => set("hairColor", c.id)}>
              <Swatch color={`#${c.id}`} on={avatar.hairColor === c.id} />
            </Pick>
          ))}
        </Section>

        <Section title="Ojos">
          {EYES.map((e) => (
            <Pick key={e.id} label={`Ojos ${e.label}`} selected={avatar.eyes === e.id} onClick={() => set("eyes", e.id)}>
              {e.label}
            </Pick>
          ))}
        </Section>

        <Section title="Cejas">
          {BROWS.map((b) => (
            <Pick key={b.id} label={`Cejas ${b.label}`} selected={avatar.brows === b.id} onClick={() => set("brows", b.id)}>
              {b.label}
            </Pick>
          ))}
        </Section>

        <Section title="Boca">
          {MOUTHS.map((m) => (
            <Pick key={m.id} label={`Boca ${m.label}`} selected={avatar.mouth === m.id} onClick={() => set("mouth", m.id)}>
              {m.label}
            </Pick>
          ))}
        </Section>

        <Section title="Gafas">
          {GLASSES.map((g) => (
            <Pick key={g.id} label={g.id === "nada" ? "Sin gafas" : `Gafas ${g.label}`} selected={avatar.glasses === g.id} onClick={() => set("glasses", g.id)}>
              {g.label}
            </Pick>
          ))}
        </Section>

        <Section title="Fondo">
          {AVATAR_BGS.map((b) => (
            <Pick key={b.id} label={`Fondo ${b.label}`} selected={avatar.bg === b.id} onClick={() => set("bg", b.id)}>
              <Swatch color={`#${b.id}`} on={avatar.bg === b.id} />
            </Pick>
          ))}
        </Section>

        <Link href="/perfil" className="artop-press flex min-h-[56px] items-center justify-center gap-2 rounded-[16px] bg-[var(--color-brand)] font-display text-[16px] font-extrabold text-white border-b-4 border-[var(--color-brand-deep)]">
          <ArrowLeft size={20} weight="bold" /> Volver al perfil
        </Link>
      </div>
    </AppShell>
  );
}
