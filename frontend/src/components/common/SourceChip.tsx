import { cn } from '@/lib/utils'

const sourceColors: Record<string, string> = {
  'hacker-news':     'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  'reddit':          'bg-red-500/10 text-red-600 dark:text-red-400',
  'github':          'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  'product-hunt':    'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  'youtube':         'bg-red-600/10 text-red-700 dark:text-red-400',
  'anthropic':       'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  'openai':          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'google':          'bg-blue-500/10 text-blue-600 dark:text-blue-400',
}

export function SourceChip({ source }: { source: string }) {
  const key = Object.keys(sourceColors).find(k => source.toLowerCase().includes(k)) ?? ''
  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium',
      sourceColors[key] ?? 'bg-muted text-muted-foreground')}>
      {source}
    </span>
  )
}
