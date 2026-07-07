import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/response';
import { generateDailyReport } from '@/lib/reporting/report-generator.service';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET(_req: NextRequest, { params }: { params: { date: string } }) {
  const { date } = params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(new Error('Invalid date format. Use YYYY-MM-DD'));
  if (isSupabaseConfigured()) {
    const db = getServerClient();
    const { data } = await db.from('daily_reports').select('*').eq('report_date', date).eq('status','ready').single();
    if (data) return ok(data);
  }
  try { return ok(await generateDailyReport(date)); } catch (e) { return fail(e); }
}
