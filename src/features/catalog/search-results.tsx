"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, FolderOpen, MoveHorizontal, Search, SlidersHorizontal, X } from "lucide-react";
import { activities, areas, softwareRoles } from "@/content/catalog";
import { ActivityCard } from "@/components/activity-card";
import { durationOptions, emptyFilters, filterActivities, type CatalogFilters } from "./filter";
import { readSearchFilters, searchCatalog, searchUrl } from "./search";

const topics = [...new Set(activities.flatMap((item) => item.topics))];
const levels = [...new Set(activities.map((item) => item.level))];
export function SearchResults() {
  const params = useSearchParams();
  const filters = readSearchFilters(params);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [motion, setMotion] = useState(true);
  const matches = filterActivities(activities, filters);
  const roles = softwareRoles.filter((role) => !filters.area || role.areaId === filters.area);
  const hasFilters = Object.values(filters).some(Boolean);
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== "query" && value,
  ).length;
  const related = searchCatalog(filters.query).filter(
    (entry) =>
      entry.kind !== "Actividades" &&
      (!filters.area || entry.areaId === filters.area) &&
      (!filters.role || entry.roleId === filters.role),
  );
  const showRelated = !filters.topic && !filters.level && !filters.duration;
  const availableRelated = showRelated ? related.filter((entry) => entry.href) : [];
  const upcoming = showRelated ? related.filter((entry) => !entry.href) : [];
  function replace(next: CatalogFilters) {
    window.history.replaceState(null, "", searchUrl(next));
  }
  function update<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    const next = { ...filters, [key]: value };
    if (
      key === "area" &&
      !softwareRoles.some((role) => role.id === next.role && (!value || role.areaId === value))
    )
      next.role = "";
    replace(next);
  }
  const chips = [
    { key: "area", label: areas.find((area) => area.id === filters.area)?.title },
    { key: "role", label: softwareRoles.find((role) => role.id === filters.role)?.title },
    { key: "topic", label: filters.topic },
    { key: "level", label: filters.level },
    {
      key: "duration",
      label: durationOptions.find((option) => option.value === filters.duration)?.label,
    },
  ] as const;
  return (
    <div className="search-workspace" data-motion={motion ? "on" : "off"}>
      <form
        role="search"
        className="global-search-form results-search-form"
        aria-label="Buscar en todo el catálogo"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search size={22} aria-hidden="true" />
        <input
          type="search"
          maxLength={160}
          aria-label="Buscar en todo el catálogo"
          placeholder="Área, rol, tema o actividad…"
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
        />
        {filters.query ? (
          <button
            className="search-clear"
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => update("query", "")}
          >
            <X size={20} aria-hidden="true" />
          </button>
        ) : null}
      </form>
      <div className="search-tools">
        <button
          type="button"
          className="search-filter-toggle"
          aria-expanded={filtersOpen}
          aria-controls="search-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={18} aria-hidden="true" /> Filtros{" "}
          {activeCount ? `(${activeCount})` : ""}
        </button>
        <button
          type="button"
          className="search-motion"
          aria-pressed={!motion}
          onClick={() => setMotion(!motion)}
        >
          <MoveHorizontal size={16} aria-hidden="true" />
          {motion ? "Reducir movimiento" : "Activar movimiento"}
        </button>
      </div>
      <div className="search-layout">
        <aside
          className="search-filter-sheet"
          id="search-filters"
          data-open={filtersOpen}
          aria-label="Filtros de actividades"
        >
          <div className="search-filter-heading">
            <span>
              <SlidersHorizontal size={17} aria-hidden="true" /> Filtrar archivo
            </span>
            <span className="search-folder-marker" aria-hidden="true" />
          </div>
          <label className="catalog-filter-field">
            Área
            <select value={filters.area} onChange={(e) => update("area", e.target.value)}>
              <option value="">Todas las áreas</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.title}
                  {area.available ? "" : " · Próximamente"}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-filter-field">
            Rol
            <select
              value={filters.role}
              onChange={(e) => update("role", e.target.value)}
              disabled={!roles.length}
            >
              <option value="">Todos los roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                  {role.available ? "" : " · Próximamente"}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-filter-field">
            Tema
            <select value={filters.topic} onChange={(e) => update("topic", e.target.value)}>
              <option value="">Todos los temas</option>
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </label>
          <label className="catalog-filter-field">
            Nivel
            <select value={filters.level} onChange={(e) => update("level", e.target.value)}>
              <option value="">Todos los niveles</option>
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <label className="catalog-filter-field">
            Duración
            <select
              value={filters.duration}
              onChange={(e) => update("duration", e.target.value as CatalogFilters["duration"])}
            >
              <option value="">Cualquier duración</option>
              {durationOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="catalog-filter-reset"
            disabled={!hasFilters}
            onClick={() => replace(emptyFilters)}
          >
            Limpiar filtros
          </button>
        </aside>
        <div className="search-result-content">
          {activeCount ? (
            <div className="search-chips" aria-label="Filtros activos">
              {chips.map((chip) =>
                chip.label ? (
                  <button
                    type="button"
                    key={chip.key}
                    onClick={() => update(chip.key, "")}
                    aria-label={`Quitar filtro: ${chip.label}`}
                  >
                    {chip.label}
                    <X size={14} aria-hidden="true" />
                  </button>
                ) : null,
              )}
            </div>
          ) : null}
          <div className="search-result-heading">
            <h2>Actividades</h2>
            <span role="status" aria-atomic="true">
              {matches.length} {matches.length === 1 ? "disponible" : "disponibles"}
            </span>
          </div>
          <div
            className="search-activity-list"
            key={matches.map((item) => item.id).join(",") || "empty"}
          >
            {matches.length ? (
              matches.map((item) => <ActivityCard activity={item} compact key={item.id} />)
            ) : (
              <div className="search-empty">
                <Search size={30} aria-hidden="true" />
                <h3>Sin actividades con estos filtros</h3>
                <p>
                  {upcoming.length
                    ? "Este contenido está en preparación."
                    : "Prueba otra búsqueda o amplía los filtros."}
                </p>
                <button type="button" className="text-link" onClick={() => replace(emptyFilters)}>
                  Ver todas las actividades
                </button>
              </div>
            )}
          </div>
          {availableRelated.length ? (
            <div className="search-related">
              {(["Áreas", "Roles"] as const).map((kind) => {
                const entries = availableRelated.filter((entry) => entry.kind === kind);
                return entries.length ? (
                  <section key={kind} aria-label={kind}>
                    <h2>{kind}</h2>
                    {entries.map((entry) => (
                      <Link className="search-directory-link" href={entry.href!} key={entry.id}>
                        <FolderOpen size={22} aria-hidden="true" />
                        <span>{entry.title}</span>
                        <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                    ))}
                  </section>
                ) : null;
              })}
            </div>
          ) : null}
          {upcoming.length ? (
            <section className="search-upcoming" aria-labelledby="upcoming-title">
              <h2 id="upcoming-title">Próximamente</h2>
              <div>
                {upcoming.map((entry) => (
                  <span key={entry.id}>
                    {entry.title}
                    <small>{entry.kind === "Áreas" ? "Área" : "Rol"}</small>
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
