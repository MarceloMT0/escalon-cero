import Link from "next/link";
import { ArrowRight, BarChart3, Check, Clock3, FlaskConical } from "lucide-react";
import { activity as defaultActivity, type CatalogActivity } from "@/content/catalog";
import { buttonVariants } from "./ui/button";

export function ActivityMeta({ activity = defaultActivity }: { activity?: CatalogActivity } = {}) {
  return (
    <div className="activity-meta">
      <span>
        <BarChart3 size={16} />
        {activity.level}
      </span>
      <span>
        <Clock3 size={16} />
        {activity.duration}
      </span>
      <span>
        <FlaskConical size={16} />
        Simulación laboral
      </span>
    </div>
  );
}
export function ActivityCard({
  compact = false,
  activity = defaultActivity,
}: {
  compact?: boolean;
  activity?: CatalogActivity;
}) {
  return (
    <article className={compact ? "activity-card catalog-card" : "activity-card featured-card"}>
      <span className="eyebrow lime-badge">Actividad disponible</span>
      <div className="role-label">
        <span className="role-symbol" aria-hidden="true">
          ✳
        </span>
        <strong>{activity.role}</strong>
        <span className="divider" />
        <span>{activity.area}</span>
      </div>
      <h2>{activity.title}</h2>
      <p>{activity.description}</p>
      <ActivityMeta activity={activity} />
      <div className="activity-card-bottom">
        <div>
          <span className="small-label">Entregables</span>
          <ul className="check-list">
            {activity.deliverables.map((text) => (
              <li key={text}>
                <span>
                  <Check size={13} strokeWidth={3} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <Link className={buttonVariants()} href={`/actividad/${activity.id}/`}>
          Ver actividad <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}
