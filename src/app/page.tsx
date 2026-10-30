import { GlobalSearch } from "@/features/catalog/global-search";
import { PracticeArchive } from "@/components/practice-archive";
import "./archive-home.css";

export default function HomePage() {
  return (
    <div className="archive-home">
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
