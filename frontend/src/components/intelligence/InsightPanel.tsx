import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface InsightPanelProps {
  title: string; icon?: LucideIcon; children: React.ReactNode;
  className?: string; action?: React.ReactNode;
}

export function InsightPanel({ title, icon: Icon, children, className, action }: InsightPanelProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-primary" />}
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
