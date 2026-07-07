import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

interface RecommendationCardProps {
  title: string; url?: string; action: string; explanation?: string;
  importanceScore?: number; categories?: string[];
}

const actionColors: Record<string,string> = {
  should_read:    'bg-blue-500/10 text-blue-400 border-blue-500/30',
  should_watch:   'bg-purple-500/10 text-purple-400 border-purple-500/30',
  should_install: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  should_star:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  should_learn:   'bg-orange-500/10 text-orange-400 border-orange-500/30',
}
const actionLabels: Record<string,string> = {
  should_read:'Read','should_watch':'Watch','should_install':'Install','should_star':'Star','should_learn':'Learn',
}

export function RecommendationCard({ title, url, action, explanation, importanceScore=50, categories=[] }: RecommendationCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">{title}</p>
        <Badge className={cn('text-[10px] shrink-0 border', actionColors[action] ?? 'bg-muted text-muted-foreground')}>
          {actionLabels[action] ?? action}
        </Badge>
      </div>
      {explanation && <p className="text-xs text-muted-foreground line-clamp-2">{explanation}</p>}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {categories.slice(0,2).map(c=><Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{importanceScore}%</span>
          {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink size={12}/></a>}
        </div>
      </div>
    </div>
  )
}
