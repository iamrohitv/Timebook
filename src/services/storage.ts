// Simple typed localStorage wrapper. Keys are namespaced.
const NS = "timebook:";

export function getJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(NS + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function setJSON(key: string, value: unknown) {
  localStorage.setItem(NS + key, JSON.stringify(value));
}
export function remove(key: string) {
  localStorage.removeItem(NS + key);
}
