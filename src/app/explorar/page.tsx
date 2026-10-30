import type { Metadata } from "next";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
export const metadata: Metadata = { title: "Explora actividades" };
export default function ExplorePage() {
  return (
    <div className="page-container internal-page">
      <span className="quiet-eyebrow">ENCUENTRA TU PUNTO DE PARTIDA</span>
      <h1>
        ¿Qué quieres aprender <em>haciendo?</em>
      </h1>
      <p className="page-intro">
        Tareas de un rol junior. Contexto, herramientas y un resultado que puedes mostrar.
      </p>
      <CatalogExplorer />
    </div>
  );
}
