import { Gift, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { cn } from '@/lib/utils'
import type { MockOffer } from '@/data/mock/offers'

const typeVariant = { credits: 'success', 'free-tier': 'default', trial: 'warning', discount: 'secondary' } as const

export function OfferCard({ offer, className }: { offer: MockOffer; className?: string }) {
  return (
    <article className={cn('group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all', className)}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-emerald-500/10 p-1.5">
          <Gift className="h-3.5 w-3.5 text-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold leading-snug line-clamp-1">{offer.title}</h3>
            <span className="shrink-0 text-xs font-bold text-emerald-500">{offer.value}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{offer.description}</p>
          <div className="flex items-center justify-between">
            <Badge variant={typeVariant[offer.type]}>{offer.type}</Badge>
            <a href={offer.url} target="_blank" rel="noopener noreferrer" aria-label="Open offer">
              <ExternalLink size={12} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
