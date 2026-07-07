import { NextRequest } from 'next/server';
import { ok, fail, paginated } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET(req: NextRequest) {
  const page     = parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') ?? '30', 10);

  if (!isSupabaseConfigured()) return ok([], 'Mock');
  const db = getServerClient();
  const from = (page - 1) * pageSize;
  const { data, count, error } = await db.from('daily_reports')
    .select('id,report_date,title,summary,status,total_items,estimated_read_min,generated_at', { count: 'exact' })
    .eq('status', 'ready').order('report_date', { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) return fail(error);
  return paginated(data ?? [], count ?? 0, page, pageSize);
}
