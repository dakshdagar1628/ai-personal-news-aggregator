import { z } from 'zod'

export const topStorySchema = z.object({
  news_id:          z.string().uuid(),
  title:            z.string(),
  url:              z.string().url(),
  source_name:      z.string(),
  importance_score: z.number().min(0).max(1),
  summary:          z.string(),
})

export const createReportSchema = z.object({
  report_date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title:               z.string().min(1).max(300),
  summary:             z.string().max(5000).optional().nullable(),
  top_stories:         z.array(topStorySchema).max(10).optional().nullable(),
  content_by_category: z.record(z.string(), z.array(topStorySchema)).optional().nullable(),
  total_items:         z.number().int().min(0).default(0),
  processed_items:     z.number().int().min(0).default(0),
  status:              z.enum(['draft','generating','ready','failed']).default('draft'),
  ai_model_used:       z.string().optional().nullable(),
  ai_tokens_used:      z.number().int().optional().nullable(),
})

export type CreateReportInput = z.infer<typeof createReportSchema>
