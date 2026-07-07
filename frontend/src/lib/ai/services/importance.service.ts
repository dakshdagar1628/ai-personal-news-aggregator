import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';

export interface ScoreResult {
  importance_score: number; developer_score: number; learning_score: number;
  business_score: number; urgency_score: number; innovation_score: number;
  confidence_score: number; score_explanations: Record<string, string>;
}

export async function scoreArticle(params: {
  title: string; primary_category: string; summary: string; source_slug: string;
}): Promise<ScoreResult> {
  const { text, maxTokens, temperature } = renderPrompt('importance', params);
  const ai = getAIProvider();
  const { data } = await ai.completeJSON<ScoreResult>(text, { maxTokens, temperature });
  const clamp = (v: unknown) => Math.min(100, Math.max(0, Number(v) || 50));
  return {
    importance_score: clamp(data.importance_score),
    developer_score:  clamp(data.developer_score),
    learning_score:   clamp(data.learning_score),
    business_score:   clamp(data.business_score),
    urgency_score:    clamp(data.urgency_score),
    innovation_score: clamp(data.innovation_score),
    confidence_score: clamp(data.confidence_score),
    score_explanations: data.score_explanations ?? {},
  };
}
