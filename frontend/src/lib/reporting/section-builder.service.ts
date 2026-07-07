import { sortByRank } from './ranking.service';
import type { ReportStory, CompanyUpdate, GitHubItem, ResearchPaper, Opportunity } from './types';

const AI_COMPANIES = ['openai','anthropic','google','meta','microsoft','mistral','xai','groq','perplexity','together','cohere','stability','elevenlabs','runway','replicate'];

export function buildTopStories(articles: ProcessedArticle[]): ReportStory[] {
  return sortByRank(articles).slice(0, 10).map(toStory);
}

export function buildCompanyUpdates(articles: ProcessedArticle[]): CompanyUpdate[] {
  const byCompany = new Map<string, ProcessedArticle[]>();
  for (const a of articles) {
    for (const company of (a.companies ?? [])) {
      const slug = company.toLowerCase().replace(/\s+/g,'-');
      if (AI_COMPANIES.some(c => slug.includes(c))) {
        const arr = byCompany.get(company) ?? [];
        arr.push(a);
        byCompany.set(company, arr);
      }
    }
  }
  return Array.from(byCompany.entries())
    .map(([company, items]) => ({
      company,
      updates: sortByRank(items).slice(0, 5).map(toStory),
      summary: items[0]?.summary_short ?? '',
    }))
    .sort((a, b) => (b.updates[0]?.importance_score ?? 0) - (a.updates[0]?.importance_score ?? 0));
}

export function buildGitHubHighlights(articles: ProcessedArticle[]): GitHubItem[] {
  return articles
    .filter(a => (a.categories ?? []).some(c => ['github-repo','open-source','mcp-tool'].includes(c)))
    .sort((a, b) => (b.importance_score ?? 0) - (a.importance_score ?? 0))
    .slice(0, 15)
    .map(a => ({
      news_id:     a.news_id,
      title:       a.title ?? '',
      url:         a.url ?? '',
      summary:     a.summary_short ?? '',
      reason:      a.score_explanations?.developer ?? '',
      recommendation: a.recommended_action ?? 'should_star',
      subcategory: (a.categories ?? [])[0] ?? 'github-repo',
    }));
}

export function buildResearchPapers(articles: ProcessedArticle[]): ResearchPaper[] {
  return articles
    .filter(a => (a.categories ?? []).some(c => ['research-paper','arxiv'].includes(c)))
    .sort((a, b) => (b.importance_score ?? 0) - (a.importance_score ?? 0))
    .slice(0, 10)
    .map(a => ({
      news_id:     a.news_id,
      title:       a.title ?? '',
      url:         a.url ?? '',
      main_idea:   a.summary_short ?? '',
      why_matters: a.score_explanations?.importance ?? '',
      difficulty:  (a.learning_score ?? 50) > 70 ? 'advanced' : (a.learning_score ?? 50) > 40 ? 'intermediate' : 'beginner',
      should_read: (a.importance_score ?? 0) >= 65,
      topics:      a.tags_primary ?? [],
    }));
}

export function buildOpportunities(articles: ProcessedArticle[]): Opportunity[] {
  return articles
    .filter(a => (a.categories ?? []).some(c => ['free-credit','job-offer','product-launch'].includes(c)))
    .slice(0, 10)
    .map(a => ({
      news_id:    a.news_id,
      title:      a.title ?? '',
      url:        a.url ?? '',
      type:       (a.primary_category ?? 'offer'),
      description:a.summary_short ?? '',
      value:      a.score_explanations?.urgency ?? '',
    }));
}

export function buildActionCenter(articles: ProcessedArticle[]): ReportStory[] {
  return articles
    .filter(a => a.recommended_action && a.recommended_action !== 'should_ignore')
    .sort((a, b) => (b.urgency_score ?? 0) - (a.urgency_score ?? 0))
    .slice(0, 10)
    .map(toStory);
}

export function buildStatistics(articles: ProcessedArticle[], startMs: number) {
  const cats = articles.reduce<Record<string,number>>((acc, a) => {
    for (const c of a.categories ?? []) acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});
  return {
    articles_processed: articles.length,
    sources_count:      new Set(articles.map(a => a.source_slug).filter(Boolean)).size,
    repositories:       articles.filter(a => (a.categories??[]).includes('github-repo')).length,
    research_papers:    articles.filter(a => (a.categories??[]).includes('research-paper')).length,
    tools:              articles.filter(a => (a.categories??[]).includes('tool-launch')).length,
    opportunities:      articles.filter(a => (a.categories??[]).includes('free-credit')).length,
    avg_importance:     Math.round(articles.reduce((s, a) => s + (a.importance_score ?? 0), 0) / (articles.length || 1)),
    avg_confidence:     Math.round(articles.reduce((s, a) => s + (a.confidence_score ?? 0), 0) / (articles.length || 1)),
    processing_time_ms: Date.now() - startMs,
    top_categories:     Object.entries(cats).sort(([,a],[,b]) => b-a).slice(0,8).map(([category,count]) => ({ category, count })),
    top_companies:      [...new Set(articles.flatMap(a => a.companies ?? []))].slice(0, 10),
    top_technologies:   [...new Set(articles.flatMap(a => a.technologies ?? []))].slice(0, 10),
  };
}

// ── helpers ──────────────────────────────────────────────────────
interface ProcessedArticle {
  news_id: string; title?: string; url?: string; source_slug?: string;
  summary_short?: string; importance_score?: number; developer_score?: number;
  learning_score?: number; business_score?: number; urgency_score?: number;
  innovation_score?: number; confidence_score?: number; categories?: string[];
  primary_category?: string; recommended_action?: string; action_explanation?: string;
  score_explanations?: Record<string,string>; tags_primary?: string[];
  companies?: string[]; technologies?: string[]; related_items?: string[];
  estimated_read_time?: number;
}

function toStory(a: ProcessedArticle): ReportStory {
  return {
    news_id:           a.news_id,
    title:             a.title ?? '',
    url:               a.url ?? '',
    summary:           a.summary_short ?? '',
    importance_score:  a.importance_score ?? 50,
    developer_score:   a.developer_score  ?? 50,
    source:            a.source_slug ?? '',
    category:          a.primary_category ?? 'ai-news',
    why_it_matters:    a.score_explanations?.importance ?? '',
    recommended_action:a.recommended_action ?? 'should_read',
    estimated_read_min:a.estimated_read_time ?? 3,
    related_ids:       a.related_items ?? [],
  };
}
