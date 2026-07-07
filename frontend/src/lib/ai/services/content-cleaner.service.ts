export function cleanContent(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, ' ')          // strip HTML
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#?\w+;/g, '')
    .replace(/https?:\/\/[^\s)]+/g, '') // strip bare URLs
    .replace(/\[.*?\]\(.*?\)/g, '')     // strip markdown links
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000);
}

export function extractTitle(raw: string | null | undefined): string {
  return String(raw ?? '').replace(/\s+/g, ' ').trim().slice(0, 500);
}
