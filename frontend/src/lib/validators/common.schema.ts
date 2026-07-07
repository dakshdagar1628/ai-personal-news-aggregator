import { z } from 'zod'

export const uuidSchema  = z.string().uuid()
export const slugSchema  = z.string().regex(/^[a-z0-9-]+$/).min(1).max(100)
export const urlSchema   = z.string().url()
export const scoreSchema = z.number().min(0).max(1)
export const tagsSchema  = z.array(z.string().max(50)).max(20).default([])

export const paginationSchema = z.object({
  page:     z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  sortBy:   z.string().optional(),
  sortDir:  z.enum(['asc','desc']).default('desc'),
})

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to:   z.string().datetime().optional(),
})
