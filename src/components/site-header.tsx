"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { AccountDialog } from "./account-dialog";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <header className="site-header">
        <nav aria-label="Navegación principal">
          {[
            {
              href: "/",
              label: "Explorar",
              active:
                pathname === "/" ||
                pathname.startsWith("/explorar") ||
                pathname.startsWith("/buscar") ||
                pathname.startsWith("/actividad"),
            },
            {
              href: "/practica/",
              label: "Mi práctica",
              active: pathname.startsWith("/practica") || pathname.startsWith("/simulador"),
            },
            {
              href: "/portafolio/",
              label: "Mi portafolio",
              active: pathname.startsWith("/portafolio") || pathname.startsWith("/compartir"),
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.active ? "active" : ""}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/buscar/" aria-label="Buscar actividades" className="header-search">
            <Search size={20} />
          </Link>
          <AccountDialog />
        </div>
      </header>
    </>
  );
}
