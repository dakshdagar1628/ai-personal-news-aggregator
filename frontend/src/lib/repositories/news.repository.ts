import { getServerClient } from '@/lib/database/client'
import { DatabaseError } from '@/lib/api/errors'
import type { NewsItem } from '@/types/database.types'
import type { CreateNewsInput, UpdateNewsInput, SearchNewsInput } from '@/lib/validators/news.schema'
import { urlHash } from '@/lib/utils/normalize'

export const newsRepository = {
  async findAll(params: Pick<SearchNewsInput, 'page' | 'pageSize' | 'sortBy' | 'sortDir'>) {
    const db = getServerClient()
    const { page = 1, pageSize = 20, sortBy = 'collected_at', sortDir = 'desc' } = params
    const from = (page - 1) * pageSize
    const { data, error, count } = await db.from('news')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortDir === 'asc' })
      .range(from, from + pageSize - 1)
    if (error) throw new DatabaseError(error.message, error)
    return { data: data ?? [], total: count ?? 0 }
  },

  async findById(id: string): Promise<NewsItem | null> {
    const db = getServerClient()
    const { data, error } = await db.from('news').select('*').eq('id', id).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async search(params: SearchNewsInput) {
    const db = getServerClient()
    let q = db.from('news').select('*', { count: 'exact' })
    if (params.q)           q = q.ilike('title', `%${params.q}%`)
    if (params.source_id)   q = q.eq('source_id', params.source_id)
    if (params.category_id) q = q.eq('category_id', params.category_id)
    if (params.from)        q = q.gte('published_at', params.from)
    if (params.to)          q = q.lte('published_at', params.to)
    if (params.min_score)   q = q.gte('importance_score', params.min_score)
    if (params.featured !== undefined) q = q.eq('is_featured', params.featured)
    if (params.processed !== undefined) q = q.eq('is_processed', params.processed)
    if (params.tags) {
      const tags = params.tags.split(',').map(t => t.trim()).filter(Boolean)
      if (tags.length) q = q.overlaps('tags', tags)
    }
    const { page = 1, pageSize = 20, sortBy = 'collected_at', sortDir = 'desc' } = params
    const from = (page - 1) * pageSize
    const { data, error, count } = await q
      .order(sortBy, { ascending: sortDir === 'asc' })
      .range(from, from + pageSize - 1)
    if (error) throw new DatabaseError(error.message, error)
    return { data: data ?? [], total: count ?? 0 }
  },

  async create(input: CreateNewsInput): Promise<NewsItem> {
    const db = getServerClient()
    const { data, error } = await db.from('news')
      .insert({ ...input, url_hash: urlHash(input.url) })
      .select().single()
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async update(id: string, input: UpdateNewsInput): Promise<NewsItem | null> {
    const db = getServerClient()
    const { data, error } = await db.from('news')
      .update(input as Record<string, unknown>)
      .eq('id', id).select().single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async delete(id: string): Promise<boolean> {
    const db = getServerClient()
    const { error } = await db.from('news').delete().eq('id', id)
    if (error) throw new DatabaseError(error.message, error)
    return true
  },

  async existsByUrlHash(hash: string): Promise<boolean> {
    const db = getServerClient()
    const { count } = await db.from('news').select('id', { count: 'exact', head: true }).eq('url_hash', hash)
    return (count ?? 0) > 0
  },
}
