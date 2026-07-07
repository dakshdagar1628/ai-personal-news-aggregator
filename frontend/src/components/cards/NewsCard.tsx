import { ExternalLink, Clock } from 'lucide-react'
import { SourceChip } from '@/components/common/SourceChip'
import { Badge } from '@/components/common/Badge'
import { cn, formatDate, formatImportanceScore, getImportanceColor } from '@/lib/utils'
import type { MockNewsItem } from '@/data/mock/news'

export function NewsCard({ item, className }: { item: MockNewsItem; className?: string }) {
  const pct = Math.round(item.importanceScore * 100)
  return (
    <article className={cn('group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <SourceChip source={item.source} />
        <span className={cn('text-xs font-semibold tabular-nums', getImportanceColor(item.importanceScore))}>
          {pct}%
        </span>
      </div>
      <a href={item.url} target="_blank" rel="noopener noreferrer"
        className="group-hover:text-primary transition-colors">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1.5">{item.title}</h3>
      </a>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.summary}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline">#{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex items-center gap-1 text-[10px]">
            <Clock size={10} />{formatDate(item.publishedAt, 'relative')}
          </span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open article">
            <ExternalLink size={12} className="hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </article>
  )
}
