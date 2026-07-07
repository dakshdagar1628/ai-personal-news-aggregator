import { LucideIcon, icons } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface PageShellProps {
  title: string
  description: string
  icon: string
}

export function PageShell({ title, description, icon }: PageShellProps) {
  const Icon = (icons[icon as keyof typeof icons] ?? icons.Layers) as LucideIcon
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <EmptyState
        icon={Icon}
        title="Coming in Phase 3"
        description="Collectors for this section will be built in the next phase."
      />
    </div>
  )
}
