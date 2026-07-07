import { fetchAPI } from '@/lib/dashboard/fetcher'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { EventCard } from '@/components/intelligence/EventCard'
import { Zap } from 'lucide-react'
export const revalidate = 300;
export default async function EventsPage() {
  const data = await fetchAPI<{data:Record<string,unknown>[],total:number}>('/api/events');
  const events = data?.data ?? (Array.isArray(data) ? data as Record<string,unknown>[] : []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Event Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Duplicate stories grouped into unified events</p></div>
      <InsightPanel title={`${events.length} Events`} icon={Zap}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.map((e,i)=>(
            <EventCard key={String(e.id??i)} title={String(e.title??'')} description={String(e.description??'')}
              importance={Number(e.importance_score??e.item_count??50)} sourceCount={Number(e.item_count??1)}
              sources={(e.sources as string[])??[]} primaryCategory={String(e.primary_category??'ai-news')} />
          ))}
          {events.length===0 && <p className="text-sm text-muted-foreground col-span-3 py-8 text-center">No events yet. Events appear when semantic duplicate detection groups related stories.</p>}
        </div>
      </InsightPanel>
    </div>
  )
}
