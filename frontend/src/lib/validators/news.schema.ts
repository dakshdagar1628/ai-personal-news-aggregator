import { z } from 'zod'
import { uuidSchema, urlSchema, scoreSchema, tagsSchema } from './common.schema'

export const createNewsSchema = z.object({
  source_id:       uuidSchema,
  category_id:     uuidSchema.optional().nullable(),
  title:           z.string().min(1).max(500),
  url:             urlSchema,
  content_raw:     z.string().max(50000).optional().nullable(),
  content_summary: z.string().max(2000).optional().nullable(),
  author:          z.string().max(200).optional().nullable(),
  published_at:    z.string().datetime().optional().nullable(),
  importance_score:scoreSchema.optional().nullable(),
  tags:            tagsSchema,
  metadata:        z.record(z.string(), z.unknown()).optional().nullable(),
})

export const updateNewsSchema = createNewsSchema.partial().extend({
  is_processed: z.boolean().optional(),
  is_featured:  z.boolean().optional(),
  is_duplicate: z.boolean().optional(),
  duplicate_of: uuidSchema.optional().nullable(),
})

export const searchNewsSchema = z.object({
  q:           z.string().max(200).optional(),
  source_id:   uuidSchema.optional(),
  category_id: uuidSchema.optional(),
  tags:        z.string().optional(),
  from:        z.string().datetime().optional(),
  to:          z.string().datetime().optional(),
  min_score:   z.coerce.number().min(0).max(1).optional(),
  featured:    z.coerce.boolean().optional(),
  processed:   z.coerce.boolean().optional(),
  page:        z.coerce.number().min(1).default(1),
  pageSize:    z.coerce.number().min(1).max(500).default(20),
  sortBy:      z.enum(['published_at','collected_at','importance_score','created_at']).default('collected_at'),
  sortDir:     z.enum(['asc','desc']).default('desc'),
})

export type CreateNewsInput  = z.infer<typeof createNewsSchema>
export type UpdateNewsInput  = z.infer<typeof updateNewsSchema>
export type SearchNewsInput  = z.infer<typeof searchNewsSchema>
