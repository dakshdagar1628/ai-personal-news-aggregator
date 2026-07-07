import { createHash } from 'crypto'

export function urlHash(url: string): string {
  return createHash('sha256').update(url.trim().toLowerCase()).digest('hex').slice(0, 16)
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
