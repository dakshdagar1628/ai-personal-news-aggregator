import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Clock, Minus } from 'lucide-react'

interface HealthCardProps {
  name: string; status: string; lastRun?: string;
  stored?: number; successRate?: number;
}

const icons = { success: CheckCircle, failed: XCircle, running: Clock, idle: Minus, partial: Clock }
const colors = { success:'text-emerald-400', failed:'text-red-400', running:'text-yellow-400', idle:'text-muted-foreground', partial:'text-yellow-400' }

export function HealthCard({ name, status, lastRun, stored=0, successRate=0 }: HealthCardProps) {
  const Icon = icons[status as keyof typeof icons] ?? Minus;
  const color = colors[status as keyof typeof colors] ?? 'text-muted-foreground';
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
      <Icon size={14} className={cn('shrink-0', color)} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground">{lastRun ? new Date(lastRun).toLocaleString() : 'Never'}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs tabular-nums">{stored.toLocaleString()}</p>
        <p className="text-[10px] text-muted-foreground">{successRate}% ok</p>
      </div>
    </div>
  )
}
