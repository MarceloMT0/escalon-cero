import { Bug, CheckCircle2, ClipboardList, Code2, FileText } from "lucide-react";
import { activity } from "@/content/catalog";
import { displayDate } from "@/lib/utils";
import type { SharedPortfolio } from "@/features/practice/model";

export function PortfolioView({ portfolio }: { portfolio: SharedPortfolio }) {
  return (
    <article className="portfolio-document">
      <div className="portfolio-cover">
        <span className="portfolio-avatar">{portfolio.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <span className="quiet-eyebrow">PORTAFOLIO DE PRÁCTICA</span>
          <h1>{portfolio.name}</h1>
          <p>
            {portfolio.summary ||
              "Aprendiendo a convertir conocimiento en trabajo que se puede mostrar."}
          </p>
        </div>
        <span className="portfolio-role">
          <Code2 size={16} />
          QA / Testing
        </span>
      </div>
      <div className="portfolio-project">
        <div className="portfolio-project-heading">
          <span className="eyebrow lime-badge">PROYECTO DE PRÁCTICA</span>
          <span className="muted">{displayDate(portfolio.date)}</span>
        </div>
        <h2>{activity.title}</h2>
        <p>
          Mi contribución: diseñar y ejecutar pruebas funcionales, documentar hallazgos y explicar
          las decisiones de revisión de un checkout.
        </p>
        <div className="portfolio-skills">
          {activity.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
        <div className="portfolio-facts">
          <span>
            <ClipboardList size={20} />
            <strong>{portfolio.cases.length}</strong> casos ejecutados
          </span>
          <span>
            <Bug size={20} />
            <strong>{portfolio.reports.length}</strong> errores documentados
          </span>
          <span>
            <CheckCircle2 size={20} />
            Entrega registrada
          </span>
        </div>
        <div className="notice">
          <FileText size={20} />
          <p>
            Simulación de una tienda ficticia. Trabajo declarado por su autor, sin revisión
            profesional independiente. No corresponde a empleo ni a un encargo de una empresa.
          </p>
        </div>
        <section className="portfolio-section">
          <h3>Cómo probé</h3>
          <div className="portfolio-cases">
            {portfolio.cases.map((item, index) => (
              <details key={item.id}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <span className={item.result === "fallo" ? "result-badge fail" : "result-badge"}>
                    {item.result === "fallo" ? "Fallo" : "Correcto"}
                  </span>
                </summary>
                <dl>
                  <dt>Requisito</dt>
                  <dd>{item.requirement}</dd>
                  <dt>Pasos</dt>
                  <dd>{item.steps}</dd>
                  <dt>Esperado</dt>
                  <dd>{item.expected}</dd>
                  <dt>Observado</dt>
                  <dd>{item.actual}</dd>
                </dl>
              </details>
            ))}
          </div>
        </section>
        <section className="portfolio-section">
          <h3>Mis hallazgos</h3>
          <div className="portfolio-reports">
            {portfolio.reports.map((report, index) => (
              <div key={report.id} className="portfolio-report">
                <span className="report-id">
                  BUG-{String(index + 1).padStart(2, "0")} · {report.requirement} · Severidad{" "}
                  {report.severity.toLowerCase()}
                </span>
                <h4>{report.title}</h4>
                <dl>
                  <dt>Cómo reproducir</dt>
                  <dd>{report.steps}</dd>
                  <dt>Resultado esperado</dt>
                  <dd>{report.expected}</dd>
                  <dt>Resultado actual</dt>
                  <dd>{report.actual}</dd>
                </dl>
              </div>
            ))}
          </div>
        </section>
        <section className="portfolio-section reflection-section">
          <span className="quiet-eyebrow">LO QUE ME LLEVO</span>
          <h3>Mis decisiones y aprendizajes</h3>
          <p>{portfolio.reflection}</p>
        </section>
      </div>
      <div className="portfolio-colophon">
        Creado con Escalón Cero · Tu experiencia empieza haciendo.
      </div>
    </article>
  );
}
