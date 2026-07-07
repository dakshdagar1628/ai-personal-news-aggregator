import { fetchAPI } from '@/lib/dashboard/fetcher'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { TrendCard } from '@/components/intelligence/TrendCard'
import { TrendingUp } from 'lucide-react'
export const revalidate = 300;
export default async function TrendsPage() {
  const data = await fetchAPI<Record<string,{name:string,count:number}[]>>('/api/trends');
  const sections = [
    { key:'categories', title:'Categories' },
    { key:'technologies', title:'Technologies' },
    { key:'models', title:'AI Models' },
    { key:'tags', title:'Topics' },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Trend Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">7-day rolling trends from processed intelligence</p></div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map(({key,title})=>{
          const items = data?.[key]??[];
          const max = items[0]?.count??1;
          return (
            <InsightPanel key={key} title={title} icon={TrendingUp}>
              {items.length>0
                ? items.map(i=><TrendCard key={i.name} name={i.name} count={i.count} max={max} />)
                : <p className="text-xs text-muted-foreground py-2">No data yet</p>}
            </InsightPanel>
          )
        })}
      </div>
    </div>
  )
}
