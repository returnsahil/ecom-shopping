import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { calculateTotals } from "./totals.js";
import { formatCurrency } from "../utils/money.js";
export function renderPaymentSummary() {
  const container = document.querySelector("[data-payment-summary]");
  let totals;
  try {
    totals = calculateTotals(cart, products);
  } catch (error) {
    container.textContent = error.message;
    return;
  }
  container.innerHTML = `<h2>Order summary</h2><dl>
    <div><dt>Items (${totals.quantity})</dt><dd>$${formatCurrency(totals.subtotal)}</dd></div>
    <div><dt>Shipping</dt><dd>$${formatCurrency(totals.shipping)}</dd></div>
    <div><dt>Estimated tax (10%)</dt><dd>$${formatCurrency(totals.tax)}</dd></div>
    <div class="total"><dt>Total</dt><dd>$${formatCurrency(totals.total)}</dd></div></dl>
    <p class="muted">Demo checkout. No payment or personal information is collected.</p>
    <p role="status" data-order-status></p>`;
}
