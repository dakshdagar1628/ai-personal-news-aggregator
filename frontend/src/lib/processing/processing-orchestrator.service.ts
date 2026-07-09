import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';
import { logger } from '@/lib/logging/logger';
import { cleanContent } from '@/lib/ai/services/content-cleaner.service';
import { detectLanguage } from '@/lib/ai/services/language.service';
import { generateSummary } from '@/lib/ai/services/summary.service';
import { detectCategories } from '@/lib/ai/services/category.service';
import { extractKeywords } from '@/lib/ai/services/keyword.service';
import { scoreArticle } from '@/lib/ai/services/importance.service';
import { generateRecommendation } from '@/lib/ai/services/recommendation.service';
import { findOrCreateSemanticGroup } from '@/lib/ai/services/semantic-dedup.service';
import { findRelatedArticles } from '@/lib/ai/services/related-content.service';
import { getAIProvider } from '@/lib/ai/providers/provider-factory';

export const PROCESSING_VERSION = '1.0.0';
export const PROMPT_VERSION     = '1.0.0';

export interface ProcessingResult {
  success:       boolean;
  newsId:        string;
  error?:        string;
  tokensUsed:    number;
  processingMs:  number;
}

export async function processArticle(newsId: string): Promise<ProcessingResult> {
  const start = Date.now();
  let totalTokens = 0;

  if (!isSupabaseConfigured()) {
    return { success: false, newsId, error: 'Supabase not configured', tokensUsed: 0, processingMs: 0 };
  }
  const db = getServerClient();

  // Mark queue as processing
  await db.rpc('start_processing_job', { p_news_id: newsId });

  try {
    // 1. Fetch raw article
    const { data: article, error: fetchErr } = await db.from('news')
      .select('id,title,url,content_raw,author,published_at,source_id,tags,metadata')
      .eq('id', newsId).single();
    if (fetchErr || !article) throw new Error(fetchErr?.message ?? 'Article not found');

    // 2. Clean content
    const content = cleanContent(article.content_raw);

    // 3. Language detection
    const { language, confidence: langConf } = await detectLanguage(article.title + ' ' + content.slice(0, 200));

    // 4. Summarize
    const summary = await generateSummary({
      title: article.title, url: article.url,
      author: article.author ?? undefined,
      published_at: article.published_at ?? undefined,
      content,
    });
    totalTokens += summary.tokensUsed;

    // 5. Categorize
    const { primary_category, categories } = await detectCategories({
      title: article.title, summary: summary.summary_short, url: article.url,
    });

    // 6. Keywords
    const keywords = await extractKeywords({
      title: article.title, summary: summary.summary_short, content,
    });

    // 7. Score
    const scores = await scoreArticle({
      title: article.title, primary_category, summary: summary.summary_short,
      source_slug: (article.metadata as Record<string,string>)?.source_slug ?? '',
    });

    // 8. Recommend
    const recommendation = await generateRecommendation({
      title: article.title, summary: summary.summary_short, categories,
      importance_score: scores.importance_score,
      developer_score:  scores.developer_score,
      learning_score:   scores.learning_score,
    });

    // 9. Semantic dedup
    const semanticGroupId = await findOrCreateSemanticGroup(newsId, article.title, summary.summary_short);

    // 10. Related content
    const relatedIds = await findRelatedArticles({
      newsId, title: article.title, summary: summary.summary_short,
      tags: keywords.tags_primary, categories,
    });

    const provider = getAIProvider();
    const processingMs = Date.now() - start;

    // 11. Store processed result
    const processed = {
      news_id:              newsId,
      summary_short:        summary.summary_short,
      summary_medium:       summary.summary_medium,
      summary_long:         summary.summary_long,
      executive_summary:    summary.executive_summary,
      bullet_summary:       summary.bullet_summary,
      categories,
      primary_category,
      tags_primary:         keywords.tags_primary,
      tags_secondary:       keywords.tags_secondary,
      keywords:             keywords.keywords,
      technologies:         keywords.technologies,
      frameworks:           keywords.frameworks,
      programming_languages:keywords.programming_languages,
      models:               keywords.models,
      companies:            keywords.companies,
      apis:                 keywords.apis,
      importance_score:     scores.importance_score,
      developer_score:      scores.developer_score,
      learning_score:       scores.learning_score,
      business_score:       scores.business_score,
      urgency_score:        scores.urgency_score,
      innovation_score:     scores.innovation_score,
      confidence_score:     scores.confidence_score,
      score_explanations:   scores.score_explanations,
      recommended_action:   recommendation.recommended_action,
      action_explanation:   recommendation.action_explanation,
      action_details:       recommendation.action_details,
      related_items:        relatedIds,
      semantic_group_id:    semanticGroupId,
      language,
      language_confidence:  langConf,
      processed_at:         new Date().toISOString(),
      processing_version:   PROCESSING_VERSION,
      prompt_version:       PROMPT_VERSION,
      ai_provider:          provider.name,
      ai_model:             provider.model,
      tokens_used:          totalTokens,
      processing_time_ms:   processingMs,
    };

    await db.from('processed_articles').upsert(processed, { onConflict: 'news_id' });

    // Update news.is_processed
    await db.from('news').update({ is_processed: true, importance_score: scores.importance_score / 100 }).eq('id', newsId);

    // Mark queue complete
    await db.from('processing_queue')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('news_id', newsId);

    logger.success(`Processed article ${newsId} in ${processingMs}ms`);
    return { success: true, newsId, tokensUsed: totalTokens, processingMs };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`Processing failed for ${newsId}: ${msg}`);
    
    // Check attempts to schedule retry or fail
    const { data: job } = await db.from('processing_queue')
      .select('attempts, max_attempts')
      .eq('news_id', newsId)
      .single();
      
    const attempts = job?.attempts ?? 1;
    const maxAttempts = job?.max_attempts ?? 3;
    
    if (attempts < maxAttempts) {
      const delayMinutes = Math.pow(2, attempts);
      const nextRetry = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();
      await db.from('processing_queue').update({
        status: 'retrying',
        next_retry_at: nextRetry,
        error_message: msg.slice(0, 1000),
      }).eq('news_id', newsId);
    } else {
      await db.from('processing_queue').update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        error_message: msg.slice(0, 1000),
      }).eq('news_id', newsId);
    }
    
    return { success: false, newsId, error: msg, tokensUsed: totalTokens, processingMs: Date.now() - start };
  }
}
