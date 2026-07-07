import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, style: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (style === 'relative') return formatDistanceToNow(d, { addSuffix: true })
  if (style === 'long')     return format(d, 'MMMM d, yyyy')
  return format(d, 'MMM d')
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}

export function formatImportanceScore(score: number): string {
  return `${Math.round(score * 100)}%`
}

export function getImportanceColor(score: number): string {
  if (score >= 0.9) return 'text-emerald-500'
  if (score >= 0.7) return 'text-blue-500'
  if (score >= 0.5) return 'text-amber-500'
  return 'text-muted-foreground'
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function generateUrlHash(url: string): string {
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16)
}
