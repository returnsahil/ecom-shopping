import { loadProducts } from "../data/products.js";
import { updateHeader } from "./shared/header.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
function render() { renderOrderSummary(render); updateHeader(); }
try { await loadProducts(); render(); }
catch { document.querySelector("[data-status]").textContent = "Could not load checkout. Reload to try again."; }
