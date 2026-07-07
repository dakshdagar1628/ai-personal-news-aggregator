import { ok, fail } from '@/lib/api/response';
import { generateDailyReport } from '@/lib/reporting/report-generator.service';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  // Return cached if exists
  if (isSupabaseConfigured()) {
    const db = getServerClient();
    const { data } = await db.from('daily_reports')
      .select('*').eq('report_date', today).eq('status', 'ready').single();
    if (data) return ok(data, 'Cached report');
  }
  try { return ok(await generateDailyReport(today)); } catch (e) { return fail(e); }
}
