import { orders } from "../data/orders.js";
import { loadProducts, getProduct } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { updateHeader } from "./shared/header.js";
import { escapeHTML as html, safeAsset } from "./utils/html.js";
import { formatCurrency } from "./utils/money.js";
import { formatDate } from "./utils/dates.js";
const container = document.querySelector("[data-orders]");
try {
  await loadProducts();
  container.innerHTML =
    orders
      .map(
        (
          order,
        ) => `<article class="panel"><div class="order-heading"><h2>Order · ${formatDate(order.orderTime)}</h2><strong>$${formatCurrency(order.totalCostCents)}</strong></div><p class="muted">ID: ${html(order.id)}</p>
    ${order.products
      .map((item) => {
        const p = getProduct(item.productId);
        return `<div class="order-item">${p ? `<img src="${html(safeAsset(p.image))}" alt="">` : ""}<div><h3>${html(p?.name || "Unavailable product")}</h3><p>Quantity: ${item.quantity} · Estimated arrival: ${formatDate(item.estimatedDeliveryTime)}</p>
        <a href="tracking.html?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(item.productId)}">Track demo order</a>
        ${p ? `<button class="secondary" data-buy="${html(p.id)}">Buy again</button>` : ""}</div></div>`;
      })
      .join("")}</article>`,
      )
      .join("") ||
    '<div class="panel empty"><h2>No orders yet</h2><a href="index.html">Start shopping</a></div>';
} catch {
  container.textContent = "Could not load orders. Reload to try again.";
}
container.addEventListener("click", (event) => {
  const button = event.target.closest("[data-buy]");
  if (!button) return;
  try {
    addToCart(button.dataset.buy);
    updateHeader();
    document.querySelector("[data-status]").textContent = "Added to cart.";
  } catch (error) {
    document.querySelector("[data-status]").textContent = error.message;
  }
});
