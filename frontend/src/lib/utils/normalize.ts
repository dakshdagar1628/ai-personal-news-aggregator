export function urlHash(url: string): string {
  const s = url.trim().toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function normalizeUrl(url: string): string {
  try { return new URL(url).href } catch { return url.trim() }
}

export function isDuplicate(existingHashes: Set<string>, url: string): boolean {
  return existingHashes.has(urlHash(url))
}

export function clampScore(n: number): number {
  return Math.max(0, Math.min(1, n))
}
