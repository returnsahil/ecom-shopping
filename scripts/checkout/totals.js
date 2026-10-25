import { getDeliveryOption } from "../../data/delivery-options.js";
export function calculateTotals(cart, products) {
  let subtotal = 0,
    shipping = 0,
    quantity = 0;
  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);
    if (!product)
      throw new Error("A cart product is unavailable. Remove it to continue.");
    subtotal += product.priceCents * item.quantity;
    shipping += getDeliveryOption(item.deliveryOptionId).priceCents;
    quantity += item.quantity;
  }
  const tax = Math.round((subtotal + shipping) * 0.1);
  return {
    subtotal,
    shipping,
    quantity,
    tax,
    total: subtotal + shipping + tax,
  };
}
