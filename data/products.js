import { formatCurrency } from "../scripts/utils/money.js";
import { escapeHTML, safeAsset } from "../scripts/utils/html.js";
export class Product {
  constructor(details) {
    Object.assign(this, details);
  }
  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }
  getFormattedPrice() {
    return "$" + formatCurrency(this.priceCents);
  }
  extraInfoHTML() {
    return "";
  }
}
export class Clothing extends Product {
  extraInfoHTML() {
    const path = safeAsset(this.sizeChartLink);
    return path
      ? `<a href="${escapeHTML(path)}" target="_blank" rel="noopener">Size chart</a>`
      : "";
  }
}
export let products = [];
export function getProduct(id) {
  return products.find((p) => p.id === id);
}
function parseProducts(data) {
  if (
    !Array.isArray(data) ||
    !data.length ||
    data.some(
      (p) =>
        !p ||
        !p.id ||
        !p.name ||
        !safeAsset(p.image) ||
        !Number.isInteger(p.priceCents) ||
        p.priceCents < 0 ||
        !p.rating ||
        !Number.isFinite(p.rating.stars),
    )
  )
    throw new Error("Invalid product catalog.");
  return data.map((p) =>
    p.type === "clothing" ? new Clothing(p) : new Product(p),
  );
}
export async function loadProducts() {
  const response = await fetch("./backend/products.json");
  if (!response.ok) throw new Error("Could not load products.");
  products = parseProducts(await response.json());
  return { source: "local" };
}
