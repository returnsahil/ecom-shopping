import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadProducts, products, Product, Clothing } from "../data/products.js";
import { escapeHTML, safeAsset } from "../scripts/utils/html.js";
const data = JSON.parse(
  await readFile(new URL("../backend/products.json", import.meta.url)),
);
test("catalog models and API fallback work without network access", async () => {
  let requests = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => {
    requests++;
    if (url.startsWith("https:")) throw new Error("Offline");
    return { ok: true, json: async () => data };
  };
  try {
    assert.deepEqual(await loadProducts({ remote: true }), {
      source: "fallback",
    });
    assert.equal(requests, 2);
    assert.equal(products.length, data.length);
    assert.ok(products.every((p) => p instanceof Product));
    assert.ok(
      products
        .filter((p) => p.type === "clothing")
        .every((p) => p instanceof Clothing),
    );
    globalThis.fetch = async () => ({ ok: false });
    await assert.rejects(loadProducts(), /Could not load/);
  } finally {
    globalThis.fetch = original;
  }
});
test("external text is escaped and asset paths stay local", () => {
  assert.equal(
    escapeHTML('<img onerror="x">'),
    "&lt;img onerror=&quot;x&quot;&gt;",
  );
  assert.equal(safeAsset("javascript:alert(1)"), "");
  assert.equal(safeAsset("images/../secret"), "");
  assert.equal(
    safeAsset("images/products/shirt.jpg"),
    "images/products/shirt.jpg",
  );
});
