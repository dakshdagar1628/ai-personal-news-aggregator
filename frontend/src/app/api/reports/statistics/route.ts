import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  if (!isSupabaseConfigured()) return ok(MOCK_STATS);
  const db = getServerClient();
  try {
    const { data } = await db.from('daily_reports')
      .select('report_date,total_items,articles_count,sources_count,estimated_read_min,generated_at,generation_duration_ms')
      .eq('status','ready').order('report_date', { ascending: false }).limit(30);
    const reports = data ?? [];
    return ok({
      total_reports:     reports.length,
      latest_date:       reports[0]?.report_date ?? null,
      avg_articles:      Math.round(reports.reduce((s,r) => s+(r.total_items??0),0) / (reports.length||1)),
      avg_duration_ms:   Math.round(reports.reduce((s,r) => s+(r.generation_duration_ms??0),0) / (reports.length||1)),
      reports,
    });
  } catch (e) { return fail(e); }
}

const MOCK_STATS = { total_reports: 0, latest_date: null, avg_articles: 0, avg_duration_ms: 0, reports: [] };
