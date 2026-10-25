import { readStorage, writeStorage } from "../scripts/utils/storage.js";
const saved = readStorage("ecom.orders", []);
export const orders = Array.isArray(saved)
  ? saved.filter(
      (o) =>
        o &&
        typeof o.id === "string" &&
        Array.isArray(o.products) &&
        Number.isFinite(o.totalCostCents) &&
        !Number.isNaN(Date.parse(o.orderTime)) &&
        o.products.every(
          (i) =>
            i &&
            typeof i.productId === "string" &&
            Number.isInteger(i.quantity) &&
            i.quantity > 0 &&
            !Number.isNaN(Date.parse(i.estimatedDeliveryTime)),
        ),
    )
  : [];
export function addOrder(order) {
  if (
    !order?.id ||
    !Array.isArray(order.products) ||
    orders.some((o) => o.id === order.id)
  )
    throw new Error("Invalid or duplicate order.");
  writeStorage("ecom.orders", [order, ...orders]);
  orders.unshift(order);
}
