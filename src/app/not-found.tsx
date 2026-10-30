import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="page-container internal-page">
      <div className="empty-practice surface">
        <span className="quiet-eyebrow">404 · UN PASO FUERA DEL CAMINO</span>
        <h1>Por aquí todavía no hay una actividad.</h1>
        <p>Vuelve al catálogo y encuentra tu siguiente paso.</p>
        <Link href="/explorar/" className={buttonVariants()}>
          Explorar actividades
        </Link>
      </div>
    </div>
  );
}
