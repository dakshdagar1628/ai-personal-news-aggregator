export interface ApiResponse<T> {
  data: T | null; error: string | null; status: number
}

export interface PaginatedResponse<T> {
  data: T[]; total: number; page: number; pageSize: number; hasMore: boolean
}

export interface DashboardStats {
  totalNewsToday: number; totalSourcesActive: number
  reportStatus: 'draft' | 'generating' | 'ready' | 'failed' | 'none'
  topCategories: { slug: string; name: string; count: number }[]
}
