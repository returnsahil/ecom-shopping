import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTotals } from "../scripts/checkout/totals.js";
import { formatCurrency } from "../scripts/utils/money.js";
import { arrivalDate } from "../scripts/utils/dates.js";
const products = [
  { id: "a", priceCents: 1090 },
  { id: "b", priceCents: 2095 },
];
test("checkout uses integer cents and rounds tax once", () => {
  assert.deepEqual(
    calculateTotals(
      [
        { productId: "a", quantity: 2, deliveryOptionId: "1" },
        { productId: "b", quantity: 1, deliveryOptionId: "2" },
      ],
      products,
    ),
    { subtotal: 4275, shipping: 499, quantity: 3, tax: 477, total: 5251 },
  );
});
test("removal and delivery changes recalculate totals", () => {
  const item = { productId: "a", quantity: 2, deliveryOptionId: "1" };
  assert.equal(calculateTotals([item], products).total, 2398);
  assert.equal(
    calculateTotals([{ ...item, deliveryOptionId: "3" }], products).total,
    3497,
  );
  assert.equal(calculateTotals([], products).total, 0);
  assert.throws(
    () => calculateTotals([{ productId: "missing", quantity: 1 }], products),
    /unavailable/,
  );
});
test("currency and delivery dates handle boundaries", () => {
  assert.equal(formatCurrency(0), "0.00");
  assert.equal(formatCurrency(2095), "20.95");
  assert.equal(
    arrivalDate(3, new Date("2026-12-30T12:00:00Z")),
    "2027-01-02T12:00:00.000Z",
  );
});
