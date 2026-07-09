import { MOCK_NEWS }   from '@/data/mock/news'
import { MOCK_REPOS }  from '@/data/mock/repos'
import { MOCK_TOOLS }  from '@/data/mock/tools'
import { MOCK_PAPERS } from '@/data/mock/papers'
import { MOCK_OFFERS } from '@/data/mock/offers'
import { CATEGORIES }  from '@/../../config/categories.config'
import { SOURCES }     from '@/../../config/sources.config'

// Lightweight mock categories/sources that mirror DB shape
export const MOCK_CATEGORIES = CATEGORIES.map((c, i) => ({
  id: `cat-${i+1}`, name: c.name, slug: c.slug, description: c.description,
  color: c.color, icon: c.icon, is_active: true, sort_order: c.sortOrder,
  created_at: '2026-07-01T00:00:00Z',
}))

export const MOCK_SOURCES = SOURCES.map((s, i) => ({
  id: `src-${i+1}`, name: s.name, slug: s.slug, type: s.type, url: s.url,
  is_active: true, check_interval_minutes: s.checkIntervalMinutes,
  last_checked_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
  error_count: 0, metadata: s.metadata ?? null,
  created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z',
}))

export const MOCK_NEWS_DB = MOCK_NEWS.map((n, i) => ({
  id: n.id, source_id: `src-${(i % 5) + 1}`, category_id: `cat-${(i % 12) + 1}`,
  title: n.title, url: n.url, url_hash: `hash-${n.id}`,
  content_raw: null, content_summary: n.summary, author: null,
  published_at: n.publishedAt, collected_at: n.publishedAt,
  importance_score: n.importanceScore, tags: n.tags,
  is_processed: true, is_featured: n.importanceScore > 0.9,
  is_duplicate: false, duplicate_of: null, metadata: null,
  created_at: n.publishedAt, updated_at: n.publishedAt,
}))

export const MOCK_REPORT_DB = {
  id: 'report-today',
  report_date: '2026-07-06',
  title: 'AI Intelligence Digest — July 6, 2026',
  summary: 'A landmark day for frontier AI: Claude 4 shipped, GPT-5 technical report published, and Gemini Ultra 2 set a new MMLU record.',
  top_stories: MOCK_NEWS_DB.slice(0, 5).map(n => ({
    news_id: n.id, title: n.title, url: n.url,
    source_name: 'Various', importance_score: n.importance_score ?? 0.8, summary: n.content_summary ?? '',
  })),
  content_by_category: {},
  total_items: 48, processed_items: 48,
  status: 'ready' as const, generated_at: '2026-07-06T05:30:00Z',
  generation_duration_ms: 12400, ai_model_used: 'claude-opus-4-5', ai_tokens_used: 8200,
  metadata: null, created_at: '2026-07-06T05:30:00Z', updated_at: '2026-07-06T05:30:00Z',
}

export { MOCK_NEWS, MOCK_REPOS, MOCK_TOOLS, MOCK_PAPERS, MOCK_OFFERS }
