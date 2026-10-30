"use client";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { searchCatalog, searchUrl } from "./search";
import "./search.css";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const matches = searchCatalog(query);
  const visible = open && Boolean(query.trim());
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      input.current?.focus();
      setOpen(false);
    }
    if (visible && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      const links = [...(panel.current?.querySelectorAll<HTMLAnchorElement>("a") || [])];
      if (!links.length) return;
      event.preventDefault();
      const index = links.indexOf(document.activeElement as HTMLAnchorElement);
      const next =
        event.key === "ArrowDown"
          ? (index + 1) % links.length
          : index <= 0
            ? links.length - 1
            : index - 1;
      links[next]?.focus();
    }
  }
  return (
    <div
      className="global-search"
      onKeyDown={keyboard}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <form
        className="global-search-form"
        role="search"
        aria-label="Buscar en todo el catálogo"
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(false);
          router.push(searchUrl({ query: query.trim() }));
        }}
      >
        <Search size={22} aria-hidden="true" />
        <input
          ref={input}
          type="search"
          name="q"
          maxLength={160}
          autoComplete="off"
          aria-label="Buscar áreas, roles o actividades"
          aria-describedby="search-keyboard-help"
          aria-controls={visible ? "global-suggestions" : undefined}
          placeholder="Buscar áreas, roles o actividades"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
        />
        <button type="submit" aria-label="Buscar en todo el catálogo">
          <span>Buscar</span>
          <ArrowRight size={21} aria-hidden="true" />
        </button>
      </form>
      <span id="search-keyboard-help" className="sr-only">
        Enter para ver todos los resultados. Usa Tab o las flechas para recorrer sugerencias y
        Escape para cerrarlas.
      </span>
      {visible ? (
        <div
          ref={panel}
          id="global-suggestions"
          className="search-suggestions"
          role="region"
          aria-label="Sugerencias de búsqueda"
        >
          <span className="sr-only" role="status">
            {matches.length} coincidencias. Sugerencias por área, rol y actividad.
          </span>
          {(["Áreas", "Roles", "Actividades"] as const).map((kind) => {
            const entries = matches.filter((entry) => entry.kind === kind).slice(0, 3);
            return entries.length ? (
              <section className="suggestion-group" key={kind} aria-label={kind}>
                <h2>{kind}</h2>
                {entries.map((entry) =>
                  entry.href ? (
                    <Link
                      href={entry.href}
                      key={entry.id}
                      className="suggestion-item"
                      onClick={() => setOpen(false)}
                    >
                      <span>{entry.title}</span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  ) : (
                    <div className="suggestion-item suggestion-upcoming" key={entry.id}>
                      <span>{entry.title}</span>
                      <span>Próximamente</span>
                    </div>
                  ),
                )}
              </section>
            ) : null;
          })}
          {!matches.length ? (
            <p className="suggestions-empty">Sin coincidencias. Prueba con otra palabra.</p>
          ) : null}
          <Link className="search-all" href={searchUrl({ query: query.trim() })}>
            Ver todos los resultados <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : null}
      <Link className="search-browse-all" href="/buscar/">
        Ver todas las actividades <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
