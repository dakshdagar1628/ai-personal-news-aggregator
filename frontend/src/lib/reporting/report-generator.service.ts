import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';
import { getAIProvider } from '@/lib/ai/providers/provider-factory';
import { renderPrompt } from '@/lib/ai/prompts/prompt-loader';
import { logger } from '@/lib/logging/logger';
import { groupIntoEvents } from './event-grouper.service';
import {
  buildTopStories, buildCompanyUpdates, buildGitHubHighlights,
  buildResearchPapers, buildOpportunities, buildActionCenter, buildStatistics,
} from './section-builder.service';
import type { DailyReport } from './types';

export const REPORT_PROMPT_VERSION = '1.0.0';

export async function generateDailyReport(date?: string): Promise<DailyReport> {
  const start = Date.now();
  const reportDate = date ?? new Date().toISOString().slice(0, 10);

  if (!isSupabaseConfigured()) return MOCK_REPORT(reportDate);

  const db = getServerClient();
  await db.from('daily_reports').upsert(
    { report_date: reportDate, status: 'generating', title: `Daily Intelligence Report — ${reportDate}` },
    { onConflict: 'report_date' }
  );

  // Fetch processed articles for the day
  const dayStart = `${reportDate}T00:00:00Z`;
  const dayEnd   = `${reportDate}T23:59:59Z`;

  const { data: processed, error } = await db
    .from('processed_articles')
    .select(`
      news_id, summary_short, summary_medium, executive_summary, bullet_summary,
      categories, primary_category, tags_primary, tags_secondary, keywords,
      technologies, frameworks, models, companies, apis,
      importance_score, developer_score, learning_score, business_score,
      urgency_score, innovation_score, confidence_score, score_explanations,
      recommended_action, action_explanation, action_details,
      related_items, semantic_group_id, language, processed_at,
      news!inner(id, title, url, author, published_at, source_id, estimated_read_time,
                 source_slug:metadata->>source_slug)
    `)
    .gte('processed_at', dayStart)
    .lte('processed_at', dayEnd)
    .order('importance_score', { ascending: false })
    .limit(500);

  if (error) throw error;

  // Flatten join
  const articles = (processed ?? []).map((p: any) => {
    const n = p.news ?? {};
    return { ...p, title: n.title, url: n.url, estimated_read_time: n.estimated_read_time, source_slug: n.source_slug };
  }) as any[];

  if (!articles.length) {
    await db.from('daily_reports').update({ status: 'ready', total_items: 0 }).eq('report_date', reportDate);
    return MOCK_REPORT(reportDate);
  }

  // Build sections
  const events       = groupIntoEvents(articles);
  const topStories   = buildTopStories(articles);
  const companies    = buildCompanyUpdates(articles);
  const github       = buildGitHubHighlights(articles);
  const research     = buildResearchPapers(articles);
  const opportunities= buildOpportunities(articles);
  const actions      = buildActionCenter(articles);
  const stats        = buildStatistics(articles, start);
  const tutorials    = articles
    .filter(a => (a.categories ?? []).some((c: string) => ['tutorial','video'].includes(c)))
    .sort((a: any, b: any) => (b.learning_score ?? 0) - (a.learning_score ?? 0))
    .slice(0, 8).map((a: {news_id:string;title?:string;url?:string;summary_short?:string;recommended_action?:string;estimated_read_time?:number;related_items?:string[];importance_score?:number;developer_score?:number;primary_category?:string;score_explanations?:Record<string,string>}) => ({
      news_id: a.news_id, title: a.title ?? '', url: a.url ?? '', summary: a.summary_short ?? '',
      importance_score: a.importance_score ?? 50, developer_score: a.developer_score ?? 50,
      source: '', category: a.primary_category ?? 'tutorial',
      why_it_matters: a.score_explanations?.learning ?? '', recommended_action: 'should_watch',
      estimated_read_min: a.estimated_read_time ?? 15, related_ids: a.related_items ?? [],
    }));

  // AI-generated sections
  const ai = getAIProvider();
  const topCategoriesText = stats.top_categories.map(c => `${c.category}:${c.count}`).join(', ');
  const topStoriesText    = topStories.slice(0, 5).map(s => s.title).join('\n');

  const [execResult, trendsResult, learnResult] = await Promise.allSettled([
    ai.completeJSON(renderPrompt('report-executive', {
      date: reportDate, article_count: articles.length,
      source_count: stats.sources_count, top_categories: topCategoriesText, top_stories: topStoriesText,
    }).text, { maxTokens: 512, temperature: 0.3 }),
    ai.completeJSON(renderPrompt('report-trends', {
      date: reportDate, categories: topCategoriesText,
      tags: [...new Set(articles.flatMap((a: {tags_primary?: string[]}) => a.tags_primary ?? []))].slice(0,15).join(', '),
      companies: stats.top_companies.slice(0,8).join(', '),
      models: [...new Set(articles.flatMap((a: {models?: string[]}) => a.models ?? []))].slice(0,8).join(', '),
      technologies: stats.top_technologies.slice(0,8).join(', '),
    }).text, { maxTokens: 512, temperature: 0.3 }),
    ai.completeJSON(renderPrompt('report-learn', {
      technologies: stats.top_technologies.slice(0,5).join(', '),
      categories: topCategoriesText,
      top_learning_article: articles.sort((a: any, b: any) => (b.learning_score ?? 0) - (a.learning_score ?? 0))[0]?.title ?? '',
    }).text, { maxTokens: 384, temperature: 0.3 }),
  ]);

  const exec   = execResult.status   === 'fulfilled' ? execResult.value.data   as Record<string,unknown> : {};
  const trends = trendsResult.status === 'fulfilled' ? trendsResult.value.data as Record<string,unknown> : {};
  const learn  = learnResult.status  === 'fulfilled' ? learnResult.value.data  as Record<string,unknown> : {};

  const headline           = String(exec.headline ?? `AI Intelligence Report — ${reportDate}`);
  const summary            = String(exec.summary ?? '');
  const estimated_read_min = Number(exec.estimated_read_min ?? 8);

  // Store report
  const { data: stored } = await db.from('daily_reports').upsert({
    report_date:         reportDate,
    title:               headline,
    summary,
    status:              'ready',
    version:             1,
    prompt_version:      REPORT_PROMPT_VERSION,
    top_stories:         topStories,
    ai_company_updates:  companies,
    github_highlights:   github,
    tools:               [],
    research_papers:     research,
    tutorials:           tutorials,
    opportunities:       opportunities,
    learn_today:         learn,
    action_center:       actions,
    trends:              trends,
    events:              events,
    statistics:          stats,
    sections:            { key_themes: exec.key_themes },
    estimated_read_min,
    sources_count:       stats.sources_count,
    articles_count:      articles.length,
    total_items:         articles.length,
    generated_at:        new Date().toISOString(),
    generation_duration_ms: Date.now() - start,
  }, { onConflict: 'report_date' }).select().single();

  logger.success(`Report generated for ${reportDate} in ${Date.now() - start}ms`);

  return {
    id:                 stored?.id ?? '',
    report_date:        reportDate,
    version:            1,
    status:             'ready',
    headline,
    summary,
    key_themes:         (exec.key_themes as string[]) ?? [],
    estimated_read_min,
    top_stories:        topStories,
    ai_company_updates: companies,
    github_highlights:  github,
    tools:              [],
    research_papers:    research,
    tutorials,
    opportunities,
    learn_today:        learn,
    action_center:      actions,
    trends,
    events,
    statistics:         stats,
    prompt_version:     REPORT_PROMPT_VERSION,
    generated_at:       new Date().toISOString(),
  };
}

function MOCK_REPORT(date: string): DailyReport {
  return {
    id: 'mock', report_date: date, version: 1, status: 'ready',
    headline: 'AI Intelligence Report — Connect Supabase to see live data',
    summary: 'No processed articles found for today. Configure Supabase and run the collectors to generate real reports.',
    key_themes: [], estimated_read_min: 0,
    top_stories: [], ai_company_updates: [], github_highlights: [], tools: [],
    research_papers: [], tutorials: [], opportunities: [], learn_today: {},
    action_center: [], trends: {}, events: [], statistics: {
      articles_processed: 0, sources_count: 0, repositories: 0, research_papers: 0,
      tools: 0, opportunities: 0, avg_importance: 0, avg_confidence: 0,
      processing_time_ms: 0, top_categories: [], top_companies: [], top_technologies: [],
    },
    prompt_version: REPORT_PROMPT_VERSION, generated_at: new Date().toISOString(),
  };
}
