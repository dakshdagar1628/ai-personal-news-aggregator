import { fetchAPI } from '@/lib/dashboard/fetcher'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { MetricCard } from '@/components/intelligence/MetricCard'
import { HealthCard } from '@/components/intelligence/HealthCard'
import { HeartPulse, CheckCircle, XCircle, Activity } from 'lucide-react'
export const revalidate = 60;
export default async function CollectorHealthPage() {
  const data = await fetchAPI<Record<string,unknown>[]>('/api/collector-health') ?? [];
  const collectors = Array.isArray(data) ? data as Record<string,unknown>[] : [];
  const active  = collectors.filter(c=>c.is_enabled).length;
  const healthy = collectors.filter(c=>c.status==='success'||c.status==='idle').length;
  const failed  = collectors.filter(c=>c.status==='failed').length;
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Collector Health</h1>
        <p className="text-sm text-muted-foreground mt-1">Live status of all {collectors.length} collectors</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total"   value={collectors.length} icon={Activity} />
        <MetricCard label="Active"  value={active}  icon={CheckCircle} color="green" />
        <MetricCard label="Healthy" value={healthy} icon={HeartPulse} color="blue" />
        <MetricCard label="Failed"  value={failed}  icon={XCircle} color={failed>0?'red':'default'} />
      </div>
      <InsightPanel title="All Collectors" icon={HeartPulse}>
        <div className="divide-y divide-border/50">
          {collectors.map(h=>(
            <HealthCard key={String(h.collector_id)} name={String(h.collector_name)} status={String(h.status)}
              lastRun={String(h.last_run_at??'')} stored={Number(h.total_items_stored??0)}
              successRate={Number(h.total_runs??0)>0?Math.round(Number(h.successful_runs??0)/Number(h.total_runs??1)*100):0} />
          ))}
          {collectors.length===0 && <p className="text-sm text-muted-foreground py-4 text-center">No collector data yet. Import and run the n8n collector workflows.</p>}
        </div>
      </InsightPanel>
    </div>
  )
}
