import Link from "next/link";
import { ArrowRight, BarChart3, Code2, Database, Megaphone, PenLine } from "lucide-react";
import { areas } from "@/content/catalog";
const icons = {
  code: Code2,
  database: Database,
  pen: PenLine,
  megaphone: Megaphone,
  chart: BarChart3,
};
export function AreaGrid({ all = false }: { all?: boolean }) {
  return (
    <div className="area-grid">
      {(all ? areas : areas.slice(0, 3)).map((area) => {
        const Icon = icons[area.icon];
        const content = (
          <>
            <span className="area-icon">
              <Icon size={23} />
            </span>
            <div>
              <strong>{area.title}</strong>
              <span className="area-description">{area.description}</span>
            </div>
            {area.available ? (
              <ArrowRight size={19} className="area-arrow" />
            ) : (
              <span className="coming-badge">Próximamente</span>
            )}
          </>
        );
        return area.available ? (
          <Link href="/explorar/" className="area-card available" key={area.id}>
            {content}
          </Link>
        ) : (
          <div className="area-card unavailable" key={area.id}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
