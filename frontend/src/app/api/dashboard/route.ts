import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  if (!isSupabaseConfigured()) return ok(MOCK);
  const db = getServerClient();
  try {
    const today = new Date().toISOString().slice(0,10);
    const [reportRes, queueRes, healthRes, newsRes] = await Promise.allSettled([
      db.from('daily_reports').select('id,report_date,title,summary,total_items,status,estimated_read_min,statistics,top_stories,learn_today,action_center,trends').eq('report_date', today).single(),
      db.from('processing_queue').select('status'),
      db.from('collector_health').select('collector_id,collector_name,status,total_items_stored,last_run_at,successful_runs,failed_runs').order('total_items_stored', { ascending: false }).limit(8),
      db.from('news').select('id,title,url,published_at,importance_score,is_processed').order('collected_at', { ascending: false }).limit(5),
    ]);
    const report  = reportRes.status  === 'fulfilled' ? reportRes.value.data  : null;
    const queueRows = queueRes.status === 'fulfilled' ? queueRes.value.data ?? [] : [];
    const health  = healthRes.status  === 'fulfilled' ? healthRes.value.data ?? [] : [];
    const recent  = newsRes.status    === 'fulfilled' ? newsRes.value.data  ?? [] : [];
    const queue   = queueRows.reduce<Record<string,number>>((a,r) => { a[r.status]=(a[r.status]??0)+1; return a; }, {});
    return ok({ report, queue, health, recent_news: recent, generated_at: new Date().toISOString() });
  } catch (e) { return fail(e); }
}

const MOCK = { report: null, queue: { pending: 0, completed: 0, failed: 0 }, health: [], recent_news: [], generated_at: new Date().toISOString() };
