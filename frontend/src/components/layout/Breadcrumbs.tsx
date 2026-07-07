'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const labels: Record<string, string> = {
  news: 'News Feed', github: 'GitHub', tools: 'AI Tools',
  research: 'Research', videos: 'Videos', blogs: 'Blogs',
  offers: 'Free Offers', reports: 'Daily Reports', settings: 'Settings',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home size={12} /> Dashboard
      </Link>
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1">
          <ChevronRight size={12} />
          <span className={i === segments.length - 1 ? 'text-foreground font-medium' : 'hover:text-foreground transition-colors'}>
            {labels[seg] ?? seg}
          </span>
        </span>
      ))}
    </nav>
  )
}
