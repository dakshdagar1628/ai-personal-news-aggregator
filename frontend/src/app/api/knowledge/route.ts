import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  if (!isSupabaseConfigured()) return ok(MOCK);
  const db = getServerClient();
  try {
    const { data } = await db.from('processed_articles')
      .select('companies,technologies,models,frameworks,tags_primary,categories')
      .limit(300);
    const merge = (field: string) => {
      const map = new Map<string,number>();
      (data??[]).forEach((r: Record<string,string[]|undefined>) => (r[field]??[]).forEach((v:string)=>map.set(v,(map.get(v)??0)+1)));
      return [...map.entries()].sort(([,a],[,b])=>b-a).slice(0,30).map(([name,count])=>({name,count}));
    };
    return ok({ companies: merge('companies'), technologies: merge('technologies'), models: merge('models'), frameworks: merge('frameworks'), categories: merge('categories') });
  } catch (e) { return fail(e); }
}
const MOCK = { companies:[], technologies:[], models:[], frameworks:[], categories:[] };
