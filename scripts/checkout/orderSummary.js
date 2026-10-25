import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/delivery-options.js";
import { formatCurrency } from "../utils/money.js";
import { escapeHTML as html, safeAsset } from "../utils/html.js";
import { arrivalDate, formatDate } from "../utils/dates.js";
export function renderOrderSummary(onChange) {
  const container = document.querySelector("[data-order-summary]");
  container.innerHTML =
    cart
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product)
          return `<article class="panel" data-product-id="${html(item.productId)}"><p>This product is unavailable.</p><button data-remove>Remove unavailable item</button></article>`;
        return `<article class="panel cart-item" data-product-id="${html(item.productId)}">
      <img src="${html(safeAsset(product.image))}" alt="${html(product.name)}"><div><h2>${html(product.name)}</h2><p class="price">$${formatCurrency(product.priceCents)}</p>
      <label>Quantity <input aria-label="Quantity for ${html(product.name)}" type="number" min="1" max="99" step="1" value="${item.quantity}" data-quantity></label>
      <button class="secondary" data-update>Update</button>
      <button class="secondary" data-remove>Remove</button><p>Estimated arrival: ${formatDate(arrivalDate(getDeliveryOption(item.deliveryOptionId).deliveryDays))}</p>
      <fieldset><legend>Delivery options</legend>${deliveryOptions.map((o) => `<label class="delivery"><input type="radio" name="delivery-${html(item.productId)}" value="${o.id}" data-delivery ${o.id === item.deliveryOptionId ? "checked" : ""}>${o.deliveryDays} days · ${o.priceCents ? "$" + formatCurrency(o.priceCents) : "Free"}</label>`).join("")}</fieldset></div></article>`;
      })
      .join("") ||
    '<div class="panel empty"><h2>Your cart is empty</h2><a href="index.html">Explore the catalog</a></div>';
  container.onclick = (event) => {
    const button = event.target.closest("[data-remove], [data-update]");
    if (!button) return;
    try {
      const row = button.closest("[data-product-id]");
      if (button.matches("[data-remove]"))
        removeFromCart(row.dataset.productId);
      else
        updateQuantity(
          row.dataset.productId,
          Number(row.querySelector("[data-quantity]").value),
        );
      document.querySelector("[data-status]").textContent = "";
      onChange();
    } catch (error) {
      document.querySelector("[data-status]").textContent = error.message;
    }
  };
  container.onchange = (event) => {
    const id = event.target.closest("[data-product-id]")?.dataset.productId;
    if (!id) return;
    try {
      if (!event.target.matches("[data-delivery]")) return;
      if (event.target.matches("[data-delivery]"))
        updateDeliveryOption(id, event.target.value);
      onChange();
    } catch (error) {
      document.querySelector("[data-status]").textContent = error.message;
      onChange();
    }
  };
}
