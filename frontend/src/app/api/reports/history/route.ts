import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '30', 10);
  if (!isSupabaseConfigured()) return ok([]);
  const db = getServerClient();
  const { data, error } = await db.from('daily_reports')
    .select('id,report_date,title,status,total_items,estimated_read_min,generated_at,sources_count,articles_count')
    .order('report_date', { ascending: false }).limit(limit);
  if (error) return fail(error);
  return ok(data ?? []);
}
