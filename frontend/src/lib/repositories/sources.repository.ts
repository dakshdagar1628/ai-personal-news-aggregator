import { getServerClient } from '@/lib/database/client'
import { DatabaseError } from '@/lib/api/errors'
import type { Source } from '@/types/database.types'
import type { CreateSourceInput, UpdateSourceInput } from '@/lib/validators/source.schema'

export const sourcesRepository = {
  async findAll(activeOnly = false) {
    const db = getServerClient()
    let q = db.from('sources').select('*').order('name')
    if (activeOnly) q = q.eq('is_active', true)
    const { data, error } = await q
    if (error) throw new DatabaseError(error.message, error)
    return data ?? []
  },

  async findById(id: string): Promise<Source | null> {
    const db = getServerClient()
    const { data, error } = await db.from('sources').select('*').eq('id', id).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async findBySlug(slug: string): Promise<Source | null> {
    const db = getServerClient()
    const { data, error } = await db.from('sources').select('*').eq('slug', slug).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async create(input: CreateSourceInput): Promise<Source> {
    const db = getServerClient()
    const { data, error } = await db.from('sources').insert(input).select().single()
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async update(id: string, input: UpdateSourceInput): Promise<Source | null> {
    const db = getServerClient()
    const { data, error } = await db.from('sources').update(input as Record<string, unknown>).eq('id', id).select().single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async incrementErrorCount(id: string) {
    const db = getServerClient()
    const src = await this.findById(id)
    if (!src) return
    await db.from('sources').update({ error_count: src.error_count + 1 }).eq('id', id)
  },

  async markChecked(id: string) {
    const db = getServerClient()
    await db.from('sources').update({ last_checked_at: new Date().toISOString(), error_count: 0 }).eq('id', id)
  },
}
