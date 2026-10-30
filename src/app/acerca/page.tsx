import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
export const metadata: Metadata = { title: "Sobre el proyecto" };
export default function AboutPage() {
  return (
    <div className="page-container internal-page about-page">
      <span className="quiet-eyebrow">EDUCACIÓN 2036 · DSC HACK 2026</span>
      <h1>
        El primer escalón también se puede <em>construir.</em>
      </h1>
      <p className="page-intro">
        Una oportunidad de practicar el trabajo antes de conseguir tu primer empleo.
      </p>
      <div className="surface prose">
        <h2>Del conocimiento a una evidencia</h2>
        <p>
          Escalón Cero transforma tareas habituales de un rol junior en actividades de práctica: un
          contexto, un encargo, herramientas, requisitos y una entrega. El estudiante puede mostrar
          tanto su resultado como las decisiones que tomó.
        </p>
        <p>
          Este MVP empieza con QA de software. La tienda y su empresa son ficticias; la práctica
          está inspirada en responsabilidades del rol. No representa un encargo pagado, un empleo o
          una certificación profesional.
        </p>
        <h2>Una respuesta que queremos poner a prueba</h2>
        <p>
          El proyecto se ubica en la transición entre educación y primer empleo. Nuestra hipótesis
          es que practicar tareas con contexto y documentarlas puede ayudar a explicar mejor las
          habilidades de una persona que aún no tiene experiencia contratada.
        </p>
        <p>
          La automatización hace relevante revisar cómo se aprenden las tareas iniciales. La
          evidencia debe leerse con contexto: exposición a IA no equivale a pérdida de empleo, y
          resultados de otros países no se trasladan automáticamente al Perú.
        </p>
        <h3>Referencias para entender el problema y el rol</h3>
        <ul>
          <li>
            <a
              href="https://www.onetonline.org/link/summary/15-1253.00"
              target="_blank"
              rel="noopener noreferrer"
            >
              O*NET: tareas de analistas y testers de calidad de software <ExternalLink size={14} />
            </a>
          </li>
          <li>
            <a
              href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/"
              target="_blank"
              rel="noopener noreferrer"
            >
              World Economic Forum: The Future of Jobs Report 2025 <ExternalLink size={14} />
            </a>
          </li>
          <li>
            <a
              href="https://www.gob.pe/institucion/mtpe/informes-publicaciones/7490464-informe-de-demanda-de-ocupaciones-en-peru-2026-edo"
              target="_blank"
              rel="noopener noreferrer"
            >
              MTPE: informe de demanda de ocupaciones en Perú 2026 <ExternalLink size={14} />
            </a>
          </li>
        </ul>
        <h2>Tu trabajo y tus datos</h2>
        <p>
          Sin una cuenta conectada, los textos se conservan en el almacenamiento local del navegador
          y los archivos en IndexedDB. Borrar esos datos elimina la copia local. Si la
          sincronización está activada, puedes crear una cuenta y guardar una copia privada de la
          práctica.
        </p>
        <p>
          El portafolio compartible incluye los textos que confirmes, dentro de un enlace. No
          incluye los archivos de evidencia. Es una copia que puede conservar quien la reciba, por
          lo que debes evitar datos personales o información confidencial.
        </p>
        <p>No se realizan pagos en la tienda. Utiliza únicamente datos ficticios.</p>
        <Link href="/actividad/qa-tienda/" className={buttonVariants()}>
          Conocer la primera práctica <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
