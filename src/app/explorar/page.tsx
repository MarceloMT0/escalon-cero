import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { activities, softwareRoles } from "@/content/catalog";
import "./catalog-hierarchy.css";
export const metadata: Metadata = { title: "Ingeniería de software · Roles" };
export default function ExplorePage() {
  return (
    <div className="page-container internal-page role-directory">
      <nav className="catalog-breadcrumb" aria-label="Ruta de navegación">
        <Link href="/">Áreas</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Ingeniería de software</span>
      </nav>
      <span className="quiet-eyebrow">ÁREA DE PRÁCTICA</span>
      <h1>Ingeniería de software</h1>
      <p className="page-intro">Elige un rol y explora sus actividades.</p>
      <h2 className="role-directory-heading">Roles de esta área</h2>
      <div className="role-directory-grid">
        {softwareRoles.map((role) => (
          <article className="role-directory-card" key={role.id}>
            <FolderOpen size={32} aria-hidden="true" />
            <h3>{role.title}</h3>
            <p>{role.description}</p>
            {role.available ? (
              <>
                <span className="role-availability">
                  {activities.filter((item) => item.role === role.title).length} actividad
                  disponible hoy
                </span>
                <Link className="button button-primary" href={role.href}>
                  Ver actividades de QA <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <span className="coming-badge">Próximamente</span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
