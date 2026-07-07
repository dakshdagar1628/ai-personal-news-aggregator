import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/response';
import { generateDailyReport } from '@/lib/reporting/report-generator.service';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { date?: string };
  const date = body.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(new Error('Invalid date'));
  // Mark as regenerating
  if (isSupabaseConfigured()) {
    const db = getServerClient();
    await db.from('daily_reports').update({ status: 'generating', regenerated_at: new Date().toISOString() }).eq('report_date', date);
  }
  try { return ok(await generateDailyReport(date), 'Report regenerated'); } catch (e) { return fail(e); }
}
