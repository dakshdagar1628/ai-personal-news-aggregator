import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';

export interface RecommendationResult {
  recommended_action: string;
  action_explanation: string;
  action_details: Record<string, unknown>;
}

export async function generateRecommendation(params: {
  title: string; summary: string; categories: string[];
  importance_score: number; developer_score: number; learning_score: number;
}): Promise<RecommendationResult> {
  const { text, maxTokens, temperature } = renderPrompt('recommendation', {
    title: params.title, summary: params.summary,
    categories: params.categories.join(', '),
    importance_score: params.importance_score,
    developer_score: params.developer_score,
    learning_score: params.learning_score,
  });
  const ai = getAIProvider();
  const { data } = await ai.completeJSON<RecommendationResult>(text, { maxTokens, temperature });
  return {
    recommended_action: data.recommended_action ?? 'should_read',
    action_explanation: data.action_explanation ?? '',
    action_details:     data.action_details ?? {},
  };
}
