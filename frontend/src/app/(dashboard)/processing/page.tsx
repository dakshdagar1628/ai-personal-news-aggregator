import { fetchAPI } from '@/lib/dashboard/fetcher'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { MetricCard } from '@/components/intelligence/MetricCard'
import { QueueStatus } from '@/components/intelligence/QueueStatus'
import { Activity } from 'lucide-react'
export const revalidate = 60;
export default async function ProcessingPage() {
  const [queueData, statsData] = await Promise.all([
    fetchAPI<Record<string,number>>('/api/processing/queue?action=stats'),
    fetchAPI<Record<string,unknown>>('/api/processing/stats'),
  ]);
  const queue = queueData ?? {};
  const stats = statsData ?? {};
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">AI Processing</h1>
        <p className="text-sm text-muted-foreground mt-1">Processing queue and intelligence engine status</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total Processed" value={Number(stats.total_processed??0).toLocaleString()} icon={Activity} color="violet" />
        <MetricCard label="Avg Time"        value={`${Math.round(Number(stats.avg_processing_ms??0)/1000)}s`} icon={Activity} color="blue" />
        <MetricCard label="Tokens Used"     value={Number(stats.total_tokens_used??0).toLocaleString()} icon={Activity} color="green" />
        <MetricCard label="Failed"          value={queue.failed??0} icon={Activity} color={(queue.failed??0)>0?'red':'default'} />
      </div>
      <InsightPanel title="Queue Status" icon={Activity}>
        <QueueStatus queue={queue} />
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div><span className="font-medium text-foreground">Provider:</span> {String(stats.ai_provider??'claude')}</div>
          <div><span className="font-medium text-foreground">Model:</span> {String(stats.model_used??'claude-sonnet-4-6')}</div>
        </div>
      </InsightPanel>
    </div>
  )
}
