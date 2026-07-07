import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'AI Intelligence OS', template: '%s | AI Intelligence OS' },
  description: 'Your personal AI-powered command center for the AI universe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
