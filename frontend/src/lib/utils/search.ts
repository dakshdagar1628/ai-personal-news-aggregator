export interface SearchFilters {
  q?: string
  source_id?: string
  category_id?: string
  tags?: string[]
  from?: string
  to?: string
  min_score?: number
  featured?: boolean
}

// Applies simple in-memory filtering — used when Supabase is not configured
export function filterInMemory<T extends Record<string, unknown>>(
  items: T[],
  filters: SearchFilters
): T[] {
  return items.filter(item => {
    if (filters.q) {
      const haystack = String(item.title ?? '').toLowerCase()
      if (!haystack.includes(filters.q.toLowerCase())) return false
    }
    if (filters.source_id && item.source_id !== filters.source_id) return false
    if (filters.category_id && item.category_id !== filters.category_id) return false
    if (filters.min_score !== undefined && (Number(item.importance_score) ?? 0) < filters.min_score) return false
    if (filters.featured !== undefined && Boolean(item.is_featured) !== filters.featured) return false
    return true
  })
}

export function buildFullTextQuery(q: string): string {
  return q.trim().replace(/\s+/g, ' & ')
}
