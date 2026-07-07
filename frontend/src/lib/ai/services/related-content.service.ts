import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export interface RelatedResult { related_ids: string[]; reasoning: string; }

export async function findRelatedArticles(params: {
  newsId: string; title: string; summary: string; tags: string[]; categories: string[];
}): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const db = getServerClient();

  const { data: candidates } = await db.from('processed_articles')
    .select('news_id, tags_primary, categories, summary_short')
    .neq('news_id', params.newsId)
    .order('importance_score', { ascending: false })
    .limit(20);

  if (!candidates?.length) return [];

  const { data: articles } = await db.from('news')
    .select('id, title')
    .in('id', candidates.map(c => c.news_id));

  const articleMap = Object.fromEntries((articles ?? []).map(a => [a.id, a]));
  const candidatesText = candidates
    .map(c => {
      const a = articleMap[c.news_id];
      if (!a) return null;
      return `{"id":"${c.news_id}","title":${JSON.stringify(a.title)},"summary":${JSON.stringify(c.summary_short ?? '')}}`;
    })
    .filter(Boolean)
    .join(',\n');

  const { text, maxTokens, temperature } = renderPrompt('related', {
    title: params.title, summary: params.summary,
    tags: params.tags.join(', '), categories: params.categories.join(', '),
    candidates: `[${candidatesText}]`,
  });

  const ai = getAIProvider();
  const { data } = await ai.completeJSON<RelatedResult>(text, { maxTokens, temperature });
  return Array.isArray(data.related_ids) ? data.related_ids.slice(0, 5) : [];
}
