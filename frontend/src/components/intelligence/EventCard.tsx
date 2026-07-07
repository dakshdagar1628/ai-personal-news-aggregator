'use client'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Layers } from 'lucide-react'

interface EventCardProps {
  title: string; description?: string; importance?: number;
  sourceCount?: number; sources?: string[]; primaryCategory?: string;
  newsIds?: string[]; onClick?: () => void;
}

export function EventCard({ title, description, importance=50, sourceCount=1, sources=[], primaryCategory='ai-news', onClick }: EventCardProps) {
  const imp = Math.round(importance);
  const color = imp >= 75 ? 'text-red-400' : imp >= 55 ? 'text-yellow-400' : 'text-emerald-400';
  return (
    <div onClick={onClick} className={cn('rounded-xl border border-border bg-card p-4 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg', onClick && 'cursor-pointer')}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">{title}</h3>
        <span className={cn('text-xs font-bold tabular-nums shrink-0', color)}>{imp}</span>
      </div>
      {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-[10px]">{primaryCategory}</Badge>
        {sourceCount > 1 && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Layers size={10}/>{sourceCount} sources
          </span>
        )}
        {sources.length > 0 && <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{sources.slice(0,2).join(', ')}</span>}
      </div>
    </div>
  )
}
