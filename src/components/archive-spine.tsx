import Link from "next/link";

export function ArchiveSpine() {
  return (
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
  );
}
