import { test } from "node:test";
import assert from "node:assert/strict";
import {
  intendedOrder,
  simulatedOrder,
  simulatedEmailAccepted,
} from "../src/features/simulator/engine";

test("the ordinary one-unit flow matches the specification", () => {
  assert.deepEqual(simulatedOrder(1, 0), intendedOrder(1, false));
  assert.equal(simulatedOrder(1, 0).total, 92);
});
test("the intentional shipping defect is reproducible exactly at the boundary", () => {
  assert.equal(intendedOrder(2, false).shipping, 0);
  assert.equal(simulatedOrder(2, 0).shipping, 12);
  assert.deepEqual(simulatedOrder(3, 0), intendedOrder(3, false));
});
test("the repeated coupon defect is deterministic and bounded", () => {
  assert.equal(simulatedOrder(1, 1).discount, 8);
  assert.equal(simulatedOrder(1, 2).discount, 16);
  assert.equal(intendedOrder(1, true).discount, 8);
  assert.equal(simulatedOrder(1, 1000).total >= 0, true);
});
test("the weak email check is an intentional exercise, not authentication", () => {
  assert.equal(simulatedEmailAccepted("prueba"), false);
  assert.equal(simulatedEmailAccepted("prueba@"), true);
  assert.equal(simulatedEmailAccepted("prueba@ejemplo.com"), true);
});
