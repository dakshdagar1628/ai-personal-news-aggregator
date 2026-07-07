import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorCardProps { message?: string; onRetry?: () => void }

export function ErrorCard({ message = 'Something went wrong.', onRetry }: ErrorCardProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-6 w-6 text-red-500 mb-2" />
      <p className="text-sm font-medium text-red-600 dark:text-red-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  )
}
