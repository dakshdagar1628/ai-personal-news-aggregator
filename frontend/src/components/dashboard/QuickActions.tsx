import Link from 'next/link'
import { RefreshCw, FileText, Settings, Github, Wrench, FlaskConical } from 'lucide-react'

const ACTIONS = [
  { label: 'Refresh Sources',  icon: RefreshCw,     href: '#',         color: 'text-blue-500   bg-blue-500/10' },
  { label: 'Generate Report',  icon: FileText,      href: '/reports',  color: 'text-purple-500 bg-purple-500/10' },
  { label: 'GitHub Trending',  icon: Github,        href: '/github',   color: 'text-slate-500  bg-slate-500/10' },
  { label: 'New AI Tools',     icon: Wrench,        href: '/tools',    color: 'text-emerald-500 bg-emerald-500/10' },
  { label: 'Research Papers',  icon: FlaskConical,  href: '/research', color: 'text-orange-500 bg-orange-500/10' },
  { label: 'Settings',         icon: Settings,      href: '/settings', color: 'text-muted-foreground bg-muted' },
]

export function QuickActions() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center hover:border-primary/30 hover:shadow-sm transition-all group">
            <div className={`rounded-lg p-2 ${color.split(' ')[1]}`}>
              <Icon className={`h-4 w-4 ${color.split(' ')[0]}`} />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
