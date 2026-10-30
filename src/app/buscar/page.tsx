import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchResults } from "@/features/catalog/search-results";
import "../explorar/catalog-hierarchy.css";
import "@/features/catalog/search.css";
export const metadata: Metadata = { title: "Buscar actividades" };
export default function SearchPage() {
  return (
    <div className="page-container internal-page search-page">
      <nav className="catalog-breadcrumb" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Buscar</span>
      </nav>
      <span className="quiet-eyebrow">EL ARCHIVO COMPLETO</span>
      <h1>Tu próxima práctica.</h1>
      <Suspense
        fallback={
          <p className="search-loading" role="status">
            Cargando catálogo…
          </p>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
