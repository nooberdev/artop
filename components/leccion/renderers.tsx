"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Microphone, SpeakerHigh } from "@phosphor-icons/react";
import type {
  ChoiceStep, CompleteStep, DictateStep, ListenStep, MatchStep, OrderStep,
  RecallStep, SpeakStep, SpotStep, Step, TfStep, WriteStep,
} from "@/lib/lessons";
import { cn } from "@/lib/utils";

export function OptionButton({ selected, onClick, children, disabled }: { selected: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "artop-press min-h-[56px] w-full rounded-[14px] border-2 border-b-4 px-4 text-left text-[16px] font-bold",
        selected
          ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)] text-[var(--color-text)]"
          : "bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-3)]",
        disabled && !selected && "opacity-70"
      )}
    >
      {children}
    </button>
  );
}

/** Reproductor Piper: normal + despacio (tortuga Duolingo). Intenta auto-sonar al montar. */
export function AudioButton({ src, label = "Escuchar" }: { src: string; label?: string }) {
  const play = (rate: number) => {
    try {
      const a = new Audio(src);
      a.playbackRate = rate;
      void a.play().catch(() => {});
    } catch {
      // sin audio en este dispositivo: el texto siempre acompaña
    }
  };

  useEffect(() => {
    play(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => play(1)}
        aria-label={`${label}: reproducir`}
        className="artop-press flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-[16px] bg-[var(--color-brand)] font-display text-[16px] font-extrabold text-white border-b-4 border-[var(--color-brand-deep)]"
      >
        <SpeakerHigh size={26} weight="fill" aria-hidden /> Escuchar
      </button>
      <button
        onClick={() => play(0.6)}
        aria-label="Reproducir despacio"
        className="artop-press flex min-h-[64px] min-w-[64px] items-center justify-center rounded-[16px] bg-[var(--color-surface-3)] border-2 border-[var(--color-border)] font-display text-[13px] font-extrabold text-[var(--color-text-2)]"
      >
        Lento
      </button>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface StepProps {
  sel: unknown;
  setSel: (v: unknown) => void;
  checked: boolean;
  onCheck: () => void;
  onSkip: () => void;
}

export function ChoiceRenderer({ ex, sel, setSel, checked }: { ex: ChoiceStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  return (
    <div className="grid gap-2.5">
      {ex.options.map((o, i) => (
        <OptionButton key={o} selected={sel === i} disabled={checked} onClick={() => setSel(i)}>{o}</OptionButton>
      ))}
    </div>
  );
}

export function TfRenderer({ ex: _ex, sel, setSel, checked }: { ex: TfStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  void _ex;
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {([true, false] as const).map((v) => (
        <OptionButton key={String(v)} selected={sel === v} disabled={checked} onClick={() => setSel(v)}>
          <span className="block text-center text-[18px] font-display font-extrabold">{v ? "Verdadero" : "Falso"}</span>
        </OptionButton>
      ))}
    </div>
  );
}

export function CompleteRenderer({ ex, sel, setSel, checked }: { ex: CompleteStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  return (
    <div>
      <p className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-[17px]" dir="ltr">
        {ex.pre} <span className="rounded-[8px] bg-[var(--color-brand-tint)] px-3 py-1 text-[var(--color-brand-ink)]">{(sel as string) ?? "···"}</span> {ex.post}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ex.options.map((o) => (
          <button
            key={o}
            onClick={() => setSel(o)}
            disabled={checked}
            aria-pressed={sel === o}
            className={cn(
              "artop-press min-h-[48px] rounded-[12px] border-2 border-b-4 px-5 font-mono text-[16px] font-bold",
              sel === o ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)]" : "bg-[var(--color-surface)] border-[var(--color-border)]"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OrderRenderer({ ex, sel, setSel, checked }: { ex: OrderStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  const shown = useMemo(() => shuffle(ex.tokens), [ex]);
  const picked = (Array.isArray(sel) ? (sel as string[]) : []) as string[];
  return (
    <div>
      <p className="min-h-[56px] rounded-[14px] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-[15px]" dir="ltr">
        {picked.length > 0 ? picked.join(" ") : <span className="text-[var(--color-text-3)]">Toca las piezas en orden…</span>}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {shown.map((t, i) => {
          const usedCount = picked.filter((x) => x === t).length;
          const totalCount = shown.slice(0, i + 1).filter((x) => x === t).length;
          const used = usedCount >= totalCount;
          return (
            <button
              key={`${t}-${i}`}
              disabled={checked || used}
              onClick={() => setSel([...picked, t])}
              className={cn(
                "artop-press min-h-[48px] rounded-[12px] border-2 border-b-4 px-4 font-mono text-[15px] font-bold",
                used ? "opacity-30 bg-[var(--color-surface-3)] border-[var(--color-border)]" : "bg-[var(--color-surface)] border-[var(--color-border)]"
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
      {!checked && picked.length > 0 && (
        <button onClick={() => setSel([])} className="mt-2 text-[14px] font-bold text-[var(--color-text-3)] underline">Borrar</button>
      )}
    </div>
  );
}

export function MatchRenderer({ ex, sel, setSel, checked }: { ex: MatchStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  const lefts = useMemo(() => ex.pairs.map(([l]) => l), [ex]);
  const rights = useMemo(() => shuffle(ex.pairs.map(([, r]) => r)), [ex]);
  const [first, setFirst] = useState<{ side: "l" | "r"; value: string } | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    setFirst(null);
    setWrong(null);
  }, [ex]);

  const locked = (typeof sel === "object" && sel !== null && !Array.isArray(sel) ? sel as Record<string, string> : {}) as Record<string, string>;
  const doneCount = Object.keys(locked).length;

  function tap(side: "l" | "r", value: string) {
    if (checked) return;
    const lockedLeft = side === "l" ? locked[value] !== undefined : Object.entries(locked).some(([, r]) => r === value);
    if (lockedLeft) return;
    if (!first) {
      setFirst({ side, value });
      return;
    }
    if (first.side === side) {
      setFirst(first.value === value ? null : { side, value });
      return;
    }
    const l = side === "l" ? value : first.value;
    const r = side === "r" ? value : first.value;
    const okPair = ex.pairs.some(([pl, pr]) => pl === l && pr === r);
    if (okPair) {
      setSel({ ...locked, [l]: r });
      setFirst(null);
    } else {
      setWrong(`${l}|${r}`);
      setFirst(null);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setWrong(null), 600);
    }
  }

  const chip = (side: "l" | "r", value: string) => {
    const isLocked = side === "l" ? locked[value] !== undefined : Object.values(locked).includes(value);
    const isFirst = first?.side === side && first.value === value;
    const isWrong = wrong !== null && (side === "l" ? wrong.startsWith(`${value}|`) : wrong.endsWith(`|${value}`));
    return (
      <button
        key={`${side}-${value}`}
        disabled={checked || isLocked}
        onClick={() => tap(side, value)}
        aria-pressed={isFirst}
        className={cn(
          "artop-press min-h-[52px] w-full rounded-[12px] border-2 border-b-4 px-3 text-[15px] font-bold",
          isLocked
            ? "bg-[#DCFCE7] border-[#86EFAC] text-[#15803D] dark:bg-[#052E16] dark:text-[#86EFAC] dark:border-[#14532d]"
            : isWrong
              ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]"
              : isFirst
                ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)]"
                : "bg-[var(--color-surface)] border-[var(--color-border)]"
        )}
      >
        {value}
      </button>
    );
  };

  return (
    <div>
      <p className="mb-3 text-[14px] font-bold text-[var(--color-text-2)]">{doneCount} / {ex.pairs.length} pares · toca dos para unirlos</p>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="grid gap-2.5">{lefts.map((l) => chip("l", l))}</div>
        <div className="grid gap-2.5">{rights.map((r) => chip("r", r))}</div>
      </div>
    </div>
  );
}

export function WriteRenderer({ ex, sel, setSel, checked, onCheck }: { ex: WriteStep } & StepProps) {
  return (
    <div>
      {ex.hint && <p className="mb-3 text-[14px] font-bold text-[var(--color-text-2)]">Pista: {ex.hint}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCheck();
        }}
      >
        <input
          value={(sel as string) ?? ""}
          onChange={(e) => setSel(e.target.value)}
          disabled={checked}
          placeholder="Escribe tu respuesta…"
          aria-label="Tu respuesta"
          autoCapitalize="off"
          autoCorrect="off"
          className="min-h-[56px] w-full rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[17px] font-bold focus:border-[var(--color-brand)] focus:outline-none disabled:opacity-70"
        />
      </form>
    </div>
  );
}

export function ListenRenderer({ ex, sel, setSel, checked }: { ex: ListenStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  return (
    <div className="flex flex-col gap-4">
      <AudioButton src={ex.audio} />
      <div className="grid gap-2.5">
        {ex.options.map((o, i) => (
          <OptionButton key={o} selected={sel === i} disabled={checked} onClick={() => setSel(i)}>{o}</OptionButton>
        ))}
      </div>
    </div>
  );
}

export function DictateRenderer({ ex, sel, setSel, checked, onCheck }: { ex: DictateStep } & StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <AudioButton src={ex.audio} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCheck();
        }}
      >
        <input
          value={(sel as string) ?? ""}
          onChange={(e) => setSel(e.target.value)}
          disabled={checked}
          placeholder="Escribe lo que escuchas…"
          aria-label="Transcripción"
          autoCapitalize="off"
          autoCorrect="off"
          className="min-h-[56px] w-full rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[17px] font-bold focus:border-[var(--color-brand)] focus:outline-none disabled:opacity-70"
        />
      </form>
    </div>
  );
}

type SRStatus = "idle" | "listening" | "heard-good" | "heard-bad" | "unsupported";

export function SpeakRenderer({ ex, sel, setSel, checked, onSkip }: { ex: SpeakStep } & StepProps) {
  const [status, setStatus] = useState<SRStatus>("idle");
  const [heard, setHeard] = useState("");
  const supported = typeof window !== "undefined" && Boolean((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  useEffect(() => {
    if (!supported) setStatus("unsupported");
  }, [supported]);

  function listenMic() {
    const w = window as unknown as {
      SpeechRecognition?: new () => { lang: string; onresult: ((e: { results: { transcript: string }[][] }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void };
      webkitSpeechRecognition?: new () => { lang: string; onresult: ((e: { results: { transcript: string }[][] }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void };
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }
    const rec = new Ctor();
    rec.lang = "es-ES";
    setStatus("listening");
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript ?? "";
      setHeard(text);
      const norm = (s: string) => s.trim().toLowerCase().replace(/[?!¡¿.,;:]+$/g, "");
      if (norm(text) === norm(ex.text)) {
        setStatus("heard-good");
        setSel(true);
      } else {
        setStatus("heard-bad");
        setSel(false);
      }
    };
    rec.onerror = () => setStatus("idle");
    rec.onend = () => {
      setStatus((s) => (s === "listening" ? "idle" : s));
    };
    try {
      rec.start();
    } catch {
      setStatus("idle");
    }
  }

  if (status === "unsupported") {
    return (
      <div className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="font-display text-[22px] font-extrabold" dir="ltr">«{ex.text}»</p>
        <p className="mt-2 text-[14px] font-medium text-[var(--color-text-2)]">
          Tu navegador no tiene micrófono para la app. Dilo en voz alta tres veces y continúa: el oído también entrena.
        </p>
        <button
          onClick={onSkip}
          className="artop-press mt-3 flex min-h-[52px] w-full items-center justify-center rounded-[14px] bg-[var(--color-surface-3)] border-2 border-[var(--color-border)] font-display text-[15px] font-extrabold"
        >
          Ya lo dije en voz alta
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="font-display text-[24px] font-extrabold" dir="ltr">«{ex.text}»</p>
      <button
        onClick={listenMic}
        disabled={checked || status === "listening"}
        aria-label="Hablar ahora"
        className={cn(
          "artop-press flex size-[72px] items-center justify-center rounded-full border-b-8",
          status === "listening"
            ? "bg-[#EF4444] border-[#B91C1C] text-white artop-pulse"
            : "bg-[var(--color-brand)] border-[var(--color-brand-deep)] text-white"
        )}
      >
        <Microphone size={32} weight="fill" aria-hidden />
      </button>
      <p className="text-[14px] font-bold text-[var(--color-text-2)]" aria-live="polite">
        {status === "listening" ? "Escuchando… habla ahora" : status === "heard-good" ? "¡Suena bien! Pulsa Comprobar." : status === "heard-bad" ? `Escuché «${heard}». Inténtalo otra vez.` : "Toca el micro y dilo"}
      </p>
      {status !== "idle" && status !== "listening" && !checked && (
        <button onClick={onSkip} className="text-[13px] font-bold text-[var(--color-text-3)] underline">
          Saltar sin puntos
        </button>
      )}
    </div>
  );
}

export function SpotRenderer({ ex, sel, setSel, checked }: { ex: SpotStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  return (
    <div className="grid gap-2.5">
      {ex.lines.map((line, i) => (
        <button
          key={line}
          onClick={() => setSel(i)}
          disabled={checked}
          aria-pressed={sel === i}
          className={cn(
            "artop-press min-h-[56px] w-full rounded-[14px] border-2 border-b-4 px-4 text-left font-mono text-[15px] font-bold",
            sel === i
              ? "bg-[var(--color-brand-tint)] border-[var(--color-brand)]"
              : "bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-3)]",
            checked && sel !== i && "opacity-70"
          )}
          dir="ltr"
        >
          <span className="mr-2 text-[var(--color-text-3)]">{i + 1}</span>
          {line}
        </button>
      ))}
    </div>
  );
}

export function RecallRenderer({ ex, sel, setSel, checked }: { ex: RecallStep } & Pick<StepProps, "sel" | "setSel" | "checked">) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [ex]);
  return (
    <div className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
      <p className="font-display text-[30px] font-extrabold" dir="ltr">{ex.front}</p>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="artop-press mt-4 flex min-h-[52px] w-full items-center justify-center rounded-[14px] bg-[var(--color-surface-3)] border-2 border-[var(--color-border)] font-display text-[15px] font-extrabold"
        >
          Ver respuesta
        </button>
      ) : (
        <>
          <p className="artop-node-pop mt-2 text-[17px] font-bold text-[var(--color-brand-ink)]" dir="ltr">{ex.back}</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setSel(false)}
              disabled={checked}
              aria-pressed={sel === false}
              className={cn(
                "artop-press min-h-[52px] rounded-[14px] border-2 border-b-4 font-display text-[15px] font-extrabold",
                sel === false ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]" : "bg-[var(--color-surface)] border-[var(--color-border)]"
              )}
            >
              Aún no
            </button>
            <button
              onClick={() => setSel(true)}
              disabled={checked}
              aria-pressed={sel === true}
              className={cn(
                "artop-press min-h-[52px] rounded-[14px] border-2 border-b-4 font-display text-[15px] font-extrabold",
                sel === true ? "bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]" : "bg-[var(--color-surface)] border-[var(--color-border)]"
              )}
            >
              ¡Lo sabía!
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function StepView({ ex, sel, setSel, checked, onCheck, onSkip }: { ex: Step } & StepProps) {
  switch (ex.kind) {
    case "choice":
      return <ChoiceRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "complete":
      return <CompleteRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "tf":
      return <TfRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "order":
      return <OrderRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "match":
      return <MatchRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "write":
      return <WriteRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} onCheck={onCheck} onSkip={onSkip} />;
    case "listen":
      return <ListenRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "dictate":
      return <DictateRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} onCheck={onCheck} onSkip={onSkip} />;
    case "speak":
      return <SpeakRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} onCheck={onCheck} onSkip={onSkip} />;
    case "spot":
      return <SpotRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
    case "recall":
      return <RecallRenderer ex={ex} sel={sel} setSel={setSel} checked={checked} />;
  }
}

export function canCheck(ex: Step, sel: unknown): boolean {
  if (sel === null || sel === undefined) return false;
  if (typeof sel === "string") return sel.trim().length > 0;
  if (Array.isArray(sel)) return sel.length > 0;
  if (ex.kind === "match") {
    if (typeof sel !== "object" || Array.isArray(sel)) return false;
    return Object.keys(sel as Record<string, string>).length === ex.pairs.length;
  }
  return true;
}
