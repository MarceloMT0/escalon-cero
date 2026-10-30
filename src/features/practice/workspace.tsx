"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bug,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CloudUpload,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  HardDrive,
  Lightbulb,
  Paperclip,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { activity, requirements } from "@/content/catalog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cloudConfigured } from "@/lib/supabase";
import { displayDate, downloadText } from "@/lib/utils";
import { assessDraft, type PracticeDraft, type Evidence } from "./model";
import { usePractice, saveDraft } from "./store";
import { StartButton } from "./start-button";
import { CaseEditor, ReportEditor } from "./editors";
import { addEvidence, readEvidence, removeEvidence } from "./evidence";

const tabs = [
  { id: "brief", title: "El encargo", icon: ClipboardList, detail: "Lee y explora" },
  { id: "cases", title: "Casos de prueba", icon: FileText, detail: "Planea y ejecuta" },
  { id: "reports", title: "Reportes de errores", icon: Bug, detail: "Documenta hallazgos" },
  { id: "delivery", title: "Mi entrega", icon: FileCheck2, detail: "Revisa y muestra" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export function PracticeWorkspace() {
  const draft = usePractice();
  const [tab, setTab] = useState<Tab>("brief");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const assessment = assessDraft(draft);
  function persist(next: PracticeDraft, message: string, submitted = false) {
    try {
      saveDraft(submitted ? next : { ...next, status: "draft", submittedAt: null });
      setNotice(message);
      return true;
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No se pudo guardar.");
      return false;
    }
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    if (draft.evidence.length >= 5) {
      setNotice("Puedes adjuntar hasta 5 evidencias.");
      return;
    }
    setBusy(true);
    try {
      const entry = await addEvidence(file);
      persist(
        { ...draft, evidence: [...draft.evidence, entry] },
        "Evidencia guardada en este navegador.",
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No se pudo guardar el archivo.");
    } finally {
      setBusy(false);
    }
  }
  async function downloadEvidence(entry: Evidence) {
    try {
      const local = await readEvidence(entry.id);
      const blob = local ?? (await (await import("./cloud")).readCloudEvidence(entry));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = entry.name;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No se pudo abrir la evidencia.");
    }
  }
  async function sync(restore: boolean) {
    setBusy(true);
    try {
      const cloud = await import("./cloud");
      const next = restore ? await cloud.loadCloudDraft() : await cloud.saveCloudDraft(draft);
      saveDraft(next);
      setNotice(
        restore ? "Se recuperó la versión de tu cuenta." : "Práctica sincronizada con tu cuenta.",
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No se pudo sincronizar.");
    } finally {
      setBusy(false);
    }
  }
  if (!draft.startedAt)
    return (
      <div className="page-container internal-page">
        <div className="empty-practice surface">
          <span className="step-icon">
            <ClipboardList size={32} />
          </span>
          <span className="quiet-eyebrow">TODO EMPIEZA CON UN PRIMER PASO</span>
          <h1>Tu primera práctica te espera.</h1>
          <p>{activity.description}</p>
          <div className="button-row">
            <StartButton />
            <Link className={buttonVariants({ variant: "secondary" })} href="/actividad/qa-tienda/">
              Leer el encargo
            </Link>
            {cloudConfigured ? (
              <Button variant="secondary" disabled={busy} onClick={() => void sync(true)}>
                Recuperar mi práctica de mi cuenta
              </Button>
            ) : null}
          </div>
          {notice ? (
            <p className="feedback" role="status">
              {notice}
            </p>
          ) : null}
          <span className="field-help">
            Tu avance se guarda en este navegador. Puedes descargarlo al terminar.
          </span>
        </div>
      </div>
    );
  return (
    <div className="page-container workspace-page">
      <Link href="/actividad/qa-tienda/" className="back-link">
        <ArrowLeft size={15} />
        Volver al encargo completo
      </Link>
      <div className="workspace-heading">
        <div>
          <span className="quiet-eyebrow">MI PRÁCTICA · QA / TESTING</span>
          <h1>
            Una compra sin sorpresas<span className="cobalt">.</span>
          </h1>
          <p>Explora, prueba y deja evidencia de tus decisiones.</p>
        </div>
        <Link href="/simulador/" target="_blank" className={buttonVariants()}>
          Abrir tienda de práctica <ExternalLink size={17} />
        </Link>
      </div>
      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <nav aria-label="Pasos de la práctica">
            {tabs.map(({ id, title, detail, icon: Icon }) => (
              <button
                key={id}
                className={tab === id ? "workspace-tab active" : "workspace-tab"}
                onClick={() => setTab(id)}
                aria-current={tab === id ? "step" : undefined}
              >
                <Icon size={20} />
                <span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
                {id === "cases" && draft.cases.length ? (
                  <span className="count-badge">{draft.cases.length}</span>
                ) : null}
                {id === "reports" && draft.reports.length ? (
                  <span className="count-badge">{draft.reports.length}</span>
                ) : null}
              </button>
            ))}
          </nav>
          <div className="workspace-progress">
            <span>Tu preparación</span>
            <strong>{assessment.completed} de 4 criterios</strong>
            <progress
              value={assessment.completed}
              max={4}
              aria-label="Criterios de la entrega cumplidos"
            />
            <p>
              {draft.status === "submitted"
                ? "Entrega registrada. Ya puedes crear tu portafolio."
                : "Cada decisión que documentas cuenta."}
            </p>
          </div>
          <div className="storage-note">
            <HardDrive size={16} />
            <span>
              Copia local en este navegador
              <br />
              {draft.updatedAt
                ? `Guardada el ${displayDate(draft.updatedAt)}`
                : "Guarda tus primeros resultados"}
            </span>
          </div>
          {cloudConfigured ? (
            <div className="stack">
              <Button
                size="small"
                variant="secondary"
                onClick={() => void sync(false)}
                disabled={busy}
              >
                <CloudUpload size={15} />
                Sincronizar con mi cuenta
              </Button>
              <Dialog
                title="Recuperar la copia de tu cuenta"
                description="Esto reemplazará el borrador local por la última versión que sincronizaste."
                trigger={
                  <Button size="small" variant="ghost">
                    Recuperar de mi cuenta
                  </Button>
                }
              >
                <Button disabled={busy} onClick={() => void sync(true)}>
                  <RotateCcw size={15} />
                  Recuperar versión guardada
                </Button>
              </Dialog>
            </div>
          ) : null}
        </aside>
        <div className="workspace-main">
          {notice ? (
            <div className="feedback workspace-notice" role="status">
              {notice}
              <button aria-label="Cerrar mensaje" onClick={() => setNotice("")}>
                ×
              </button>
            </div>
          ) : null}
          {tab === "brief" ? (
            <section className="surface">
              <span className="section-kicker">
                <ClipboardList size={18} />
                ANTES DE PROBAR
              </span>
              <h2>Tu misión en el equipo</h2>
              <p>
                La tienda ficticia Nube está por estrenar su checkout. Contrasta lo que hace con
                estos requisitos. No todos los casos tienen que fallar: documenta también lo que
                funciona.
              </p>
              <div className="requirements-list">
                {requirements.map((req) => (
                  <div key={req.id}>
                    <span className="requirement-id">{req.id}</span>
                    <div>
                      <h3>{req.title}</h3>
                      <p>{req.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notice">
                <Lightbulb size={21} />
                <p>
                  Empieza con una compra normal. Después explora límites y entradas inválidas.
                  Reinicia la tienda entre escenarios para poder reproducirlos.
                </p>
              </div>
              <Button onClick={() => setTab("cases")}>
                Preparar mis casos <ArrowRight size={17} />
              </Button>
            </section>
          ) : null}
          {tab === "cases" ? (
            <section>
              <div className="panel-heading">
                <div>
                  <span className="quiet-eyebrow">PASO 1</span>
                  <h2>Diseña y ejecuta tus pruebas</h2>
                  <p>Guarda al menos tres casos y explora más de un requisito.</p>
                </div>
              </div>
              <div className="entry-list">
                {draft.cases.map((item, index) => (
                  <details className="entry-card" key={item.id}>
                    <summary>
                      <span className="entry-number">{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          {item.requirement} ·{" "}
                          {item.result === "fallo"
                            ? "Fallo"
                            : item.result === "correcto"
                              ? "Correcto"
                              : "Pendiente"}
                        </small>
                      </span>
                      <ChevronDown size={18} />
                    </summary>
                    <CaseEditor
                      item={item}
                      onSave={(next) =>
                        persist(
                          {
                            ...draft,
                            cases: draft.cases.map((v) => (v.id === next.id ? next : v)),
                          },
                          "Caso actualizado.",
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        persist(
                          { ...draft, cases: draft.cases.filter((v) => v.id !== item.id) },
                          "Caso eliminado del borrador.",
                        )
                      }
                    >
                      <Trash2 size={14} />
                      Quitar este caso
                    </Button>
                  </details>
                ))}
              </div>
              {draft.cases.length < 20 ? (
                <div className="surface">
                  <span className="section-kicker">
                    <Plus size={18} />
                    NUEVO CASO DE PRUEBA
                  </span>
                  <CaseEditor
                    onSave={(item) =>
                      persist(
                        { ...draft, cases: [...draft.cases, item] },
                        "Caso guardado. Puedes añadir otro o continuar con tus reportes.",
                      )
                    }
                  />
                </div>
              ) : (
                <p>Llegaste al límite de 20 casos.</p>
              )}
              <div className="panel-next">
                <Button variant="secondary" onClick={() => setTab("reports")}>
                  Continuar a reportes <ArrowRight size={16} />
                </Button>
              </div>
            </section>
          ) : null}
          {tab === "reports" ? (
            <section>
              <div className="panel-heading">
                <span className="quiet-eyebrow">PASO 2</span>
                <h2>Un hallazgo que otro pueda reproducir</h2>
                <p>
                  Documenta al menos dos errores. Explica el impacto y relaciona cada uno con su
                  requisito.
                </p>
              </div>
              <div className="entry-list">
                {draft.reports.map((item, index) => (
                  <details className="entry-card" key={item.id}>
                    <summary>
                      <span className="entry-number bug-number">
                        <Bug size={19} />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          BUG-{String(index + 1).padStart(2, "0")} · {item.requirement} · Severidad{" "}
                          {item.severity.toLowerCase()}
                        </small>
                      </span>
                      <ChevronDown size={18} />
                    </summary>
                    <ReportEditor
                      item={item}
                      onSave={(next) =>
                        persist(
                          {
                            ...draft,
                            reports: draft.reports.map((v) => (v.id === next.id ? next : v)),
                          },
                          "Reporte actualizado.",
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        persist(
                          { ...draft, reports: draft.reports.filter((v) => v.id !== item.id) },
                          "Reporte eliminado del borrador.",
                        )
                      }
                    >
                      <Trash2 size={14} />
                      Quitar este reporte
                    </Button>
                  </details>
                ))}
              </div>
              {draft.reports.length < 10 ? (
                <div className="surface">
                  <span className="section-kicker">
                    <Plus size={18} />
                    NUEVO REPORTE DE ERROR
                  </span>
                  <ReportEditor
                    onSave={(item) =>
                      persist({ ...draft, reports: [...draft.reports, item] }, "Reporte guardado.")
                    }
                  />
                </div>
              ) : (
                <p>Llegaste al límite de 10 reportes.</p>
              )}
              <div className="panel-next">
                <Button variant="secondary" onClick={() => setTab("delivery")}>
                  Preparar mi entrega <ArrowRight size={16} />
                </Button>
              </div>
            </section>
          ) : null}
          {tab === "delivery" ? (
            <section className="stack">
              <div className="panel-heading">
                <span className="quiet-eyebrow">PASO 3</span>
                <h2>Convierte lo que hiciste en evidencia</h2>
                <p>Cuenta tus decisiones, adjunta tus pruebas y revisa tu entrega.</p>
              </div>
              <form
                className="surface stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  const values = new FormData(event.currentTarget);
                  persist(
                    { ...draft, reflection: String(values.get("reflection")) },
                    "Reflexión guardada.",
                  );
                }}
              >
                <label className="field">
                  <strong>¿Qué probaste y qué aprendiste?</strong>
                  <span className="field-help">
                    ¿Por qué elegiste esos casos? ¿Qué priorizarías antes de lanzar la tienda? Al
                    menos 80 caracteres.
                  </span>
                  <textarea
                    key={draft.reflection}
                    name="reflection"
                    rows={5}
                    defaultValue={draft.reflection}
                    maxLength={3000}
                    minLength={80}
                    placeholder="Elegí probar… porque… El hallazgo que priorizaría es…"
                    required
                  />
                </label>
                <Button type="submit" size="small" variant="secondary">
                  Guardar reflexión
                </Button>
              </form>
              <div className="surface">
                <span className="section-kicker">
                  <Paperclip size={18} />
                  EVIDENCIAS DE APOYO
                </span>
                <h3>Haz visibles tus hallazgos</h3>
                <p>
                  Adjunta capturas o un PDF, sin información personal. Hasta 5 archivos de 2 MB. Son
                  privados y no se incluyen en el enlace público del portafolio.
                </p>
                <label className="upload-field">
                  {busy ? "Guardando archivo…" : "Seleccionar una evidencia"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    disabled={busy || draft.evidence.length >= 5}
                    onChange={(e) => {
                      void upload(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <ul className="evidence-list">
                  {draft.evidence.map((entry) => (
                    <li key={entry.id}>
                      <Paperclip size={16} />
                      <span>
                        {entry.name}
                        <small>{Math.ceil(entry.size / 1024)} KB</small>
                      </span>
                      <Button
                        aria-label={`Descargar ${entry.name}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => void downloadEvidence(entry)}
                      >
                        <Download size={17} />
                      </Button>
                      <Button
                        aria-label={`Quitar ${entry.name}`}
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          if (
                            persist(
                              {
                                ...draft,
                                evidence: draft.evidence.filter((v) => v.id !== entry.id),
                              },
                              "Evidencia retirada del borrador.",
                            )
                          )
                            await removeEvidence(entry.id).catch(() => undefined);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface rubric-card">
                <span className="section-kicker">
                  <FileCheck2 size={18} />
                  REVISIÓN DE ESTRUCTURA
                </span>
                <h3>¿Está lista para mostrar?</h3>
                <ul className="rubric-list">
                  {assessment.checks.map((check) => (
                    <li key={check.id} className={check.met ? "met" : ""}>
                      <span>
                        {check.met ? <Check size={16} /> : <span className="empty-check" />}
                      </span>
                      <div>
                        <strong>{check.label}</strong>
                        <p>{check.met ? "Criterio de estructura cumplido." : check.hint}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="field-help">
                  Esta revisión comprueba estructura y cobertura declarada. No verifica la veracidad
                  de tus errores ni sustituye la revisión de un profesional.
                </p>
                {draft.status === "submitted" ? (
                  <div className="submission-success">
                    <CheckCircle2 size={25} />
                    <div>
                      <strong>¡Tu primer proyecto ya tiene una entrega!</strong>
                      <p>
                        Registrada el {displayDate(draft.submittedAt)}. Puedes seguir mejorándola;
                        guardar cambios volverá a abrir el borrador.
                      </p>
                      <Link href="/portafolio/" className={buttonVariants()}>
                        Crear mi portafolio <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Button
                    disabled={!assessment.ready}
                    onClick={() => {
                      if (assessment.ready)
                        persist(
                          { ...draft, status: "submitted", submittedAt: new Date().toISOString() },
                          "Entrega registrada. Tu trabajo está listo para tu portafolio.",
                          true,
                        );
                    }}
                  >
                    Registrar mi entrega <ArrowRight size={17} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() =>
                    downloadText(
                      "escalon-cero-entrega.json",
                      JSON.stringify(
                        {
                          ...draft,
                          evidence: draft.evidence.map(({ name, type, size }) => ({
                            name,
                            type,
                            size,
                          })),
                        },
                        null,
                        2,
                      ),
                      "application/json",
                    )
                  }
                >
                  <Download size={16} />
                  Descargar copia de la entrega
                </Button>
                <span className="field-help">
                  La copia incluye tus textos y una lista de evidencias; descarga los archivos por
                  separado.
                </span>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
