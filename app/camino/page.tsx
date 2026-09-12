"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import {
  CaminoAside, WindingPath, CourseEmpty, CourseLoading, CourseCompleted,
  GenerationCard, CourseError, type CoursePhase,
} from "@/components/camino";
import { caminoCourse, caminoUnits, type CaminoNode, type CaminoUnit } from "@/lib/camino";
import { useToast } from "@/components/ui";

function CaminoInner() {
  const { push } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<CoursePhase>(() => (searchParams.get("nuevo") === "1" ? "empty" : "active"));
  const [selected, setSelected] = useState<{ node: CaminoNode; unit: CaminoUnit } | null>(null);

  const activeUnit = caminoUnits.find((u) => u.nodes.some((n) => n.status === "in-progress"));

  useEffect(() => {
    if (searchParams.get("nuevo") === "1") setPhase("empty");
  }, [searchParams]);

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

  const hasActiveCourse = phase === "active" || phase === "completed";

  const shellTitle = hasActiveCourse ? caminoCourse.title : "Mi Camino";
  const shellSubtitle = (() => {
    if (phase === "active" || phase === "completed") {
      return `Unidad ${activeUnit?.number ?? 1} de ${caminoCourse.totalUnits} · ${activeUnit?.title ?? ""}`;
    }
    if (phase === "generating") return "Generando demo…";
    if (phase === "paused") return "Generación pausada";
    if (phase === "loading") return "Cargando…";
    if (phase === "error") return "Error al cargar";
    return "Sin curso activo";
  })();

  return (
    <AppShell
      title={shellTitle}
      subtitle={shellSubtitle}
      aside={hasActiveCourse ? <CaminoAside /> : undefined}
    >
      <h1 className="sr-only">
        {hasActiveCourse ? `Mi Camino: ${caminoCourse.title}` : "Mi Camino"}
      </h1>

      {phase === "active" && (
        <WindingPath
          units={caminoUnits}
          openNodeId={selected?.node.id ?? null}
          onSelect={handleSelect}
          onAction={handleAction}
        />
      )}
      {phase === "empty" && <CourseEmpty onPreview={() => { setPhase("generating"); router.replace("/camino"); }} />}
      {phase === "loading" && <CourseLoading />}
      {phase === "completed" && <CourseCompleted onReview={() => push({ title: "Repaso listo", body: "Empezamos por Bucles for.", tone: "info" })} />}
      {phase === "generating" && <GenerationCard />}
      {phase === "paused" && <GenerationCard initialPaused />}
      {phase === "error" && <CourseError onRetry={() => setPhase("loading")} />}

      {hasActiveCourse && phase === "active" && (
        <div className="mt-10 xl:hidden">
          <CaminoAside />
        </div>
      )}
    </AppShell>
  );
}

export default function CaminoPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando camino...</div>}>
      <CaminoInner />
    </Suspense>
  );
}
