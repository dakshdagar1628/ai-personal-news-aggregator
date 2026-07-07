import { NextRequest } from 'next/server'
import { logger } from '@/lib/logging/logger'

export function withLogging(
  handler: (req: NextRequest, ctx?: unknown) => Promise<Response>
) {
  return async (req: NextRequest, ctx?: unknown) => {
    const start = Date.now()
    const label = `${req.method} ${new URL(req.url).pathname}`
    logger.info(label)
    try {
      const res = await handler(req, ctx)
      logger.success(`${label} → ${res.status}`, { ms: Date.now() - start })
      return res
    } catch (err) {
      logger.error(`${label} → unhandled`, { error: String(err), ms: Date.now() - start })
      throw err
    }
  }
}
