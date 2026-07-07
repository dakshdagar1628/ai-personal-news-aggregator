'use client'
import { useState, useCallback } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { Badge } from '@/components/ui/badge'

interface SearchResult { id:string; title:string; url:string; content_summary?:string; published_at?:string; importance_score?:number; }

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&pageSize=30`);
      const json = await res.json();
      setResults(json.data?.results ?? json.data ?? []);
    } catch { setResults([]); } finally { setLoading(false); }
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Search across all collected intelligence</p></div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&doSearch(query)}
          placeholder="Search news, tools, research, repositories..."
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <button onClick={()=>doSearch(query)}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-xs rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          Search
        </button>
      </div>
      {(searched || results.length > 0) && (
        <InsightPanel title={loading ? 'Searching…' : `${results.length} results`} icon={Search}>
          {loading && <div className="py-8 text-center text-sm text-muted-foreground">Searching…</div>}
          {!loading && results.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No results found for "{query}"</div>}
          <div className="space-y-2">
            {results.map(r=>(
              <div key={r.id} className="flex gap-3 py-2.5 border-b border-border/40 last:border-0 items-start">
                <div className="flex-1 min-w-0">
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-primary transition-colors line-clamp-1 flex items-center gap-1">
                    {r.title} <ExternalLink size={10} className="opacity-40 shrink-0"/>
                  </a>
                  {r.content_summary && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.content_summary}</p>}
                </div>
                {r.importance_score && <Badge variant="outline" className="text-[10px] shrink-0">{Math.round(Number(r.importance_score)*100)}%</Badge>}
              </div>
            ))}
          </div>
        </InsightPanel>
      )}
      {!searched && (
        <InsightPanel title="Search Tips" icon={Search}>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• Search by technology: <span className="text-foreground">llama</span>, <span className="text-foreground">mcp</span>, <span className="text-foreground">claude</span></li>
            <li>• Search by topic: <span className="text-foreground">agents</span>, <span className="text-foreground">rag</span>, <span className="text-foreground">fine-tuning</span></li>
            <li>• Search by company: <span className="text-foreground">anthropic</span>, <span className="text-foreground">openai</span>, <span className="text-foreground">google</span></li>
            <li>• Search by action: <span className="text-foreground">tutorial</span>, <span className="text-foreground">release</span>, <span className="text-foreground">tool</span></li>
          </ul>
        </InsightPanel>
      )}
    </div>
  )
}
