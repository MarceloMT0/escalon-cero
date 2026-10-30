import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assessDraft,
  buildPortfolio,
  draftSchema,
  emptyDraft,
  evidenceSchema,
  type PracticeDraft,
} from "../src/features/practice/model";

function completeDraft(): PracticeDraft {
  return {
    ...structuredClone(emptyDraft),
    startedAt: "2026-10-29T20:00:00Z",
    cases: Array.from({ length: 3 }, (_, i) => ({
      id: `case-${i}`,
      requirement: i === 0 ? "REQ-01" : "REQ-02",
      title: `Caso de cantidad ${i}`,
      steps: "Reiniciar y seleccionar dos unidades.",
      expected: "Envío gratuito a partir de 160 soles.",
      actual: "La tienda agrega 12 soles de envío.",
      result: "fallo" as const,
    })),
    reports: Array.from({ length: 2 }, (_, i) => ({
      id: `bug-${i}`,
      requirement: "REQ-02",
      title: `Envío en el umbral ${i}`,
      severity: "Media" as const,
      steps: "Reiniciar y seleccionar dos unidades.",
      expected: "El envío debería ser gratuito.",
      actual: "Se añaden 12 soles al pedido.",
    })),
    reflection:
      "Probé los límites del envío porque son distintos al recorrido habitual. Priorizaría corregir los cobros y volvería a ejecutar los casos después del cambio.",
    status: "submitted",
    submittedAt: "2026-10-29T21:00:00Z",
  };
}
test("an empty or unexecuted practice cannot be submitted", () => {
  assert.equal(assessDraft(emptyDraft).ready, false);
  const pending = completeDraft();
  pending.cases.forEach((item) => {
    item.result = "pendiente";
  });
  assert.equal(assessDraft(pending).ready, false);
});
test("coverage requires at least two requirements", () => {
  const draft = completeDraft();
  draft.cases.forEach((item) => {
    item.requirement = "REQ-01";
  });
  assert.equal(assessDraft(draft).checks.find((c) => c.id === "coverage")?.met, false);
});
test("a complete practice satisfies structure without claiming professional correctness", () => {
  assert.equal(assessDraft(completeDraft()).ready, true);
  assert.equal(assessDraft(completeDraft()).completed, 4);
});
test("sharing requires a submitted practice and excludes all private file metadata", () => {
  const draft = completeDraft();
  draft.evidence = [
    {
      id: "private-file",
      name: "privado.pdf",
      type: "application/pdf",
      size: 100,
      remotePath: "private/path.pdf",
    },
  ];
  const portfolio = buildPortfolio(draft, "Participante", "Mi primer proyecto de QA.");
  assert.equal("evidence" in portfolio, false);
  assert.equal(JSON.stringify(portfolio).includes("private/path.pdf"), false);
  assert.equal(JSON.stringify(portfolio).includes("privado.pdf"), false);
  assert.throws(() => buildPortfolio({ ...draft, status: "draft" }, "Participante", ""));
});
test("drafts reject unknown versions, oversized payload fields and unsupported files", () => {
  assert.equal(draftSchema.safeParse({ ...emptyDraft, version: 2 }).success, false);
  assert.equal(
    draftSchema.safeParse({ ...emptyDraft, reflection: "x".repeat(3001) }).success,
    false,
  );
  assert.equal(
    evidenceSchema.safeParse({ id: "1", name: "script.svg", type: "image/svg+xml", size: 100 })
      .success,
    false,
  );
  assert.equal(
    evidenceSchema.safeParse({ id: "1", name: "huge.pdf", type: "application/pdf", size: 2097153 })
      .success,
    false,
  );
});
