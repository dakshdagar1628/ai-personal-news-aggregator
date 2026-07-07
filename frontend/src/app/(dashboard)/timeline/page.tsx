import { fetchAPI } from '@/lib/dashboard/fetcher'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
export const revalidate = 300;
type Range = 'today'|'week'|'month';
export default async function TimelinePage({ searchParams }: { searchParams: { range?: Range } }) {
  const range = searchParams.range ?? 'today';
  const data = await fetchAPI<Record<string,unknown>[]>(`/api/timeline?range=${range}`) ?? [];
  const items = Array.isArray(data) ? data : [];
  const tabs: {label:string,value:Range}[] = [{label:'Today',value:'today'},{label:'Week',value:'week'},{label:'Month',value:'month'}];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse intelligence chronologically</p></div>
      <div className="flex gap-2">
        {tabs.map(t=>(
          <Link key={t.value} href={`/timeline?range=${t.value}`}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${range===t.value?'bg-primary text-primary-foreground border-primary':'border-border hover:border-primary/50'}`}>
            {t.label}
          </Link>
        ))}
      </div>
      <InsightPanel title={`${items.length} items`} icon={Clock}>
        <div className="space-y-1">
          {items.map((item,i)=>(
            <div key={String(item.id??i)} className="flex gap-3 py-2 border-b border-border/30 last:border-0 items-start">
              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5 w-20 tabular-nums">
                {item.published_at ? new Date(String(item.published_at)).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '--:--'}
              </span>
              <a href={String(item.url??'#')} target="_blank" rel="noopener noreferrer"
                className="text-xs flex-1 hover:text-primary transition-colors line-clamp-1 flex items-start gap-1">
                {String(item.title??'Untitled')}
                <ExternalLink size={10} className="shrink-0 mt-0.5 opacity-50" />
              </a>
              <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">{Math.round(Number(item.importance_score??0))}</span>
            </div>
          ))}
          {items.length===0 && <p className="text-sm text-muted-foreground py-6 text-center">No items for this range yet.</p>}
        </div>
      </InsightPanel>
    </div>
  )
}
