'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_GROUPS } from './nav-config'
import { Brain, X } from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const groups = Object.entries(NAV_GROUPS) as [keyof typeof NAV_GROUPS, string][]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar panel */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">AI Intelligence<br/><span className="text-muted-foreground font-normal text-xs">OS</span></span>
          </Link>
          <button onClick={onClose} className="lg:hidden rounded-md p-1 hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {groups.map(([group, label]) => {
            const items = NAV_ITEMS.filter(i => i.group === group)
            if (!items.length) return null
            return (
              <div key={group} className="mb-4">
                <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {label}
                </p>
                {items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-sidebar-foreground/70 hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : '')} />
                      {label}
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-4 py-3">
          <p className="text-[10px] text-muted-foreground/50">AI Intelligence OS v0.1.0</p>
        </div>
      </aside>
    </>
  )
}
