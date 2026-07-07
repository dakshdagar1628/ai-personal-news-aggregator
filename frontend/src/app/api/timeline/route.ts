import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get('range') ?? 'today';
  const days  = range==='week'?7:range==='month'?30:range==='year'?365:1;
  const since = new Date(Date.now()-days*24*60*60*1000).toISOString();
  if (!isSupabaseConfigured()) return ok([]);
  const db = getServerClient();
  try {
    const { data, error } = await db.from('news')
      .select('id,title,url,published_at,importance_score,metadata')
      .gte('published_at', since).order('published_at',{ascending:false}).limit(100);
    if (error) return fail(error);
    return ok(data ?? []);
  } catch (e) { return fail(e); }
}
