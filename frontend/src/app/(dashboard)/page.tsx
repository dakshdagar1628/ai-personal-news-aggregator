import { getServerClient, isSupabaseConfigured } from '@/lib/database/client'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { MetricCard } from '@/components/intelligence/MetricCard'
import { EventCard } from '@/components/intelligence/EventCard'
import { TrendCard } from '@/components/intelligence/TrendCard'
import { HealthCard } from '@/components/intelligence/HealthCard'
import { RecommendationCard } from '@/components/intelligence/RecommendationCard'
import { QueueStatus } from '@/components/intelligence/QueueStatus'
import { Zap, TrendingUp, HeartPulse, BookOpen, Activity, FileText } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 300;

export default async function DashboardHome() {
  let report: any = null;
  let queue: Record<string, number> = { pending: 0, completed: 0, failed: 0 };
  let health: any[] = [];
  let recs: any[] = [];
  let topCats: any[] = [];

  if (isSupabaseConfigured()) {
    const db = getServerClient();
    const today = new Date().toISOString().slice(0, 10);
    const [reportRes, queueRes, healthRes, recsRes, processedRes] = await Promise.allSettled([
      db.from('daily_reports').select('id,report_date,title,summary,total_items,status,estimated_read_min,statistics,top_stories,learn_today,action_center,trends').eq('report_date', today).single(),
      db.from('processing_queue').select('status'),
      db.from('collector_health').select('collector_id,collector_name,status,total_items_stored,last_run_at,successful_runs,failed_runs').order('total_items_stored', { ascending: false }).limit(8),
      db.from('processed_articles').select('news_id,recommended_action,action_explanation,importance_score,developer_score,categories,news!inner(title,url)').neq('recommended_action', 'should_ignore').neq('recommended_action', null).order('importance_score', { ascending: false }).limit(20),
      db.from('processed_articles').select('categories').gte('processed_at', new Date(Date.now() - 7*24*60*60*1000).toISOString()).limit(500),
    ]);

    report = reportRes.status === 'fulfilled' ? reportRes.value.data : null;
    const queueRows = queueRes.status === 'fulfilled' ? queueRes.value.data ?? [] : [];
    queue = queueRows.reduce<Record<string, number>>((a, r) => {
      a[r.status] = (a[r.status] ?? 0) + 1;
      return a;
    }, {});
    health = healthRes.status === 'fulfilled' ? healthRes.value.data ?? [] : [];
    recs = recsRes.status === 'fulfilled' ? recsRes.value.data ?? [] : [];

    const processedData = processedRes.status === 'fulfilled' ? processedRes.value.data ?? [] : [];
    const count = (arr: string[]) => arr.reduce<Record<string, number>>((a, v) => { a[v] = (a[v] ?? 0) + 1; return a; }, {});
    const top = (obj: Record<string, number>, n = 10) => Object.entries(obj).sort(([, a], [, b]) => b - a).slice(0, n).map(([k, v]) => ({ name: k, count: v }));
    const allCats = processedData.flatMap(r => r.categories ?? []);
    topCats = top(count(allCats));
  }

  const maxCat = topCats[0]?.count ?? 1;
  const topRecs = recs.slice(0, 6) as any[];
  const stats = report?.statistics as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">AI Intelligence OS</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {report ? String(report.title ?? 'Daily briefing ready') : 'No report yet — run collectors to generate intelligence'}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Articles Today"    value={stats?.articles_processed ?? 0} icon={FileText} color="violet" />
        <MetricCard label="Sources Active"    value={stats?.sources_count ?? health.length} icon={HeartPulse} color="green" />
        <MetricCard label="Queue Pending"     value={queue.pending ?? 0} icon={Activity} color={(queue.pending??0)>20?'yellow':'default'} />
        <MetricCard label="Avg Importance"    value={`${stats?.avg_importance ?? 0}%`} icon={Zap} color="blue" />
      </div>

      {/* Executive summary */}
      {report?.summary && (
        <InsightPanel title="Today's Intelligence" icon={FileText} action={<Link href="/reports" className="text-xs text-primary hover:underline">Full Report →</Link>}>
          <p className="text-sm text-muted-foreground leading-relaxed">{String(report.summary)}</p>
          {Array.isArray(report.key_themes) && report.key_themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {(report.key_themes as string[]).map(t=>(
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
              ))}
            </div>
          )}
        </InsightPanel>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Top Events */}
        <div className="lg:col-span-2">
          <InsightPanel title="Top Events" icon={Zap} action={<Link href="/events" className="text-xs text-primary hover:underline">All →</Link>}>
            <div className="space-y-3">
              {Array.isArray(report?.top_stories) && (report.top_stories as Record<string,unknown>[]).slice(0,5).map((s,i)=>(
                <EventCard key={String(s.news_id??i)} title={String(s.title??'')} description={String(s.summary??'')}
                  importance={Number(s.importance_score??50)} primaryCategory={String(s.category??'ai-news')} />
              ))}
              {!report?.top_stories && <p className="text-sm text-muted-foreground text-center py-4">No events yet — collectors need to run first.</p>}
            </div>
          </InsightPanel>
        </div>

        {/* Trending */}
        <div className="space-y-4">
          <InsightPanel title="Trending" icon={TrendingUp} action={<Link href="/trends" className="text-xs text-primary hover:underline">All →</Link>}>
            <div className="space-y-1">
              {topCats.map(c=><TrendCard key={c.name} name={c.name} count={c.count} max={maxCat} />)}
              {topCats.length===0 && <p className="text-xs text-muted-foreground py-2">No trend data yet</p>}
            </div>
          </InsightPanel>

          <InsightPanel title="AI Queue" icon={Activity}>
            <QueueStatus queue={queue} />
          </InsightPanel>
        </div>
      </div>

      {/* Recommendations */}
      {topRecs.length > 0 && (
        <InsightPanel title="Action Center" icon={Zap} action={<Link href="/search?filter=recommended" className="text-xs text-primary hover:underline">All →</Link>}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topRecs.map((r,i)=>(
              <RecommendationCard key={String(r.news_id??i)} title={String((r.news as Record<string,unknown>|null)?.title??'')}
                url={String((r.news as Record<string,unknown>|null)?.url??'')} action={String(r.recommended_action??'should_read')}
                explanation={String(r.action_explanation??'')} importanceScore={Number(r.importance_score??50)}
                categories={Array.isArray(r.categories)?r.categories as string[]:[]} />
            ))}
          </div>
        </InsightPanel>
      )}

      {/* Collector health */}
      {health.length > 0 && (
        <InsightPanel title="Collector Health" icon={HeartPulse} action={<Link href="/collector-health" className="text-xs text-primary hover:underline">All →</Link>}>
          <div className="divide-y divide-border/50">
            {health.map(h=>(
              <HealthCard key={String(h.collector_id)} name={String(h.collector_name)} status={String(h.status)}
                lastRun={String(h.last_run_at??'')} stored={Number(h.total_items_stored??0)}
                successRate={Number(h.total_runs??0)>0?Math.round(Number(h.successful_runs??0)/Number(h.total_runs??1)*100):0} />
            ))}
          </div>
        </InsightPanel>
      )}
    </div>
  )
}
