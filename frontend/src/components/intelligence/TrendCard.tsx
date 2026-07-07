interface TrendCardProps { name: string; count: number; max: number; category?: string }

export function TrendCard({ name, count, max }: TrendCardProps) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium truncate">{name}</span>
          <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
