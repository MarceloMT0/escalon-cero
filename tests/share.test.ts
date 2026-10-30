import { test } from "node:test";
import assert from "node:assert/strict";
import { encodePortfolio, decodePortfolio } from "../src/features/portfolio/share";
import type { SharedPortfolio } from "../src/features/practice/model";

test("a portable share round-trips Spanish text without HTML execution", () => {
  const portfolio: SharedPortfolio = {
    version: 1,
    name: "Práctica de Lucía",
    summary: "Aprendí QA y análisis",
    activityId: "qa-tienda",
    date: "2026-10-29T20:00:00Z",
    cases: [],
    reports: [],
    reflection: "<script>alert('no se ejecuta')</script>",
  };
  const encoded = encodePortfolio(portfolio);
  assert.deepEqual(decodePortfolio(encoded), portfolio);
  assert.equal(/[&#?/]/.test(encoded), false);
});
test("shares reject malformed, unsupported and oversized input", () => {
  assert.equal(decodePortfolio(""), null);
  assert.equal(decodePortfolio("%not-a-project%"), null);
  assert.equal(decodePortfolio("a".repeat(20001)), null);
});
