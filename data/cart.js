import { readStorage, writeStorage } from "../scripts/utils/storage.js";
const stored = readStorage("ecom.cart", []);
export let cart = Array.isArray(stored)
  ? stored
      .filter(
        (cartItem) =>
          cartItem &&
          typeof cartItem.productId === "string" &&
          Number.isInteger(cartItem.quantity) &&
          cartItem.quantity > 0 &&
          cartItem.quantity <= 99,
      )
      .map((cartItem) => ({
        ...cartItem,
        deliveryOptionId: ["1", "2", "3"].includes(cartItem.deliveryOptionId)
          ? cartItem.deliveryOptionId
          : "1",
      }))
  : [];
function persist(next) {
  writeStorage("ecom.cart", next);
  cart = next;
}
export function cartQuantity() {
  return cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
}
function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
    throw new RangeError("Quantity must be between 1 and 99.");
}
export function addToCart(productId, quantity = 1) {
  validateQuantity(quantity);
  const item = cart.find((cartItem) => cartItem.productId === productId);
  if (item) validateQuantity(item.quantity + quantity);
  persist(
    item
      ? cart.map((cartItem) =>
          cartItem === item
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        )
      : [...cart, { productId, quantity, deliveryOptionId: "1" }],
  );
}
export function removeFromCart(id) {
  persist(cart.filter((cartItem) => cartItem.productId !== id));
}
export function updateQuantity(id, quantity) {
  validateQuantity(quantity);
  persist(
    cart.map((cartItem) =>
      cartItem.productId === id ? { ...cartItem, quantity } : cartItem,
    ),
  );
}
export function updateDeliveryOption(id, deliveryOptionId) {
  if (!["1", "2", "3"].includes(deliveryOptionId))
    throw new RangeError("Invalid delivery option.");
  persist(
    cart.map((cartItem) =>
      cartItem.productId === id ? { ...cartItem, deliveryOptionId } : cartItem,
    ),
  );
}
export function clearCart() {
  persist([]);
}
