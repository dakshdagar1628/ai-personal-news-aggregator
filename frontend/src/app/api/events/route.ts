import { NextRequest } from 'next/server';
import { ok, fail, paginated } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10);
  const limit = 20;
  const from = (page - 1) * limit;
  if (!isSupabaseConfigured()) return ok([]);
  const db = getServerClient();
  try {
    const { data, count, error } = await db.from('semantic_groups')
      .select('*', { count: 'exact' })
      .order('first_seen', { ascending: false })
      .range(from, from + limit - 1);
    if (error) return fail(error);
    return paginated(data ?? [], count ?? 0, page, limit);
  } catch (e) { return fail(e); }
}
