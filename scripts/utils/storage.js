export function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStorage(key, value) {
  // Report failed writes so checkout never claims an unsaved order succeeded.
  localStorage.setItem(key, JSON.stringify(value));
}
