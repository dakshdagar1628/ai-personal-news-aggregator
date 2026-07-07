import { sourcesRepository } from '@/lib/repositories/sources.repository'
import { isSupabaseConfigured } from './client'
import { ValidationError, NotFoundError } from '@/lib/api/errors'
import { logger } from '@/lib/logging/logger'
import { createSourceSchema, updateSourceSchema } from '@/lib/validators/source.schema'
import { MOCK_SOURCES } from './mock-fallback'

export const sourcesService = {
  async getSources(activeOnly = false) {
    if (!isSupabaseConfigured()) return MOCK_SOURCES.filter(s => !activeOnly || s.is_active)
    return sourcesRepository.findAll(activeOnly)
  },

  async getSourceById(id: string) {
    if (!isSupabaseConfigured()) {
      const src = MOCK_SOURCES.find(s => s.id === id)
      if (!src) throw new NotFoundError('Source', id)
      return src
    }
    const src = await sourcesRepository.findById(id)
    if (!src) throw new NotFoundError('Source', id)
    return src
  },

  async createSource(raw: unknown) {
    const parsed = createSourceSchema.safeParse(raw)
    if (!parsed.success) throw new ValidationError(parsed.error.flatten())
    return logger.timed('sourcesService.createSource', () => sourcesRepository.create(parsed.data))
  },

  async updateSource(id: string, raw: unknown) {
    const parsed = updateSourceSchema.safeParse(raw)
    if (!parsed.success) throw new ValidationError(parsed.error.flatten())
    const src = await sourcesRepository.update(id, parsed.data)
    if (!src) throw new NotFoundError('Source', id)
    return src
  },

  async markChecked(id: string) {
    return sourcesRepository.markChecked(id)
  },

  async incrementError(id: string) {
    return sourcesRepository.incrementErrorCount(id)
  },
}
