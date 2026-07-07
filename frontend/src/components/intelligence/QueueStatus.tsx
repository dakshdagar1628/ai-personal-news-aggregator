import { cn } from '@/lib/utils'

interface QueueStatusProps { queue: Record<string, number> }

const STATUS_CONFIG = [
  { key:'pending',    label:'Pending',    color:'bg-yellow-500' },
  { key:'processing', label:'Processing', color:'bg-blue-500' },
  { key:'completed',  label:'Completed',  color:'bg-emerald-500' },
  { key:'failed',     label:'Failed',     color:'bg-red-500' },
  { key:'retrying',   label:'Retrying',   color:'bg-orange-500' },
]

export function QueueStatus({ queue }: QueueStatusProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {STATUS_CONFIG.map(({ key, label, color }) => (
        <div key={key} className="rounded-lg border border-border bg-card p-3 text-center">
          <div className={cn('h-1.5 w-1.5 rounded-full mx-auto mb-2', color)} />
          <p className="text-lg font-bold tabular-nums">{queue[key] ?? 0}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  )
}
