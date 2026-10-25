import { products, loadProducts } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { updateHeader } from "./shared/header.js";
import { escapeHTML as html, safeAsset } from "./utils/html.js";
const grid = document.querySelector("[data-products]");
const status = document.querySelector("[data-status]");
let query = "";
function render() {
  const matches = products.filter((p) =>
    [p.name, ...(p.keywords || [])].join(" ").toLowerCase().includes(query),
  );
  grid.innerHTML =
    matches
      .map(
        (p) => `<article class="product-card" data-product-id="${html(p.id)}">
    <img class="product-image" src="${html(safeAsset(p.image))}" alt="${html(p.name)}" loading="lazy">
    <p class="rating">★ ${html(p.rating.stars)} <span>(${html(p.rating.count)} reviews)</span></p>
    <h2>${html(p.name)}</h2><p class="price">${p.getFormattedPrice()}</p>${p.extraInfoHTML()}
    <label>Quantity <select aria-label="Quantity for ${html(p.name)}">${Array.from({ length: 10 }, (_, i) => `<option>${i + 1}</option>`).join("")}</select></label>
    <button type="button" data-add>Add to cart</button></article>`,
      )
      .join("") || '<p class="empty">No products match your search.</p>';
  document.querySelector("[data-results]").textContent =
    `${matches.length} products`;
}
document.querySelector("[data-search]").addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  render();
});
grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const card = button.closest("[data-product-id]");
  try {
    addToCart(
      card.dataset.productId,
      Number(card.querySelector("select").value),
    );
    updateHeader();
    status.textContent = "Added to your cart.";
  } catch (error) {
    status.textContent = error.message;
  }
});
async function initialize(remote = false) {
  status.textContent = "Loading products…";
  try {
    const result = await loadProducts({ remote });
    render();
    status.textContent =
      result.source === "fallback"
        ? "Live API unavailable. Showing the bundled catalog."
        : remote
          ? "Live catalog loaded."
          : "Demo catalog ready. No real payments.";
  } catch {
    status.textContent =
      "Could not load the catalog. Reload the page to try again.";
  }
}
document
  .querySelector("[data-load-live]")
  .addEventListener("click", async (event) => {
    event.target.disabled = true;
    try {
      await initialize(true);
    } finally {
      event.target.disabled = false;
    }
  });
initialize();
