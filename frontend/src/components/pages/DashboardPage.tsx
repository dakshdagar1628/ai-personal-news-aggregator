import { StatsRow }     from '@/components/dashboard/StatsRow'
import { NewsWidget }   from '@/components/dashboard/NewsWidget'
import { GitHubWidget } from '@/components/dashboard/GitHubWidget'
import { ReportWidget } from '@/components/dashboard/ReportWidget'
import { SystemStatus } from '@/components/dashboard/SystemStatus'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { OfferCard }    from '@/components/cards/OfferCard'
import { ToolCard }     from '@/components/cards/ToolCard'
import { PaperCard }    from '@/components/cards/PaperCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { MOCK_OFFERS }  from '@/data/mock/offers'
import { MOCK_TOOLS }   from '@/data/mock/tools'
import { MOCK_PAPERS }  from '@/data/mock/papers'
import { Gift, Wrench, FlaskConical, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Good morning 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here's what's happening in AI today — July 6, 2026
        </p>
      </div>

      {/* Stats */}
      <StatsRow />

      {/* Daily Report */}
      <ReportWidget />

      {/* News + Quick Actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2"><NewsWidget /></div>
        <div className="space-y-8">
          <QuickActions />
          <SystemStatus />
        </div>
      </div>

      {/* GitHub Trending */}
      <GitHubWidget />

      {/* Bottom row: Tools + Papers + Offers */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tools */}
        <section className="space-y-3">
          <SectionHeader icon={Wrench} title="New AI Tools" description="Latest from Product Hunt"
            action={<Link href="/tools" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">View all <ArrowRight size={12} /></Link>}
          />
          <div className="space-y-2">
            {MOCK_TOOLS.slice(0, 3).map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>

        {/* Papers */}
        <section className="space-y-3">
          <SectionHeader icon={FlaskConical} title="Research Papers" description="Hot papers today"
            action={<Link href="/research" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">View all <ArrowRight size={12} /></Link>}
          />
          <div className="space-y-2">
            {MOCK_PAPERS.slice(0, 3).map(p => <PaperCard key={p.id} paper={p} />)}
          </div>
        </section>

        {/* Offers */}
        <section className="space-y-3">
          <SectionHeader icon={Gift} title="Free Offers" description="Deals available now"
            action={<Link href="/offers" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">View all <ArrowRight size={12} /></Link>}
          />
          <div className="space-y-2">
            {MOCK_OFFERS.map(o => <OfferCard key={o.id} offer={o} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
