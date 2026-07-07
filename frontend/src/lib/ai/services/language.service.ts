import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';

export interface LanguageResult { language: string; confidence: number; }

export async function detectLanguage(text: string): Promise<LanguageResult> {
  // Fast heuristic — skip API for short English-looking text
  if (/^[a-zA-Z0-9\s.,!?'"()\-:;]+$/.test(text.slice(0, 200))) {
    return { language: 'en', confidence: 0.95 };
  }
  const { text: prompt, maxTokens, temperature } = renderPrompt('language', { text: text.slice(0, 300) });
  const ai = getAIProvider();
  const { data } = await ai.completeJSON<LanguageResult>(prompt, { maxTokens, temperature });
  return { language: data.language ?? 'en', confidence: data.confidence ?? 0.5 };
}
