import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  ExternalLink,
  FileText,
  FlaskConical,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { activity, requirements } from "@/content/catalog";
import { ActivityMeta } from "@/components/activity-card";
import { buttonVariants } from "@/components/ui/button";
import { StartButton } from "@/features/practice/start-button";
export const metadata: Metadata = { title: "Práctica de QA: una tienda online" };
export default function ActivityPage() {
  return (
    <div className="page-container internal-page">
      <Link href="/explorar/" className="back-link">
        <ArrowLeft size={16} />
        Todas las actividades
      </Link>
      <div className="brief-heading">
        <span className="eyebrow lime-badge">SIMULACIÓN LABORAL · QA / TESTING</span>
        <h1>{activity.title}</h1>
        <p className="page-intro">
          Una tienda está por lanzar su nuevo checkout. Tu misión: descubrir qué podría salir mal
          antes de que llegue el primer cliente.
        </p>
        <ActivityMeta />
      </div>
      <div className="brief-layout">
        <div className="brief-content">
          <section className="surface">
            <span className="section-kicker">
              <ClipboardList size={18} />
              EL ENCARGO
            </span>
            <h2>Bienvenido al equipo de Nube</h2>
            <p>
              Nube es una tienda ficticia de accesorios. El equipo agregó un cupón y una promoción
              de envío gratis. Necesita una revisión funcional del flujo de compra antes de
              publicarlos.
            </p>
            <p>
              Vas a leer los requisitos, preparar casos de prueba y documentar hallazgos de forma
              que otro integrante del equipo pueda reproducirlos.
            </p>
            <div className="notice">
              <FlaskConical size={21} />
              <p>
                Es una simulación. No trabajarás para una empresa real ni harás pagos. Los datos y
                los pedidos son ficticios.
              </p>
            </div>
          </section>
          <section className="surface">
            <span className="section-kicker">
              <FileText size={18} />
              LO QUE DEBE FUNCIONAR
            </span>
            <h2>El equipo te deja estos requisitos</h2>
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
          </section>
          <section className="surface">
            <span className="section-kicker">
              <Lightbulb size={18} />
              ANTES DE EMPEZAR
            </span>
            <h2>No necesitas saber programar</h2>
            <p>
              Te basta un navegador, curiosidad y atención a los detalles. Prueba los casos
              habituales y los límites: cantidades, descuentos, umbrales y entradas inválidas.
            </p>
            <p>
              Puedes utilizar IA como apoyo. Explica tus decisiones y verifica cada hallazgo en el
              simulador; una respuesta generada no sustituye la prueba.
            </p>
            <a
              href="https://www.onetonline.org/link/summary/15-1253.00"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Conoce las tareas habituales del rol de QA <ExternalLink size={14} />
            </a>
          </section>
        </div>
        <aside className="brief-aside">
          <div className="surface sticky-card">
            <span className="aside-icon">
              <ShieldCheck size={29} />
            </span>
            <h2>Un primer proyecto con evidencia</h2>
            <ul className="check-list">
              {activity.deliverables.map((text) => (
                <li key={text}>
                  <span>
                    <Check size={13} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p>
              Recibirás una revisión de estructura con una rúbrica. Tu entrega es una práctica, no
              una certificación ni experiencia contratada.
            </p>
            <StartButton />
            <Link href="/simulador/" className={buttonVariants({ variant: "secondary" })}>
              Conocer la tienda <ArrowRight size={16} />
            </Link>
            <span className="aside-footnote">Empieza sin crear una cuenta.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
