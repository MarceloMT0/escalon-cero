"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, FolderPlus, ArrowUpRight } from "lucide-react";
import { activities } from "@/content/catalog";
import { ActivityCard } from "@/components/activity-card";
import { emptyFilters, filterActivities } from "./filter";

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const matches = filterActivities(activities, { ...emptyFilters, role: "qa", query });
  return (
    <>
      <div className="catalog-controls">
        <label className="search-field">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            aria-label="Buscar actividades"
            placeholder="Buscar dentro de QA"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Link href="/buscar/?role=qa" className="catalog-global-link">
          Abrir catálogo con filtros <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className="section-heading catalog-count">
        <h2>Actividades de QA</h2>
        <span role="status">
          {matches.length}{" "}
          {matches.length === 1 ? "actividad disponible" : "actividades disponibles"}
        </span>
      </div>
      <div className="qa-activity-grid">
        {matches.length ? (
          matches.map((item) => <ActivityCard compact activity={item} key={item.id} />)
        ) : (
          <div className="empty-state">
            <Search size={30} aria-hidden="true" />
            <h2>Sin actividades con esta búsqueda</h2>
            <button type="button" className="text-link" onClick={() => setQuery("")}>
              Limpiar búsqueda
            </button>
            <Link href="/buscar/" className="text-link">
              Buscar en todas las áreas
            </Link>
          </div>
        )}
        {!query.trim() ? (
          <aside className="catalog-next-activities">
            <FolderPlus size={32} aria-hidden="true" />
            <h2>Más actividades de QA</h2>
            <span className="coming-badge">Próximamente</span>
          </aside>
        ) : null}
      </div>
    </>
  );
}
