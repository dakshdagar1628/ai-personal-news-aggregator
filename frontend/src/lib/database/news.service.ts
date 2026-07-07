import { newsRepository } from '@/lib/repositories/news.repository'
import { isSupabaseConfigured } from './client'
import { ValidationError, NotFoundError } from '@/lib/api/errors'
import { logger } from '@/lib/logging/logger'
import { createNewsSchema, updateNewsSchema, searchNewsSchema } from '@/lib/validators/news.schema'
import { urlHash } from '@/lib/utils/normalize'
import { MOCK_NEWS_DB } from './mock-fallback'
import type { CreateNewsInput, UpdateNewsInput, SearchNewsInput } from '@/lib/validators/news.schema'

export const newsService = {
  async getNews(params: Partial<SearchNewsInput> = {}) {
    return logger.timed('newsService.getNews', async () => {
      if (!isSupabaseConfigured()) {
        const { page = 1, pageSize = 20 } = params
        const start = (page - 1) * pageSize
        return { data: MOCK_NEWS_DB.slice(start, start + pageSize), total: MOCK_NEWS_DB.length }
      }
      return newsRepository.findAll({ page: params.page ?? 1, pageSize: params.pageSize ?? 20, sortBy: params.sortBy ?? 'collected_at', sortDir: params.sortDir ?? 'desc' })
    })
  },

  async getNewsById(id: string) {
    return logger.timed('newsService.getNewsById', async () => {
      if (!isSupabaseConfigured()) {
        const item = MOCK_NEWS_DB.find(n => n.id === id)
        if (!item) throw new NotFoundError('News item', id)
        return item
      }
      const item = await newsRepository.findById(id)
      if (!item) throw new NotFoundError('News item', id)
      return item
    })
  },

  async searchNews(rawParams: unknown) {
    const params = searchNewsSchema.safeParse(rawParams)
    if (!params.success) throw new ValidationError(params.error.flatten())
    return logger.timed('newsService.searchNews', async () => {
      if (!isSupabaseConfigured()) {
        let items = [...MOCK_NEWS_DB]
        if (params.data.q) items = items.filter(n => n.title.toLowerCase().includes(params.data.q!.toLowerCase()))
        if (params.data.min_score) items = items.filter(n => (n.importance_score ?? 0) >= params.data.min_score!)
        const { page, pageSize } = params.data
        const start = (page - 1) * pageSize
        return { data: items.slice(start, start + pageSize), total: items.length }
      }
      return newsRepository.search(params.data)
    })
  },

  async createNews(raw: unknown) {
    const parsed = createNewsSchema.safeParse(raw)
    if (!parsed.success) throw new ValidationError(parsed.error.flatten())
    const hash = urlHash(parsed.data.url)
    if (isSupabaseConfigured()) {
      const exists = await newsRepository.existsByUrlHash(hash)
      if (exists) { logger.warn('Duplicate news skipped', { url: parsed.data.url }); return null }
    }
    return logger.timed('newsService.createNews', () => newsRepository.create(parsed.data))
  },

  async updateNews(id: string, raw: unknown) {
    const parsed = updateNewsSchema.safeParse(raw)
    if (!parsed.success) throw new ValidationError(parsed.error.flatten())
    const item = await newsRepository.update(id, parsed.data)
    if (!item) throw new NotFoundError('News item', id)
    return item
  },

  async deleteNews(id: string) {
    if (!isSupabaseConfigured()) return true
    const exists = await newsRepository.findById(id)
    if (!exists) throw new NotFoundError('News item', id)
    return newsRepository.delete(id)
  },

  async getLatestNews(limit = 10) {
    if (!isSupabaseConfigured()) return MOCK_NEWS_DB.slice(0, limit)
    const { data } = await newsRepository.findAll({ page: 1, pageSize: limit, sortBy: 'collected_at', sortDir: 'desc' })
    return data
  },
}
