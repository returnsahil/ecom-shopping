import { test } from "node:test";
import assert from "node:assert/strict";
const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};
const cart = await import("../data/cart.js");
test("cart lifecycle persists quantities and delivery choices", () => {
  cart.clearCart();
  cart.addToCart("socks", 2);
  cart.addToCart("socks", 3);
  assert.equal(cart.cartQuantity(), 5);
  cart.updateDeliveryOption("socks", "2");
  cart.updateQuantity("socks", 4);
  assert.deepEqual(JSON.parse(values.get("ecom.cart")), [
    { productId: "socks", quantity: 4, deliveryOptionId: "2" },
  ]);
  assert.throws(() => cart.updateQuantity("socks", 1.5), RangeError);
  assert.throws(() => cart.addToCart("socks", 99), RangeError);
  assert.throws(() => cart.updateDeliveryOption("socks", "bad"), RangeError);
  cart.removeFromCart("socks");
  assert.equal(cart.cartQuantity(), 0);
});
test("failed persistence does not silently change cart state", () => {
  const original = localStorage.setItem;
  localStorage.setItem = () => {
    throw new Error("Storage full");
  };
  assert.throws(() => cart.addToCart("test"), /Storage full/);
  assert.equal(cart.cartQuantity(), 0);
  localStorage.setItem = original;
});
test("malformed stored JSON starts an empty cart", async () => {
  values.set("ecom.cart", "{broken");
  const fresh = await import("../data/cart.js?invalid-json");
  assert.deepEqual(fresh.cart, []);
});
