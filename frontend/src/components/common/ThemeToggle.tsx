'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />

  const options = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'system', icon: Monitor },
  ] as const

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={`${value} theme`}
          className={cn(
            'rounded-md p-1.5 transition-colors',
            theme === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  )
}
