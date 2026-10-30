import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { footerGroups } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-identity">
          <Link href="/" className="footer-brand" aria-label="Escalón Cero: volver al inicio">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              escalón cero<span className="brand-dot">.</span>
            </span>
          </Link>
          <p>Prácticas simuladas para dar tus primeros pasos profesionales.</p>
          <span className="footer-project-label">
            <span aria-hidden="true" /> DSC HACK 2026
          </span>
        </div>
        {footerGroups.map((group) => (
          <nav
            className="footer-column"
            aria-label={`${group.title}: pie de página`}
            key={group.title}
          >
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 Escalón Cero</span>
        <p>Simulaciones educativas. No equivalen a empleo ni certificación.</p>
        <div className="footer-utilities">
          <a
            href="https://github.com/MarceloMT0/escalon-cero"
            target="_blank"
            rel="noopener noreferrer"
          >
            Código del proyecto <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
          <a href="#contenido" className="footer-back-top">
            Volver arriba <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
