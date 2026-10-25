import { orders } from "../data/orders.js";
import { loadProducts, getProduct } from "../data/products.js";
import "./shared/header.js";
import { escapeHTML as html, safeAsset } from "./utils/html.js";
import { formatDate } from "./utils/dates.js";
const params = new URLSearchParams(window.location.search);
const order = orders.find((o) => o.id === params.get("orderId"));
const item = order?.products.find(
  (i) => i.productId === params.get("productId"),
);
const container = document.querySelector("[data-tracking]");
if (!item)
  container.innerHTML =
    '<h2>Order not found on this browser</h2><a href="orders.html">View your orders</a>';
else {
  try {
    await loadProducts();
    const product = getProduct(item.productId);
    const start = Date.parse(order.orderTime),
      end = Date.parse(item.estimatedDeliveryTime);
    const progress = Math.max(
      0,
      Math.min(
        100,
        Math.round(((Date.now() - start) / Math.max(1, end - start)) * 100),
      ),
    );
    const stage =
      progress >= 100
        ? "Estimated arrival reached"
        : progress >= 35
          ? "In transit (simulated)"
          : "Preparing (simulated)";
    container.innerHTML = `<a href="orders.html">← Your orders</a><h2>${html(product?.name || "Order item")}</h2>
      ${product ? `<img class="tracking-image" src="${html(safeAsset(product.image))}" alt="">` : ""}
      <p>Quantity: ${item.quantity}</p><p>Estimated arrival: ${formatDate(item.estimatedDeliveryTime)}</p><h3>${stage}</h3>
      <progress max="100" value="${progress}" aria-label="Simulated delivery progress">${progress}%</progress>
      <p class="muted">This timeline is simulated from elapsed time. It is not live carrier tracking.</p>`;
  } catch {
    container.textContent = "Could not load tracking. Reload to try again.";
  }
}
