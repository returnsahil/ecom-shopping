import { cartQuantity } from "../../data/cart.js";
export function updateHeader() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cartQuantity();
  });
}
updateHeader();
