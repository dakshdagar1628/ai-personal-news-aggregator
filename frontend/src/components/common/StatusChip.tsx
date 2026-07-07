import { cn } from '@/lib/utils'

type Status = 'active' | 'inactive' | 'error' | 'pending' | 'ready'

const statusMap: Record<Status, { label: string; dot: string; text: string }> = {
  active:   { label: 'Active',   dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  inactive: { label: 'Inactive', dot: 'bg-slate-400',   text: 'text-muted-foreground' },
  error:    { label: 'Error',    dot: 'bg-red-500',     text: 'text-red-600 dark:text-red-400' },
  pending:  { label: 'Pending',  dot: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400' },
  ready:    { label: 'Ready',    dot: 'bg-blue-500',    text: 'text-blue-600 dark:text-blue-400' },
}

export function StatusChip({ status }: { status: Status }) {
  const { label, dot, text } = statusMap[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
