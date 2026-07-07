import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — use in Client Components
export const supabase = createClient<Database>(url, anon)

// Table name constants — avoids string typos
export const TABLES = {
  NEWS:          'news',
  SOURCES:       'sources',
  CATEGORIES:    'categories',
  DAILY_REPORTS: 'daily_reports',
} as const
