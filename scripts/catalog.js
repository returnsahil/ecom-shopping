import { products, loadProducts } from "../data/products.js";
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
    </article>`,
      )
      .join("") || '<p class="empty">No products match your search.</p>';
  document.querySelector("[data-results]").textContent =
    `${matches.length} products`;
}
document.querySelector("[data-search]").addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  render();
});
async function initialize() {
  status.textContent = "Loading products…";
  try {
    const result = await loadProducts();
    render();
    status.textContent = "Demo catalog ready.";
  } catch {
    status.textContent =
      "Could not load the catalog. Reload the page to try again.";
  }
}
initialize();
