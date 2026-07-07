import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  if (!isSupabaseConfigured()) return ok(MOCK);
  const db = getServerClient();
  try {
    const { data } = await db.from('processed_articles')
      .select('news_id,recommended_action,action_explanation,importance_score,developer_score,categories,news!inner(title,url)')
      .neq('recommended_action','should_ignore').neq('recommended_action',null)
      .order('importance_score', { ascending: false }).limit(20);
    return ok(data ?? []);
  } catch (e) { return fail(e); }
}
const MOCK = [];
