import { cart, clearCart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { addOrder } from "../../data/orders.js";
import { submitOrder } from "../../data/order-service.js";
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
    <button data-place-order ${cart.length ? "" : "disabled"}>Place demo order</button><p role="status" data-order-status></p>`;
  container
    .querySelector("[data-place-order]")
    .addEventListener("click", async (event) => {
      const button = event.target;
      button.disabled = true;
      const controls = document.querySelectorAll(
        "[data-order-summary] input, [data-order-summary] button",
      );
      controls.forEach((control) => {
        control.disabled = true;
      });
      const status = container.querySelector("[data-order-status]");
      let saved = false;
      try {
        const snapshot = cart.map((item) => ({ ...item }));
        addOrder(await submitOrder(snapshot, totals.total));
        saved = true;
        clearCart();
        window.location.assign("orders.html");
      } catch (error) {
        if (saved) {
          status.innerHTML =
            'Order saved, but the cart could not be cleared. <a href="orders.html">View your order</a>. Clear the cart before ordering again.';
        } else {
          status.textContent =
            error.name === "TimeoutError"
              ? "The service timed out. Check your orders before retrying."
              : error.message || "Could not place the demo order.";
          button.disabled = false;
        }
        controls.forEach((control) => {
          control.disabled = false;
        });
      }
    });
}
