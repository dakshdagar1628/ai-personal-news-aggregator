import { getServerClient } from '@/lib/database/client'
import { DatabaseError } from '@/lib/api/errors'
import type { Category } from '@/types/database.types'
import type { CreateCategoryInput } from '@/lib/validators/category.schema'

export const categoriesRepository = {
  async findAll(activeOnly = true) {
    const db = getServerClient()
    let q = db.from('categories').select('*').order('sort_order')
    if (activeOnly) q = q.eq('is_active', true)
    const { data, error } = await q
    if (error) throw new DatabaseError(error.message, error)
    return data ?? []
  },

  async findById(id: string): Promise<Category | null> {
    const db = getServerClient()
    const { data, error } = await db.from('categories').select('*').eq('id', id).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const db = getServerClient()
    const { data, error } = await db.from('categories').select('*').eq('slug', slug).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const db = getServerClient()
    const { data, error } = await db.from('categories').insert(input).select().single()
    if (error) throw new DatabaseError(error.message, error)
    return data
  },
}
