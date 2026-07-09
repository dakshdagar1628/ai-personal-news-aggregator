import { z } from 'zod'
import { slugSchema, urlSchema } from './common.schema'

export const createSourceSchema = z.object({
  name:                   z.string().min(1).max(200),
  slug:                   slugSchema,
  type:                   z.enum(['rss','api','scraper','youtube']),
  url:                    urlSchema,
  is_active:              z.boolean().default(true),
  check_interval_minutes: z.number().int().min(5).max(1440).default(60),
  metadata:               z.record(z.string(), z.unknown()).optional().nullable(),
})

export const updateSourceSchema = createSourceSchema.partial().extend({
  last_checked_at: z.string().datetime().optional().nullable(),
  error_count:     z.number().int().min(0).optional(),
})

export type CreateSourceInput = z.infer<typeof createSourceSchema>
export type UpdateSourceInput = z.infer<typeof updateSourceSchema>
