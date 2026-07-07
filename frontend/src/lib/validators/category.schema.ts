import { z } from 'zod'
import { slugSchema } from './common.schema'

export const createCategorySchema = z.object({
  name:        z.string().min(1).max(100),
  slug:        slugSchema,
  description: z.string().max(500).optional().nullable(),
  color:       z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().nullable(),
  icon:        z.string().max(50).optional().nullable(),
  is_active:   z.boolean().default(true),
  sort_order:  z.number().int().default(0),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
