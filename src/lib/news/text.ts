export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function excerpt(html: string, max = 120): string {
  const text = stripHtml(html);
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
