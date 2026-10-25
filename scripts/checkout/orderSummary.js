import { cart, removeFromCart, updateQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { escapeHTML as html, safeAsset } from "../utils/html.js";
import { formatCurrency } from "../utils/money.js";
export function renderOrderSummary(onChange) {
  const container = document.querySelector("[data-order-summary]");
  container.innerHTML = cart.map(item => {
    const product = getProduct(item.productId);
    return `<article class="panel" data-product-id="${html(item.productId)}"><h2>${html(product?.name || "Unavailable product")}</h2>
      <label>Quantity <input type="number" min="1" max="99" value="${item.quantity}"></label>
      <button data-update>Update</button><button data-remove>Remove</button></article>`;
  }).join("") || '<p>Your cart is empty. <a href="index.html">Shop products</a></p>';
  container.onclick = event => {
    const button = event.target.closest("[data-update], [data-remove]");
    if (!button) return;
    const row = button.closest("[data-product-id]");
    try {
      if (button.matches("[data-remove]")) removeFromCart(row.dataset.productId);
      else updateQuantity(row.dataset.productId, Number(row.querySelector("input").value));
      onChange();
    } catch (error) { document.querySelector("[data-status]").textContent = error.message; }
  };
}
