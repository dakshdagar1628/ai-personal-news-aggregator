import { reportsRepository } from '@/lib/repositories/reports.repository'
import { isSupabaseConfigured } from './client'
import { ValidationError, NotFoundError } from '@/lib/api/errors'
import { logger } from '@/lib/logging/logger'
import { createReportSchema } from '@/lib/validators/report.schema'
import { MOCK_REPORT_DB } from './mock-fallback'

export const reportsService = {
  async getReports(limit = 30) {
    if (!isSupabaseConfigured()) return [MOCK_REPORT_DB]
    return reportsRepository.findAll(limit)
  },

  async getReportByDate(date: string) {
    if (!isSupabaseConfigured()) {
      if (date === '2026-07-06') return MOCK_REPORT_DB
      throw new NotFoundError('Report', date)
    }
    const report = await reportsRepository.findByDate(date)
    if (!report) throw new NotFoundError('Report for date', date)
    return report
  },

  async getLatestReport() {
    if (!isSupabaseConfigured()) return MOCK_REPORT_DB
    return reportsRepository.findLatestReady()
  },

  async upsertReport(raw: unknown) {
    const parsed = createReportSchema.safeParse(raw)
    if (!parsed.success) throw new ValidationError(parsed.error.flatten())
    return logger.timed('reportsService.upsert', () => reportsRepository.upsert(parsed.data))
  },
}
