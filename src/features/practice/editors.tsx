"use client";
import { useId } from "react";
import { Save } from "lucide-react";
import { requirements } from "@/content/catalog";
import { Button } from "@/components/ui/button";
import type { BugReport, TestCase } from "./model";

export function CaseEditor({
  item,
  onSave,
}: {
  item?: TestCase;
  onSave: (item: TestCase) => boolean;
}) {
  const prefix = useId();
  return (
    <form
      className="editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const values = new FormData(form);
        const saved = onSave({
          id: item?.id ?? crypto.randomUUID(),
          title: String(values.get("title")),
          requirement: String(values.get("requirement")),
          steps: String(values.get("steps")),
          expected: String(values.get("expected")),
          actual: String(values.get("actual")),
          result: values.get("result") as TestCase["result"],
        });
        if (saved && !item) form.reset();
      }}
    >
      <div className="form-grid">
        <label className="field" htmlFor={`${prefix}-title`}>
          Nombre del caso
          <input
            id={`${prefix}-title`}
            name="title"
            defaultValue={item?.title}
            minLength={5}
            maxLength={180}
            placeholder="Ej.: dos productos en el límite de envío gratis"
            required
          />
        </label>
        <label className="field">
          Requisito
          <select
            aria-label="Requisito"
            name="requirement"
            defaultValue={item?.requirement ?? "REQ-01"}
          >
            {requirements.map((req) => (
              <option key={req.id} value={req.id}>
                {req.id} · {req.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        Pasos para probar
        <textarea
          name="steps"
          defaultValue={item?.steps}
          minLength={5}
          maxLength={2000}
          placeholder="1. Reiniciar la tienda. 2. Seleccionar…"
          rows={3}
          required
        />
      </label>
      <div className="form-grid">
        <label className="field">
          Resultado esperado
          <textarea
            name="expected"
            defaultValue={item?.expected}
            minLength={5}
            maxLength={1600}
            placeholder="Lo que debería pasar según el requisito"
            rows={3}
            required
          />
        </label>
        <label className="field">
          Resultado observado
          <textarea
            name="actual"
            defaultValue={item?.actual}
            minLength={5}
            maxLength={1600}
            placeholder="Lo que realmente pasó al ejecutar el caso"
            rows={3}
            required
          />
        </label>
      </div>
      <div className="editor-bottom">
        <label className="field">
          Estado
          <select aria-label="Estado" name="result" defaultValue={item?.result ?? "pendiente"}>
            <option value="pendiente">Pendiente de ejecutar</option>
            <option value="correcto">Correcto</option>
            <option value="fallo">Fallo</option>
          </select>
        </label>
        <Button type="submit" size="small">
          <Save size={16} />
          {item ? "Guardar cambios del caso" : "Guardar caso"}
        </Button>
      </div>
    </form>
  );
}
export function ReportEditor({
  item,
  onSave,
}: {
  item?: BugReport;
  onSave: (item: BugReport) => boolean;
}) {
  return (
    <form
      className="editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const values = new FormData(form);
        const saved = onSave({
          id: item?.id ?? crypto.randomUUID(),
          title: String(values.get("title")),
          requirement: String(values.get("requirement")),
          severity: values.get("severity") as BugReport["severity"],
          steps: String(values.get("steps")),
          expected: String(values.get("expected")),
          actual: String(values.get("actual")),
        });
        if (saved && !item) form.reset();
      }}
    >
      <label className="field">
        Título del error
        <input
          name="title"
          defaultValue={item?.title}
          minLength={5}
          maxLength={180}
          placeholder="Describe el problema, no solo la pantalla"
          required
        />
      </label>
      <div className="form-grid">
        <label className="field">
          Requisito afectado
          <select
            aria-label="Requisito afectado"
            name="requirement"
            defaultValue={item?.requirement ?? "REQ-01"}
          >
            {requirements.map((req) => (
              <option key={req.id} value={req.id}>
                {req.id} · {req.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Severidad
          <select aria-label="Severidad" name="severity" defaultValue={item?.severity ?? "Media"}>
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </label>
      </div>
      <label className="field">
        Pasos para reproducir
        <textarea
          name="steps"
          defaultValue={item?.steps}
          minLength={5}
          maxLength={2000}
          placeholder="Desde una tienda reiniciada, ¿cómo llega otra persona al error?"
          rows={3}
          required
        />
      </label>
      <div className="form-grid">
        <label className="field">
          Resultado esperado
          <textarea
            name="expected"
            defaultValue={item?.expected}
            minLength={5}
            maxLength={1600}
            rows={3}
            required
          />
        </label>
        <label className="field">
          Resultado actual
          <textarea
            name="actual"
            defaultValue={item?.actual}
            minLength={5}
            maxLength={1600}
            rows={3}
            required
          />
        </label>
      </div>
      <div className="editor-bottom">
        <span className="field-help">Un reporte claro permite reproducir el error.</span>
        <Button type="submit" size="small">
          <Save size={16} />
          {item ? "Guardar cambios del reporte" : "Guardar reporte"}
        </Button>
      </div>
    </form>
  );
}
