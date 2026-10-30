import Link from "next/link";
import { GlobalSearch } from "@/features/catalog/global-search";
import { PracticeArchive } from "@/components/practice-archive";
import "./archive-home.css";

export default function HomePage() {
  return (
    <div className="archive-home">
      <aside className="archive-spine" aria-label="Escalón Cero">
        <Link href="/" aria-label="Escalón Cero, inicio">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="archive-wordmark">escalón cero.</span>
        </Link>
        <span className="spine-caption">
          Archivo de
          <br />
          prácticas.
        </span>
      </aside>
      <div className="archive-content">
        <header className="archive-intro">
          <h1>
            Tu experiencia
            <br />
            empieza haciendo.
          </h1>
          <GlobalSearch />
        </header>
        <PracticeArchive />
      </div>
    </div>
  );
}
