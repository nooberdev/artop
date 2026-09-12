"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import {
  CaminoAside, WindingPath, CourseEmpty, CourseLoading, CourseCompleted,
  GenerationCard, CourseError, type CoursePhase,
} from "@/components/camino";
import { caminoCourse, caminoUnits, type CaminoNode, type CaminoUnit } from "@/lib/camino";
import { useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

const PHASES: { id: CoursePhase; label: string }[] = [
  { id: "active", label: "Activo" },
  { id: "empty", label: "Sin cursos" },
  { id: "loading", label: "Cargando" },
  { id: "completed", label: "Completado" },
  { id: "generating", label: "Generando" },
  { id: "paused", label: "Pausado" },
  { id: "error", label: "Error" },
];

export default function CaminoPage() {
  const { push } = useToast();
  const router = useRouter();
  const [phase, setPhase] = useState<CoursePhase>("active");
  const [selected, setSelected] = useState<{ node: CaminoNode; unit: CaminoUnit } | null>(null);

  const activeUnit = caminoUnits.find((u) => u.nodes.some((n) => n.status === "in-progress"));

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  function handleSelect(node: CaminoNode, unit: CaminoUnit) {
    setSelected((prev) => (prev?.node.id === node.id ? null : { node, unit }));
  }

  function handleAction() {
    if (!selected) return;
    const { node } = selected;
    if (node.status === "locked") {
      push({ title: "Nodo bloqueado", body: "Completa la lección anterior para abrirlo.", tone: "info" });
      return;
    }
    router.push(`/leccion/${node.id}`);
  }

  return (
    <AppShell
      title={caminoCourse.title}
      subtitle={`Unidad ${activeUnit?.number ?? 1} de ${caminoCourse.totalUnits} · ${activeUnit?.title ?? ""}`}
      aside={<CaminoAside />}
    >
      <h1 className="sr-only">Mi Camino: {caminoCourse.title}</h1>

      {phase === "active" && (
        <WindingPath
          units={caminoUnits}
          openNodeId={selected?.node.id ?? null}
          onSelect={handleSelect}
          onAction={handleAction}
        />
      )}
      {phase === "empty" && <CourseEmpty onPreview={() => setPhase("generating")} />}
      {phase === "loading" && <CourseLoading />}
      {phase === "completed" && <CourseCompleted onReview={() => push({ title: "Repaso listo", body: "Empezamos por Bucles for.", tone: "info" })} />}
      {phase === "generating" && <GenerationCard />}
      {phase === "paused" && <GenerationCard initialPaused />}
      {phase === "error" && <CourseError onRetry={() => setPhase("loading")} />}

      {phase === "active" && (
        <div className="mt-10 xl:hidden">
          <CaminoAside />
        </div>
      )}

      <details className="mt-10 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <summary className="cursor-pointer px-5 py-4 font-display text-[14px] font-extrabold text-[var(--color-text-2)]">
          Vista previa de estados
        </summary>
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          {PHASES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPhase(p.id)}
              aria-pressed={phase === p.id}
              className={cn(
                "artop-press min-h-[44px] rounded-[12px] border-2 px-4 text-[14px] font-display font-extrabold",
                phase === p.id
                  ? "bg-[var(--color-brand)] text-white border-transparent"
                  : "border-[var(--color-border)] text-[var(--color-text-2)] hover:text-[var(--color-text)]"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </details>
    </AppShell>
  );
}
