export function safeNextPath(next: string | null | undefined) {
  if (!next) return "/payments";
  if (!next.startsWith("/") || next.startsWith("//")) return "/payments";
  return next;
}
