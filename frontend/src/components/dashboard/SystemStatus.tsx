import { Activity } from 'lucide-react'
import { StatusChip } from '@/components/common/StatusChip'
import { SectionHeader } from '@/components/common/SectionHeader'

const SOURCES = [
  { name: 'Hacker News',   status: 'active' as const,   lastChecked: '2 min ago' },
  { name: 'OpenAI Blog',   status: 'active' as const,   lastChecked: '5 min ago' },
  { name: 'Anthropic',     status: 'active' as const,   lastChecked: '5 min ago' },
  { name: 'GitHub Trend.', status: 'active' as const,   lastChecked: '12 min ago' },
  { name: 'Reddit AI',     status: 'active' as const,   lastChecked: '8 min ago' },
  { name: 'Product Hunt',  status: 'pending' as const,  lastChecked: '1 hr ago' },
]

export function SystemStatus() {
  return (
    <section className="space-y-3">
      <SectionHeader icon={Activity} title="Source Status" description="Live collection health" />
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {SOURCES.map(s => (
          <div key={s.name} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm">{s.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">{s.lastChecked}</span>
              <StatusChip status={s.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
