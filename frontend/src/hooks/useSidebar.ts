'use client'
import { useState, useEffect } from 'react'
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const open  = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(v => !v)
  // Close on route change via resize / escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  return { isOpen, open, close, toggle }
}
