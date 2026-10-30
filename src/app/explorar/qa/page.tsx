import type { Metadata } from "next";
import Link from "next/link";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import "../catalog-hierarchy.css";
import "@/features/catalog/search.css";
export const metadata: Metadata = { title: "QA / Testing · Actividades" };
export default function QaCatalogPage() {
  return (
    <div className="page-container internal-page qa-catalog">
      <nav className="catalog-breadcrumb" aria-label="Ruta de navegación">
        <Link href="/">Áreas</Link>
        <span aria-hidden="true">/</span>
        <Link href="/explorar/">Ingeniería de software</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">QA / Testing</span>
      </nav>
      <span className="quiet-eyebrow">CATÁLOGO DEL ROL</span>
      <h1>QA / Testing</h1>
      <p className="page-intro">Pruebas, casos y reportes. Elige qué practicar.</p>
      <CatalogExplorer />
    </div>
  );
}
