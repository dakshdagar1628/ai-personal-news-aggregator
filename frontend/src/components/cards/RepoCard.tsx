import { Star, Code2 } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { cn } from '@/lib/utils'
import type { MockRepo } from '@/data/mock/repos'

const langColors: Record<string, string> = {
  Python: 'bg-blue-500', TypeScript: 'bg-blue-400', JavaScript: 'bg-yellow-400',
  Rust: 'bg-orange-500', Go: 'bg-cyan-500', default: 'bg-slate-400'
}

export function RepoCard({ repo, className }: { repo: MockRepo; className?: string }) {
  return (
    <article className={cn('group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <a href={repo.url} target="_blank" rel="noopener noreferrer"
          className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
          {repo.owner}/{repo.name}
        </a>
        <Badge variant="outline" className="shrink-0">
          <span className={cn('h-2 w-2 rounded-full', langColors[repo.language] ?? langColors.default)} />
          {repo.language}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{repo.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 3).map(t => <Badge key={t} variant="outline">#{t}</Badge>)}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <Star size={11} />{(repo.stars / 1000).toFixed(1)}k
          </span>
          <span className="flex items-center gap-1 text-emerald-500">
            <Code2 size={10} />+{repo.starsToday}
          </span>
        </div>
      </div>
    </article>
  )
}
