"use client";
import { useState } from "react";
import { Search, LockKeyhole, SlidersHorizontal } from "lucide-react";
import { activity, roleOptions } from "@/content/catalog";
import { ActivityCard } from "@/components/activity-card";
import { AreaGrid } from "@/components/area-grid";

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("Todos los roles");
  const normalized = query
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const matches =
    (role === "Todos los roles" || role === activity.role) &&
    `${activity.title} ${activity.role} ${activity.area} ${activity.skills.join(" ")}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(normalized);
  return (
    <>
      <div className="catalog-controls">
        <label className="search-field">
          <Search size={20} />
          <input
            aria-label="Buscar actividades"
            placeholder="¿Qué te gustaría practicar?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="select-label">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Filtrar por rol</span>
          <select
            aria-label="Filtrar por rol"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roleOptions.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="section-heading catalog-count">
        <span role="status">
          {matches ? "1 actividad disponible" : "Sin actividades disponibles con estos filtros"}
        </span>
        <span className="muted">Ingeniería de software · Nivel inicial</span>
      </div>
      <div className="catalog-grid">
        {matches ? (
          <ActivityCard compact />
        ) : (
          <div className="empty-state">
            <Search size={30} />
            <h2>Aún no hay una práctica para esta búsqueda</h2>
            <p>Prueba con «QA» o explora los próximos roles.</p>
            <button
              className="text-link"
              onClick={() => {
                setQuery("");
                setRole("Todos los roles");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
        {["Frontend", "Backend"]
          .filter((value) => role === "Todos los roles" || role === value)
          .map((value) => (
            <article className="coming-card" key={value}>
              <div className="coming-art">
                <span>{value === "Frontend" ? "</>" : "{ }"}</span>
                <LockKeyhole size={22} />
              </div>
              <span className="coming-badge">Próximamente</span>
              <h2>{value}</h2>
              <p>
                {value === "Frontend"
                  ? "Interfaces, accesibilidad y experiencias en la web."
                  : "APIs, datos y lógica detrás de cada producto."}
              </p>
              <span className="muted">Estamos preparando nuevas actividades.</span>
            </article>
          ))}
      </div>
      <section className="catalog-areas">
        <div className="section-heading">
          <h2>Otras formas de empezar</h2>
        </div>
        <AreaGrid all />
      </section>
    </>
  );
}
