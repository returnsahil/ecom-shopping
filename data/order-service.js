import { getDeliveryOption } from "./delivery-options.js";
import { arrivalDate } from "../scripts/utils/dates.js";

export async function submitOrder(cart, totalCostCents) {
  if (!cart.length) throw new Error("Your cart is empty.");
  const response = await fetch("https://supersimplebackend.dev/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({ cart }),
  });
  if (!response.ok) {
    throw new Error("The demo service could not place your order. Try again.");
  }
  const result = await response.json();
  if (typeof result?.id !== "string" || !result.id) {
    throw new Error("The demo service returned an invalid order.");
  }
  return {
    id: result.id,
    orderTime: new Date().toISOString(),
    totalCostCents,
    products: cart.map((item) => ({
      ...item,
      estimatedDeliveryTime: arrivalDate(
        getDeliveryOption(item.deliveryOptionId).deliveryDays,
      ),
    })),
  };
}
