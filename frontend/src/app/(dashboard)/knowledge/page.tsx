import { fetchAPI } from '@/lib/dashboard/fetcher'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { TrendCard } from '@/components/intelligence/TrendCard'
import { Network } from 'lucide-react'
export const revalidate = 600;
export default async function KnowledgePage() {
  const data = await fetchAPI<Record<string,{name:string,count:number}[]>>('/api/knowledge');
  const sections = [
    { key:'companies', title:'Companies' },
    { key:'technologies', title:'Technologies' },
    { key:'models', title:'AI Models' },
    { key:'frameworks', title:'Frameworks' },
    { key:'categories', title:'Categories' },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Knowledge Graph</h1>
        <p className="text-sm text-muted-foreground mt-1">Entity relationships extracted from processed intelligence</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({key,title})=>{
          const items = data?.[key]??[];
          const max = items[0]?.count??1;
          return (
            <InsightPanel key={key} title={title} icon={Network}>
              {items.length>0
                ? items.slice(0,12).map(i=><TrendCard key={i.name} name={i.name} count={i.count} max={max}/>)
                : <p className="text-xs text-muted-foreground py-2">No data yet</p>}
            </InsightPanel>
          )
        })}
      </div>
    </div>
  )
}
