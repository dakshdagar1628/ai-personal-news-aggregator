import { reportsService } from '@/lib/database/reports.service'
import { generateDailyReport } from '@/lib/reporting/report-generator.service'
import { isSupabaseConfigured, getServerClient } from '@/lib/database/client'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { MetricCard } from '@/components/intelligence/MetricCard'
import { FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
export const revalidate = 300;
export default async function ReportsPage() {
  const todayDate = new Date().toISOString().slice(0, 10);
  let today = null;
  if (isSupabaseConfigured()) {
    const db = getServerClient();
    const { data } = await db.from('daily_reports')
      .select('*').eq('report_date', todayDate).eq('status', 'ready').single();
    today = data;
  }
  if (!today) {
    try {
      today = await generateDailyReport(todayDate);
    } catch (e) {
      console.error("Failed to generate/fetch today's report", e);
    }
  }

  const reports = await reportsService.getReports(30);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Daily Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-generated daily intelligence briefings</p></div>
      {today && (
        <InsightPanel title="Today's Report" icon={FileText}>
          <p className="font-semibold text-sm mb-2">{String(today.title??'Daily Intelligence Report')}</p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{String(today.summary??'')}</p>
          <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
            <span>{today.articles_count ?? today.total_items ?? 0} articles</span>
            <span>·</span>
            <span>{today.sources_count ?? 0} sources</span>
            <span>·</span>
            <span>~{today.estimated_read_min ?? 8} min read</span>
          </div>
        </InsightPanel>
      )}
      <InsightPanel title="Report History" icon={FileText}>
        <div className="space-y-1">
          {reports.map((r,i)=>(
            <div key={String(r.id??i)} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
              <span className="text-xs text-muted-foreground w-24 shrink-0 tabular-nums">{String(r.report_date??'')}</span>
              <p className="text-xs flex-1 truncate">{String(r.title??'Intelligence Report')}</p>
              <span className="text-[10px] text-muted-foreground shrink-0">{r.total_items??0} items</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${r.status==='ready'?'bg-emerald-500/10 text-emerald-400':'bg-muted text-muted-foreground'}`}>{String(r.status??'')}</span>
            </div>
          ))}
          {reports.length===0 && <p className="text-sm text-muted-foreground py-6 text-center">No reports yet. Reports are generated daily at 8 PM via n8n.</p>}
        </div>
      </InsightPanel>
    </div>
  )
}
