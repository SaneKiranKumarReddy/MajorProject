export function escapeRegExp(s: string) {
  // Escape for regex literals
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}