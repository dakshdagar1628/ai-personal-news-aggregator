import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { cn } from '@/lib/utils'
import type { MockTool } from '@/data/mock/tools'

const pricingVariant = { free: 'success', freemium: 'default', paid: 'secondary' } as const

export function ToolCard({ tool, className }: { tool: MockTool; className?: string }) {
  return (
    <article className={cn('group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-sm group-hover:text-primary transition-colors">{tool.name}</span>
        <Badge variant={pricingVariant[tool.pricing]}>{tool.pricing}</Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tool.description}</p>
      <div className="flex items-center justify-between">
        <Badge variant="outline">{tool.category}</Badge>
        <a href={tool.url} target="_blank" rel="noopener noreferrer" aria-label="Open tool">
          <ExternalLink size={12} className="text-muted-foreground hover:text-primary transition-colors" />
        </a>
      </div>
    </article>
  )
}
