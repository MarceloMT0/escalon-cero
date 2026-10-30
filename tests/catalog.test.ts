import assert from "node:assert/strict";
import test from "node:test";
import { activity, type CatalogActivity } from "../src/content/catalog";
import { readSearchFilters, searchCatalog, searchUrl } from "../src/features/catalog/search";
import { emptyFilters, filterActivities } from "../src/features/catalog/filter";

// Synthetic fixtures verify boundaries, not additional published activities.
const sample: CatalogActivity[] = [59, 60, 180, 181].map((minutes) => ({
  ...activity,
  id: String(minutes),
  durationMinutes: minutes,
}));
test("duration buckets have no gaps or overlapping boundaries", () => {
  for (const [duration, ids] of [
    ["short", ["59"]],
    ["medium", ["60", "180"]],
    ["long", ["181"]],
  ] as const) {
    assert.deepEqual(
      filterActivities(sample, { ...emptyFilters, duration }).map((item) => item.id),
      ids,
    );
  }
});
test("search ignores accents, case and extra spaces and matches all words", () => {
  assert.equal(
    filterActivities([activity], { ...emptyFilters, query: "  CRITICO   COMPRA  " }).length,
    1,
  );
  assert.equal(
    filterActivities([activity], { ...emptyFilters, query: "compra inexistente" }).length,
    0,
  );
});
test("all filters intersect and clearing restores the collection", () => {
  const filters = {
    ...emptyFilters,
    query: "tienda",
    topic: "Casos de prueba",
    level: "Inicial",
    duration: "medium",
  } as const;
  assert.equal(filterActivities([activity], filters).length, 1);
  assert.equal(filterActivities([activity], { ...filters, topic: "Otro tema" }).length, 0);
  assert.equal(filterActivities([activity], { ...filters, level: "Otro nivel" }).length, 0);
  assert.equal(filterActivities([activity], { ...filters, duration: "short" }).length, 0);
  assert.deepEqual(filterActivities([activity], emptyFilters), [activity]);
});

test("global search returns areas, roles and activities without activating upcoming content", () => {
  assert.deepEqual(
    [...new Set(searchCatalog("QA").map((entry) => entry.kind))],
    ["Áreas", "Roles", "Actividades"],
  );
  assert.ok(searchCatalog("  DISENO ").some((entry) => entry.id === "area-diseno"));
  assert.equal(searchCatalog("Frontend").find((entry) => entry.kind === "Roles")?.href, null);
  assert.equal(searchCatalog("<script>alert(1)</script>").length, 0);
  assert.equal(filterActivities([activity], { ...emptyFilters, query: "software QA" }).length, 1);
  assert.equal(filterActivities([activity], { ...emptyFilters, area: "datos" }).length, 0);
  assert.equal(filterActivities([activity], { ...emptyFilters, role: "frontend" }).length, 0);
});
test("filter URLs round-trip text and validate unsupported or incompatible facets", () => {
  const filters = {
    ...emptyFilters,
    query: "diseño & pruebas?",
    area: "software",
    role: "qa",
    topic: "Casos de prueba",
    duration: "medium",
  } as const;
  assert.deepEqual(
    readSearchFilters(new URL(searchUrl(filters), "https://example.test").searchParams),
    filters,
  );
  const invalid = readSearchFilters(
    new URLSearchParams("area=datos&role=qa&duration=bogus&level=bogus&topic=bogus"),
  );
  assert.equal(invalid.area, "datos");
  assert.equal(invalid.role, "");
  assert.equal(invalid.duration, "");
  assert.equal(invalid.topic, "");
  assert.equal(invalid.level, "");
  assert.equal(readSearchFilters(new URLSearchParams({ q: "x".repeat(200) })).query.length, 160);
});
