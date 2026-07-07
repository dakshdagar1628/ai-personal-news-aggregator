import {
  LayoutDashboard, Newspaper, Github, Wrench, FlaskConical,
  Play, BookOpen, Gift, FileText, Settings, Zap, Search,
  TrendingUp, Activity, Network, Clock, Bookmark, HeartPulse
} from 'lucide-react'

export const NAV_ITEMS = [
  { href: '/',                  label: 'Dashboard',         icon: LayoutDashboard, group: 'main' },
  { href: '/events',            label: 'Events',            icon: Zap,             group: 'main' },
  { href: '/search',            label: 'Search',            icon: Search,          group: 'main' },
  { href: '/trends',            label: 'Trends',            icon: TrendingUp,      group: 'main' },
  { href: '/timeline',          label: 'Timeline',          icon: Clock,           group: 'main' },
  { href: '/news',              label: 'News Feed',         icon: Newspaper,       group: 'content' },
  { href: '/github',            label: 'GitHub',            icon: Github,          group: 'content' },
  { href: '/tools',             label: 'AI Tools',          icon: Wrench,          group: 'content' },
  { href: '/research',          label: 'Research',          icon: FlaskConical,    group: 'content' },
  { href: '/videos',            label: 'Videos',            icon: Play,            group: 'content' },
  { href: '/blogs',             label: 'Blogs',             icon: BookOpen,        group: 'content' },
  { href: '/offers',            label: 'Free Offers',       icon: Gift,            group: 'content' },
  { href: '/knowledge',         label: 'Knowledge',         icon: Network,         group: 'content' },
  { href: '/bookmarks',         label: 'Bookmarks',         icon: Bookmark,        group: 'content' },
  { href: '/reports',           label: 'Daily Reports',     icon: FileText,        group: 'reports' },
  { href: '/collector-health',  label: 'Collectors',        icon: HeartPulse,      group: 'system' },
  { href: '/processing',        label: 'AI Processing',     icon: Activity,        group: 'system' },
  { href: '/settings',          label: 'Settings',          icon: Settings,        group: 'system' },
] as const

export const NAV_GROUPS = {
  main:    'Intelligence',
  content: 'Content',
  reports: 'Reports',
  system:  'System',
}
