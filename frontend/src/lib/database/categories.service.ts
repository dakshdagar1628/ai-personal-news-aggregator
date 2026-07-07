import { categoriesRepository } from '@/lib/repositories/categories.repository'
import { isSupabaseConfigured } from './client'
import { NotFoundError } from '@/lib/api/errors'
import { MOCK_CATEGORIES } from './mock-fallback'

export const categoriesService = {
  async getCategories() {
    if (!isSupabaseConfigured()) return MOCK_CATEGORIES
    return categoriesRepository.findAll()
  },

  async getCategoryById(id: string) {
    if (!isSupabaseConfigured()) {
      const cat = MOCK_CATEGORIES.find(c => c.id === id)
      if (!cat) throw new NotFoundError('Category', id)
      return cat
    }
    const cat = await categoriesRepository.findById(id)
    if (!cat) throw new NotFoundError('Category', id)
    return cat
  },

  async getCategoryBySlug(slug: string) {
    if (!isSupabaseConfigured()) {
      const cat = MOCK_CATEGORIES.find(c => c.slug === slug)
      if (!cat) throw new NotFoundError('Category')
      return cat
    }
    return categoriesRepository.findBySlug(slug)
  },
}
