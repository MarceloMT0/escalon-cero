import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Un primer paso que puedes mostrar.</span>
      <div>
        <Link href="/acerca/">
          Sobre el proyecto <ArrowUpRight size={14} />
        </Link>
        <span>Hecho para empezar · Escalón Cero</span>
      </div>
    </footer>
  );
}
