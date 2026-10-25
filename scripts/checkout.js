import { loadProducts } from "../data/products.js";
import { updateHeader } from "./shared/header.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
function render() {
  renderOrderSummary(render);
  renderPaymentSummary();
  updateHeader();
}
try {
  await loadProducts();
  render();
} catch {
  document.querySelector("[data-status]").textContent =
    "Could not load checkout. Reload to try again.";
}
