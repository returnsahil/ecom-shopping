export function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}
export function safeAsset(path) {
  return /^images\/[a-zA-Z0-9_./-]+$/.test(path ?? "") && !path.includes("..")
    ? path
    : "";
}
