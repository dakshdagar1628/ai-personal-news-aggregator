import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string; value: string | number; sub?: string;
  icon?: LucideIcon; color?: 'default'|'green'|'yellow'|'red'|'blue'|'violet';
  className?: string;
}

const colors = {
  default:'bg-card border-border text-foreground',
  green:  'bg-emerald-950/40 border-emerald-800/50 text-emerald-300',
  yellow: 'bg-yellow-950/40 border-yellow-800/50 text-yellow-300',
  red:    'bg-red-950/40 border-red-800/50 text-red-300',
  blue:   'bg-blue-950/40 border-blue-800/50 text-blue-300',
  violet: 'bg-violet-950/40 border-violet-800/50 text-violet-300',
}

export function MetricCard({ label, value, sub, icon: Icon, color='default', className }: MetricCardProps) {
  return (
    <div className={cn('rounded-xl border p-4 flex flex-col gap-1', colors[color], className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</span>
        {Icon && <Icon size={14} className="opacity-50" />}
      </div>
      <span className="text-2xl font-bold">{value}</span>
      {sub && <span className="text-xs opacity-60">{sub}</span>}
    </div>
  )
}
