import type { CatalogActivity } from "../../content/catalog";

export const durationOptions = [
  { value: "short", label: "Menos de 1 hora" },
  { value: "medium", label: "De 1 a 3 horas" },
  { value: "long", label: "Más de 3 horas" },
] as const;
export type CatalogFilters = {
  query: string;
  area: string;
  role: string;
  topic: string;
  level: string;
  duration: "" | (typeof durationOptions)[number]["value"];
};
export const emptyFilters: CatalogFilters = {
  query: "",
  area: "",
  role: "",
  topic: "",
  level: "",
  duration: "",
};
export const normalize = (text: string) =>
  text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function filterActivities(items: readonly CatalogActivity[], filters: CatalogFilters) {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    const searchable = normalize(
      [
        item.title,
        item.shortTitle,
        item.area,
        item.role,
        item.description,
        ...item.topics,
        ...item.skills,
      ].join(" "),
    );
    const minutes = item.durationMinutes;
    return (
      terms.every((term) => searchable.includes(term)) &&
      (!filters.area || item.areaId === filters.area) &&
      (!filters.role || item.roleId === filters.role) &&
      (!filters.topic || item.topics.includes(filters.topic)) &&
      (!filters.level || item.level === filters.level) &&
      (!filters.duration ||
        (filters.duration === "short" && minutes < 60) ||
        (filters.duration === "medium" && minutes >= 60 && minutes <= 180) ||
        (filters.duration === "long" && minutes > 180))
    );
  });
}
