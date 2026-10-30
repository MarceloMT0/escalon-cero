import { activities, areas, softwareRoles } from "../../content/catalog";
import { durationOptions, emptyFilters, normalize, type CatalogFilters } from "./filter";

export type SearchEntry = {
  id: string;
  title: string;
  description: string;
  kind: "Áreas" | "Roles" | "Actividades";
  areaId: string;
  roleId?: string;
  href: string | null;
};
export const searchEntries: SearchEntry[] = [
  ...areas.map((area) => ({
    id: `area-${area.id}`,
    title: area.title,
    description: area.description,
    kind: "Áreas" as const,
    areaId: area.id,
    href: area.available ? "/explorar/" : null,
  })),
  ...softwareRoles.map((role) => ({
    id: `role-${role.id}`,
    title: role.title,
    description: role.description,
    kind: "Roles" as const,
    areaId: role.areaId,
    roleId: role.id,
    href: role.href,
  })),
  ...activities.map((item) => ({
    id: `activity-${item.id}`,
    title: item.title,
    description: [
      item.shortTitle,
      item.area,
      item.role,
      item.description,
      ...item.topics,
      ...item.skills,
    ].join(" "),
    kind: "Actividades" as const,
    areaId: item.areaId,
    roleId: item.roleId,
    href: `/actividad/${item.id}/`,
  })),
];
export function searchCatalog(query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return searchEntries.filter((entry) =>
    terms.every((term) => normalize(`${entry.title} ${entry.description}`).includes(term)),
  );
}
export function searchUrl(filters: Partial<CatalogFilters> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key === "query" ? "q" : key, value);
  }
  return `/buscar/${params.size ? `?${params}` : ""}`;
}
export function readSearchFilters(params: Pick<URLSearchParams, "get">): CatalogFilters {
  const area = areas.find((item) => item.id === params.get("area"))?.id || "";
  const role =
    softwareRoles.find((item) => item.id === params.get("role") && (!area || item.areaId === area))
      ?.id || "";
  const topic =
    activities.flatMap((item) => item.topics).find((item) => item === params.get("topic")) || "";
  const level = activities.find((item) => item.level === params.get("level"))?.level || "";
  const duration =
    durationOptions.find((item) => item.value === params.get("duration"))?.value || "";
  return {
    ...emptyFilters,
    query: (params.get("q") || "").slice(0, 160),
    area,
    role,
    topic,
    level,
    duration,
  };
}
