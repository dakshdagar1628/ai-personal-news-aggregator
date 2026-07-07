import type { ReportEvent } from './types';

interface RawArticle {
  id: string; title: string; url: string;
  semantic_group_id?: string; importance_score?: number;
  categories?: string[]; primary_category?: string;
  source_slug?: string; summary_short?: string;
}

export function groupIntoEvents(articles: RawArticle[]): ReportEvent[] {
  const groups = new Map<string, RawArticle[]>();

  for (const a of articles) {
    const key = a.semantic_group_id ?? a.id;
    const arr = groups.get(key) ?? [];
    arr.push(a);
    groups.set(key, arr);
  }

  return Array.from(groups.entries()).map(([, members]) => {
    const primary = members.reduce((best, cur) =>
      (cur.importance_score ?? 0) > (best.importance_score ?? 0) ? cur : best
    );
    const sources = [...new Set(members.map(m => m.source_slug ?? '').filter(Boolean))];
    return {
      id:               primary.id,
      title:            primary.title,
      description:      primary.summary_short ?? '',
      primary_category: primary.primary_category ?? 'ai-news',
      importance:       primary.importance_score ?? 50,
      news_ids:         members.map(m => m.id),
      source_count:     sources.length,
      sources,
    };
  }).sort((a, b) => b.importance - a.importance);
}
