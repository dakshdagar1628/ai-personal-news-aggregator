import { NextRequest } from 'next/server'
import { newsService } from '@/lib/database/news.service'
import { ok, fail } from '@/lib/api/response'
import { logger } from '@/lib/logging/logger'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams)
    logger.info('GET /api/search', { q: params.q })
    const { data, total } = await newsService.searchNews(params)
    return ok({ results: data, total, query: params.q ?? '' })
  } catch (e) { return fail(e) }
}
