import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';

export interface CategoryResult { primary_category: string; categories: string[]; }

export async function detectCategories(params: { title: string; summary: string; url: string }): Promise<CategoryResult> {
  const { text, maxTokens, temperature } = renderPrompt('categorize', params);
  const ai = getAIProvider();
  const { data } = await ai.completeJSON<CategoryResult>(text, { maxTokens, temperature });
  return {
    primary_category: data.primary_category ?? 'ai-news',
    categories:       Array.isArray(data.categories) ? data.categories : [data.primary_category ?? 'ai-news'],
  };
}
