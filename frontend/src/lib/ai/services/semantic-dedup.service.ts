import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export interface DedupResult { is_duplicate: boolean; confidence: number; reason: string; }

export async function checkSemanticDuplicate(
  a: { title: string; summary: string; url: string },
  b: { title: string; summary: string; url: string },
): Promise<DedupResult> {
  const { text, maxTokens, temperature } = renderPrompt('semantic-dedup', {
    title_a: a.title, summary_a: a.summary, url_a: a.url,
    title_b: b.title, summary_b: b.summary, url_b: b.url,
  });
  const ai = getAIProvider();
  const { data } = await ai.completeJSON<DedupResult>(text, { maxTokens, temperature });
  return {
    is_duplicate: data.is_duplicate ?? false,
    confidence:   Math.min(1, Math.max(0, Number(data.confidence) || 0)),
    reason:       data.reason ?? '',
  };
}

export async function findOrCreateSemanticGroup(
  newsId: string,
  title: string,
  summary: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const db = getServerClient();

  // Get recent processed articles for comparison (last 100)
  const { data: candidates } = await db
    .from('processed_articles')
    .select('news_id, semantic_group_id')
    .not('semantic_group_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(100);

  if (!candidates?.length) {
    // Create new group
    const { data: group } = await db.from('semantic_groups')
      .insert({ title, description: summary, sources: [] })
      .select().single();
    return group?.id ?? null;
  }

  // Check top candidates from news table for their summaries
  const { data: articles } = await db.from('news')
    .select('id, title, url')
    .in('id', candidates.slice(0, 5).map(c => c.news_id))
    .limit(5);

  for (const article of articles ?? []) {
    const candidate = candidates.find(c => c.news_id === article.id);
    if (!candidate?.semantic_group_id) continue;
    const result = await checkSemanticDuplicate(
      { title, summary, url: '' },
      { title: article.title, summary: '', url: article.url },
    );
    if (result.is_duplicate && result.confidence >= 0.8) {
      // Increment group count
      await db.from('semantic_groups')
        .update({ item_count: db.rpc('increment', { count: 1 }) as unknown as number })
        .eq('id', candidate.semantic_group_id);
      return candidate.semantic_group_id;
    }
  }

  // No match — new group
  const { data: group } = await db.from('semantic_groups')
    .insert({ title, description: summary, sources: [] })
    .select().single();
  return group?.id ?? null;
}
