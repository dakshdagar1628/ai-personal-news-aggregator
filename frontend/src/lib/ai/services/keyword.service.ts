import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';

export interface KeywordResult {
  tags_primary: string[]; tags_secondary: string[]; keywords: string[];
  technologies: string[]; frameworks: string[]; programming_languages: string[];
  models: string[]; companies: string[]; apis: string[];
}

export async function extractKeywords(params: { title: string; summary: string; content: string }): Promise<KeywordResult> {
  const { text, maxTokens, temperature } = renderPrompt('keywords', {
    title: params.title, summary: params.summary, content: params.content.slice(0, 3000),
  });
  const ai = getAIProvider();
  const { data } = await ai.completeJSON<KeywordResult>(text, { maxTokens, temperature });
  const arr = (v: unknown) => Array.isArray(v) ? v : [];
  return {
    tags_primary:          arr(data.tags_primary),
    tags_secondary:        arr(data.tags_secondary),
    keywords:              arr(data.keywords),
    technologies:          arr(data.technologies),
    frameworks:            arr(data.frameworks),
    programming_languages: arr(data.programming_languages),
    models:                arr(data.models),
    companies:             arr(data.companies),
    apis:                  arr(data.apis),
  };
}
