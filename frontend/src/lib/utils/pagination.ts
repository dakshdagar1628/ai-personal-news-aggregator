export interface PaginationParams { page: number; pageSize: number }
export interface SortParams       { sortBy: string; sortDir: 'asc' | 'desc' }

export function parsePagination(url: URL, defaultSize = 20): PaginationParams {
  const page     = Math.max(1, parseInt(url.searchParams.get('page')     ?? '1'))
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') ?? String(defaultSize))))
  return { page, pageSize }
}

export function parseSort(url: URL, defaultBy = 'created_at'): SortParams {
  const sortBy  = url.searchParams.get('sortBy')  ?? defaultBy
  const sortDir = (url.searchParams.get('sortDir') ?? 'desc') as 'asc' | 'desc'
  return { sortBy, sortDir }
}

export function applyPagination<T>(items: T[], { page, pageSize }: PaginationParams) {
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total: items.length }
}
