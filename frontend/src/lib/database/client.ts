import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

let _client: SupabaseClient<Database> | null = null

export function getServerClient(): SupabaseClient<Database> {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not configured')
  _client = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  return _client
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
