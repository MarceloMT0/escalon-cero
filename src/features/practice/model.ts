import { z } from "zod";

const text = (max: number) => z.string().max(max);
export const caseSchema = z.object({
  id: text(80),
  requirement: text(20),
  title: text(180),
  steps: text(2000),
  expected: text(1600),
  actual: text(1600),
  result: z.enum(["pendiente", "correcto", "fallo"]),
});
export const reportSchema = z.object({
  id: text(80),
  requirement: text(20),
  title: text(180),
  severity: z.enum(["Baja", "Media", "Alta"]),
  steps: text(2000),
  expected: text(1600),
  actual: text(1600),
});
export const evidenceSchema = z.object({
  id: text(80),
  name: text(180),
  type: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
  size: z
    .number()
    .int()
    .min(1)
    .max(2 * 1024 * 1024),
  remotePath: text(300).optional(),
});
export const draftSchema = z.object({
  version: z.literal(1),
  activityId: z.literal("qa-tienda"),
  startedAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  submittedAt: z.string().nullable(),
  status: z.enum(["draft", "submitted"]),
  cases: z.array(caseSchema).max(20),
  reports: z.array(reportSchema).max(10),
  reflection: text(3000),
  evidence: z.array(evidenceSchema).max(5),
});
export type TestCase = z.infer<typeof caseSchema>;
export type BugReport = z.infer<typeof reportSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type PracticeDraft = z.infer<typeof draftSchema>;

export const emptyDraft: PracticeDraft = {
  version: 1,
  activityId: "qa-tienda",
  startedAt: null,
  updatedAt: null,
  submittedAt: null,
  status: "draft",
  cases: [],
  reports: [],
  reflection: "",
  evidence: [],
};

export function isCaseComplete(item: TestCase) {
  return (
    [item.title, item.steps, item.expected, item.actual].every((v) => v.trim().length >= 5) &&
    item.result !== "pendiente"
  );
}
export function isReportComplete(item: BugReport) {
  return [item.title, item.steps, item.expected, item.actual].every((v) => v.trim().length >= 5);
}
export function assessDraft(draft: PracticeDraft) {
  const checks = [
    {
      id: "cases",
      label: "Tres casos de prueba ejecutados",
      met: draft.cases.filter(isCaseComplete).length >= 3,
      hint: "Describe pasos, resultado esperado y observado. Marca cada caso como correcto o fallo.",
    },
    {
      id: "reports",
      label: "Dos errores reproducibles",
      met: draft.reports.filter(isReportComplete).length >= 2,
      hint: "Incluye pasos y compara lo esperado con lo observado en cada reporte.",
    },
    {
      id: "coverage",
      label: "Más de un requisito explorado",
      met: new Set(draft.cases.filter(isCaseComplete).map((c) => c.requirement)).size >= 2,
      hint: "Prueba al menos dos requisitos distintos, incluyendo límites o entradas inválidas.",
    },
    {
      id: "reflection",
      label: "Una reflexión propia",
      met: draft.reflection.trim().length >= 80,
      hint: "Escribe al menos 80 caracteres sobre cómo probaste y qué aprendiste.",
    },
  ];
  return {
    checks,
    ready: checks.every((c) => c.met),
    completed: checks.filter((c) => c.met).length,
  };
}

export const shareSchema = z.object({
  version: z.literal(1),
  name: z.string().trim().min(2).max(60),
  summary: text(400),
  activityId: z.literal("qa-tienda"),
  date: text(80),
  cases: z.array(caseSchema).max(20),
  reports: z.array(reportSchema).max(10),
  reflection: text(3000),
});
export type SharedPortfolio = z.infer<typeof shareSchema>;

export function buildPortfolio(
  draft: PracticeDraft,
  name: string,
  summary: string,
): SharedPortfolio {
  if (draft.status !== "submitted" || !assessDraft(draft).ready)
    throw new Error("Primero completa y entrega la práctica.");
  return shareSchema.parse({
    version: 1,
    name,
    summary,
    activityId: draft.activityId,
    date: draft.submittedAt ?? "",
    cases: draft.cases.filter(isCaseComplete),
    reports: draft.reports.filter(isReportComplete),
    reflection: draft.reflection,
  });
}
