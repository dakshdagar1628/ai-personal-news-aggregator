'use client'
import { Menu, Bell, User } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Breadcrumbs } from './Breadcrumbs'

interface TopNavProps { onMenuClick: () => void }

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-md p-1.5 hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <SearchInput placeholder="Search..." className="hidden md:block w-48 lg:w-64" />
        <ThemeToggle />
        <button className="relative rounded-lg p-1.5 hover:bg-muted transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors" aria-label="Profile">
          <User className="h-4 w-4 text-primary" />
        </button>
      </div>
    </header>
  )
}
