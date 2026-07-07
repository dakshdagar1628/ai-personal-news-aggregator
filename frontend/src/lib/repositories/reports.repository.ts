import { getServerClient } from '@/lib/database/client'
import { DatabaseError } from '@/lib/api/errors'
import type { DailyReport } from '@/types/database.types'
import type { CreateReportInput } from '@/lib/validators/report.schema'

export const reportsRepository = {
  async findAll(limit = 30) {
    const db = getServerClient()
    const { data, error } = await db.from('daily_reports')
      .select('*').order('report_date', { ascending: false }).limit(limit)
    if (error) throw new DatabaseError(error.message, error)
    return data ?? []
  },

  async findByDate(date: string): Promise<DailyReport | null> {
    const db = getServerClient()
    const { data, error } = await db.from('daily_reports').select('*').eq('report_date', date).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async findById(id: string): Promise<DailyReport | null> {
    const db = getServerClient()
    const { data, error } = await db.from('daily_reports').select('*').eq('id', id).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async upsert(input: CreateReportInput): Promise<DailyReport> {
    const db = getServerClient()
    const { data, error } = await db.from('daily_reports')
      .upsert(input as Record<string, unknown>, { onConflict: 'report_date' })
      .select().single()
    if (error) throw new DatabaseError(error.message, error)
    return data
  },

  async updateStatus(id: string, status: DailyReport['status'], extra?: Partial<DailyReport>) {
    const db = getServerClient()
    const { error } = await db.from('daily_reports')
      .update({ status, ...extra } as Record<string, unknown>).eq('id', id)
    if (error) throw new DatabaseError(error.message, error)
  },

  async findLatestReady(): Promise<DailyReport | null> {
    const db = getServerClient()
    const { data, error } = await db.from('daily_reports')
      .select('*').eq('status', 'ready').order('report_date', { ascending: false }).limit(1).single()
    if (error?.code === 'PGRST116') return null
    if (error) throw new DatabaseError(error.message, error)
    return data
  },
}
