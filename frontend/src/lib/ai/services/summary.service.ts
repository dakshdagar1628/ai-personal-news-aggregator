import { getAIProvider } from '../providers/provider-factory';
import { renderPrompt } from '../prompts/prompt-loader';

export interface SummaryResult {
  summary_short:     string;
  summary_medium:    string;
  summary_long:      string;
  executive_summary: string;
  bullet_summary:    string[];
  promptVersion:     string;
  tokensUsed:        number;
  latencyMs:         number;
}

export async function generateSummary(params: {
  title: string; url: string; author?: string; published_at?: string; content: string;
}): Promise<SummaryResult> {
  const { text, maxTokens, temperature, version } = renderPrompt('summarize', {
    title: params.title, url: params.url,
    author: params.author ?? 'Unknown',
    published_at: params.published_at ?? '',
    content: params.content.slice(0, 6000),
  });
  const ai = getAIProvider();
  const { data, meta } = await ai.completeJSON<Omit<SummaryResult,'promptVersion'|'tokensUsed'|'latencyMs'>>(text, { maxTokens, temperature });
  return {
    summary_short:     data.summary_short     ?? '',
    summary_medium:    data.summary_medium    ?? '',
    summary_long:      data.summary_long      ?? '',
    executive_summary: data.executive_summary ?? '',
    bullet_summary:    Array.isArray(data.bullet_summary) ? data.bullet_summary : [],
    promptVersion:     version,
    tokensUsed:        meta.tokensUsed,
    latencyMs:         meta.latencyMs,
  };
}
