"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Code2,
  Database,
  Megaphone,
  PenLine,
  MoveHorizontal,
} from "lucide-react";
import { areas } from "@/content/catalog";

const icons = {
  code: Code2,
  database: Database,
  pen: PenLine,
  megaphone: Megaphone,
  chart: BarChart3,
};

export function PracticeArchive() {
  const [opened, setOpened] = useState<string | null>("software");
  const [motion, setMotion] = useState(true);

  return (
    <section
      className="practice-archive"
      aria-labelledby="archive-title"
      data-motion={motion ? "on" : "off"}
    >
      <div className="archive-toolbar">
        <h2 id="archive-title">Áreas de práctica</h2>
        <button
          type="button"
          className="archive-motion"
          aria-pressed={!motion}
          onClick={() => setMotion((value) => !value)}
        >
          <MoveHorizontal size={16} aria-hidden="true" />
          {motion ? "Reducir movimiento" : "Activar movimiento"}
        </button>
      </div>
      <div className="archive-folders">
        {areas.map((area, index) => {
          const Icon = icons[area.icon];
          const expanded = opened === area.id;
          return (
            <article
              key={area.id}
              className="archive-folder"
              data-open={expanded}
              data-available={area.available}
            >
              <div className="folder-paper" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <button
                type="button"
                className="folder-toggle"
                id={`folder-${area.id}`}
                aria-label={`${area.title}${area.available ? "" : ", próximamente"}`}
                aria-expanded={expanded}
                aria-controls={`folder-panel-${area.id}`}
                onClick={() => setOpened(expanded ? null : area.id)}
              >
                <span className="folder-tab">
                  <span className="folder-marker" />
                  {area.archiveLabel}
                </span>
                <span className="folder-closed-content">
                  <Icon size={38} strokeWidth={1.4} aria-hidden="true" />
                  <strong>{area.archiveLabel}</strong>
                  <span className="folder-rule" />
                  <span>{area.available ? "Disponible" : "Próximamente"}</span>
                </span>
              </button>
              <div
                id={`folder-panel-${area.id}`}
                role="region"
                aria-labelledby={`folder-${area.id}`}
                className="folder-panel"
                hidden={!expanded}
              >
                <Icon className="folder-main-icon" size={54} strokeWidth={1.3} aria-hidden="true" />
                <h3>{area.available ? "Explora sus roles." : area.title}</h3>
                <p>{area.available ? "QA, Frontend y Backend." : area.description}</p>
                {area.available ? (
                  <Link
                    href="/explorar/"
                    className="folder-action"
                    aria-label="Explorar Ingeniería de software"
                  >
                    Ver roles <ArrowRight size={22} aria-hidden="true" />
                  </Link>
                ) : (
                  <div className="folder-coming">
                    <strong>Próximamente</strong>
                  </div>
                )}
              </div>
              <span className="folder-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          );
        })}
      </div>
      <div className="archive-footnote">
        <span>Áreas → Roles → Actividades</span>
        <span>Sin experiencia previa · A tu ritmo</span>
      </div>
    </section>
  );
}
