import Link from 'next/link'
import { Newspaper, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { NewsCard } from '@/components/cards/NewsCard'
import { MOCK_NEWS } from '@/data/mock/news'

export function NewsWidget() {
  const items = MOCK_NEWS.slice(0, 4)
  return (
    <section className="space-y-3">
      <SectionHeader
        icon={Newspaper}
        title="Today's AI News"
        description="Most important stories right now"
        action={
          <Link href="/news" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(item => <NewsCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}
