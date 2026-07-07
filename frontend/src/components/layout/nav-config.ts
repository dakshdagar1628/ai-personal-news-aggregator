import {
  LayoutDashboard, Newspaper, Github, Wrench, FlaskConical,
  Play, BookOpen, Gift, FileText, Settings
} from 'lucide-react'

export const NAV_ITEMS = [
  { href: '/',          label: 'Dashboard',       icon: LayoutDashboard, group: 'main' },
  { href: '/news',      label: 'News Feed',        icon: Newspaper,       group: 'content' },
  { href: '/github',    label: 'GitHub',           icon: Github,          group: 'content' },
  { href: '/tools',     label: 'AI Tools',         icon: Wrench,          group: 'content' },
  { href: '/research',  label: 'Research',         icon: FlaskConical,    group: 'content' },
  { href: '/videos',    label: 'Videos',           icon: Play,            group: 'content' },
  { href: '/blogs',     label: 'Blogs',            icon: BookOpen,        group: 'content' },
  { href: '/offers',    label: 'Free Offers',      icon: Gift,            group: 'content' },
  { href: '/reports',   label: 'Daily Reports',    icon: FileText,        group: 'reports' },
  { href: '/settings',  label: 'Settings',         icon: Settings,        group: 'system' },
] as const

export const NAV_GROUPS = {
  main: 'Overview',
  content: 'Content',
  reports: 'Reports',
  system: 'System',
}
