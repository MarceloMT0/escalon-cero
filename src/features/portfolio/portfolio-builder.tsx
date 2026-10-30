"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Download,
  ExternalLink,
  FolderOpen,
  Link2,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { usePractice } from "@/features/practice/store";
import { assessDraft, buildPortfolio, type SharedPortfolio } from "@/features/practice/model";
import { Button, buttonVariants } from "@/components/ui/button";
import { downloadText } from "@/lib/utils";
import { encodePortfolio } from "./share";
import { PortfolioView } from "./portfolio-view";

function portfolioMarkdown(portfolio: SharedPortfolio) {
  return `# ${portfolio.name}\n\n${portfolio.summary}\n\n## Proyecto de práctica: QA de una tienda online\n\nSimulación laboral. Empresa ficticia. Sin revisión profesional independiente.\n\n## Casos de prueba\n\n${portfolio.cases.map((c, i) => `### ${i + 1}. ${c.title}\nRequisito: ${c.requirement}\n\nPasos: ${c.steps}\n\nEsperado: ${c.expected}\n\nObservado: ${c.actual}\n\nEstado: ${c.result}`).join("\n\n")}\n\n## Reportes\n\n${portfolio.reports.map((r, i) => `### BUG-${i + 1}: ${r.title}\nRequisito: ${r.requirement}. Severidad: ${r.severity}.\n\nPasos: ${r.steps}\n\nEsperado: ${r.expected}\n\nActual: ${r.actual}`).join("\n\n")}\n\n## Aprendizajes\n\n${portfolio.reflection}\n\nCreado con Escalón Cero.`;
}

export function PortfolioBuilder() {
  const draft = usePractice();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [consent, setConsent] = useState(false);
  const [portfolio, setPortfolio] = useState<SharedPortfolio | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [notice, setNotice] = useState("");
  if (draft.status !== "submitted" || !assessDraft(draft).ready)
    return (
      <div className="page-container internal-page">
        <section className="empty-practice surface">
          <span className="step-icon">
            <FolderOpen size={32} />
          </span>
          <span className="quiet-eyebrow">TU TRABAJO MERECE UN LUGAR</span>
          <h1>Tu portafolio empieza con una entrega.</h1>
          <p>
            Completa tu primera práctica y documenta tus decisiones. Aquí podrás convertirla en un
            proyecto que puedes compartir.
          </p>
          <Link
            href={draft.startedAt ? "/practica/" : "/actividad/qa-tienda/"}
            className={buttonVariants()}
          >
            {draft.startedAt ? "Continuar mi práctica" : "Conocer mi primera práctica"}
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    );
  return (
    <div className="page-container internal-page">
      <div className="portfolio-builder-heading">
        <span className="quiet-eyebrow">MI PORTAFOLIO</span>
        <h1>
          Ahora puedes <em>mostrarlo.</em>
        </h1>
        <p className="page-intro">
          Tu proceso, tus hallazgos y tus aprendizajes. Un proyecto que cuenta lo que sabes hacer.
        </p>
      </div>
      <div className="portfolio-builder-layout">
        <form
          className="surface portfolio-settings stack"
          onSubmit={async (event) => {
            event.preventDefault();
            setNotice("");
            try {
              if (!consent) throw new Error("Confirma qué información quieres compartir.");
              const next = buildPortfolio(draft, name.trim(), summary.trim());
              const encoded = encodePortfolio(next);
              const url = `${window.location.origin}/compartir/#${encoded}`;
              setPortfolio(next);
              setShareUrl(url);
              try {
                await navigator.clipboard.writeText(url);
                setNotice("Enlace creado y copiado. Puedes abrirlo para revisar lo que compartes.");
              } catch {
                setNotice("Enlace creado. Puedes copiarlo desde el campo de abajo.");
              }
            } catch (e) {
              setNotice(e instanceof Error ? e.message : "No se pudo generar el enlace.");
            }
          }}
        >
          <span className="section-kicker">
            <ShieldCheck size={18} />
            TÚ DECIDES QUÉ MOSTRAR
          </span>
          <h2>Presenta tu proyecto</h2>
          <label className="field">
            Tu nombre o alias
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="¿Cómo quieres aparecer?"
              minLength={2}
              maxLength={60}
              required
              autoComplete="off"
            />
          </label>
          <label className="field">
            Una breve presentación
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={400}
              rows={3}
              placeholder="Ej.: Estoy empezando en QA y me interesa encontrar problemas antes de que lleguen a los usuarios."
            />
          </label>
          <div className="share-disclosure">
            <strong>El enlace incluirá</strong>
            <p>
              Tu nombre o alias, presentación, casos, reportes y reflexión. Los archivos adjuntos
              permanecen privados.
            </p>
            <p>
              Es una copia del texto dentro del enlace. Quien lo reciba podrá conservarlo; cambiar
              tu borrador no modifica ni revoca las copias anteriores.
            </p>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              Revisé mi entrega y quiero compartir este contenido, sin datos personales de terceros.
            </span>
          </label>
          <Button type="submit">
            <Link2 size={17} />
            Crear enlace de mi proyecto
          </Button>
          {notice ? (
            <p className="feedback" role="status">
              {notice}
            </p>
          ) : null}
          {shareUrl ? (
            <div className="stack">
              <label className="field">
                Enlace para compartir
                <textarea
                  readOnly
                  value={shareUrl}
                  rows={2}
                  aria-label="Enlace para compartir"
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "secondary" })}
              >
                Abrir mi portafolio <ExternalLink size={16} />
              </a>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  portfolio &&
                  downloadText(
                    "escalon-cero-portafolio.md",
                    portfolioMarkdown(portfolio),
                    "text/markdown",
                  )
                }
              >
                <Download size={16} />
                Descargar reporte
              </Button>
              <Button type="button" variant="ghost" onClick={() => window.print()}>
                <Printer size={16} />
                Imprimir / guardar PDF
              </Button>
            </div>
          ) : null}
        </form>
        <div className="portfolio-preview">
          {portfolio ? (
            <PortfolioView portfolio={portfolio} />
          ) : (
            <div className="portfolio-placeholder">
              <span className="step-icon">
                <FolderOpen size={30} />
              </span>
              <h2>Tu primer proyecto ya tiene sustancia.</h2>
              <p>
                Preparaste <strong>{draft.cases.length} casos de prueba</strong> y documentaste{" "}
                <strong>{draft.reports.length} hallazgos</strong>.
              </p>
              <p>Añade tu presentación y genera el enlace para ver tu portafolio completo.</p>
              <div className="portfolio-preview-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
