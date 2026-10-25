import { test } from "node:test";
import assert from "node:assert/strict";
import { submitOrder } from "../data/order-service.js";

test("order submission sends a cart snapshot and checks the API response", async () => {
  const originalFetch = globalThis.fetch;
  const cart = [{ productId: "a", quantity: 2, deliveryOptionId: "2" }];
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://supersimplebackend.dev/orders");
      assert.equal(options.method, "POST");
      assert.deepEqual(JSON.parse(options.body), { cart });
      return { ok: true, json: async () => ({ id: "demo-order" }) };
    };
    const order = await submitOrder(cart, 5000);
    assert.equal(order.id, "demo-order");
    assert.equal(order.totalCostCents, 5000);
    assert.equal(order.products[0].quantity, 2);
    assert.ok(
      Date.parse(order.products[0].estimatedDeliveryTime) >
        Date.parse(order.orderTime),
    );
    globalThis.fetch = async () => ({ ok: false });
    await assert.rejects(submitOrder(cart, 5000), /could not place/);
    globalThis.fetch = async () => ({ ok: true, json: async () => null });
    await assert.rejects(submitOrder(cart, 5000), /invalid order/);
    globalThis.fetch = async () => {
      throw new DOMException("Timed out", "TimeoutError");
    };
    await assert.rejects(submitOrder(cart, 5000), { name: "TimeoutError" });
    await assert.rejects(submitOrder([], 0), /empty/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
