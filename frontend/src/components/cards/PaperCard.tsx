import { FileText, Star, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { cn, formatDate } from '@/lib/utils'
import type { MockPaper } from '@/data/mock/papers'

export function PaperCard({ paper, className }: { paper: MockPaper; className?: string }) {
  return (
    <article className={cn('group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all', className)}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 rounded-lg bg-blue-500/10 p-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
        </div>
        <div className="min-w-0">
          <a href={paper.url} target="_blank" rel="noopener noreferrer">
            <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
              {paper.title}
            </h3>
          </a>
          <p className="text-[11px] text-muted-foreground mb-2">{paper.authors.join(', ')}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{paper.abstract}</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{paper.category}</Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {paper.stars && <span className="flex items-center gap-1 text-amber-500"><Star size={10} />{paper.stars}</span>}
              <span>{formatDate(paper.publishedAt, 'short')}</span>
              <a href={paper.url} target="_blank" rel="noopener noreferrer" aria-label="Open paper">
                <ExternalLink size={11} className="hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
