import { test } from "node:test";
import assert from "node:assert/strict";
const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};
const { addOrder, orders } = await import("../data/orders.js");
test("orders persist newest first and reject duplicates", () => {
  const order = {
    id: "one",
    orderTime: new Date().toISOString(),
    totalCostCents: 1000,
    products: [],
  };
  addOrder(order);
  addOrder({ ...order, id: "two" });
  assert.deepEqual(
    orders.map((o) => o.id),
    ["two", "one"],
  );
  assert.equal(JSON.parse(values.get("ecom.orders"))[0].id, "two");
  assert.throws(() => addOrder(order), /duplicate/);
});
test("a failed storage write does not claim an order was saved", () => {
  localStorage.setItem = () => {
    throw new Error("Storage full");
  };
  assert.throws(() => addOrder({ id: "three", products: [] }), /Storage full/);
  assert.equal(orders.length, 2);
});
