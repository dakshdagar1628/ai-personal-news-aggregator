import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  iconColor?: string
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, iconColor = 'text-primary', className }: StatCardProps) {
  const isPositive = (trend?.value ?? 0) >= 0
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors', className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
        <div className={cn('rounded-lg bg-primary/10 p-1.5')}>
          <Icon className={cn('h-3.5 w-3.5', iconColor)} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      {trend && (
        <div className={cn('mt-2 flex items-center gap-1 text-xs', isPositive ? 'text-emerald-500' : 'text-red-500')}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? '+' : ''}{trend.value}% {trend.label}</span>
        </div>
      )}
    </div>
  )
}
