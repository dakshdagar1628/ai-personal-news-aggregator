import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  if (!isSupabaseConfigured()) return ok(MOCK_TRENDS);
  const db = getServerClient();
  try {
    const { data } = await db.from('processed_articles')
      .select('categories,tags_primary,technologies,models,companies')
      .gte('processed_at', new Date(Date.now() - 7*24*60*60*1000).toISOString())
      .limit(500);
    const count = (arr: string[]) => arr.reduce<Record<string,number>>((a,v) => { a[v]=(a[v]??0)+1; return a; }, {});
    const top = (obj: Record<string,number>, n=10) => Object.entries(obj).sort(([,a],[,b])=>b-a).slice(0,n).map(([k,v])=>({name:k,count:v}));
    const allCats   = (data??[]).flatMap(r=>r.categories??[]);
    const allTags   = (data??[]).flatMap(r=>r.tags_primary??[]);
    const allTechs  = (data??[]).flatMap(r=>r.technologies??[]);
    const allModels = (data??[]).flatMap(r=>r.models??[]);
    return ok({ categories: top(count(allCats)), tags: top(count(allTags)), technologies: top(count(allTechs)), models: top(count(allModels),8) });
  } catch (e) { return fail(e); }
}
const MOCK_TRENDS = { categories:[], tags:[], technologies:[], models:[] };
