import { OpenAIProvider } from './openai.provider';
import type { AIRequestOptions, AIResponse } from './ai-provider.interface';

export class OpenRouterProvider extends OpenAIProvider {
  override readonly name = 'openrouter';

  constructor(apiKey?: string, model?: string) {
    const key = apiKey ?? process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY ?? '';
    const mdl = model ?? process.env.OPENROUTER_MODEL ?? 'google/gemini-2.5-flash';
    super(key, mdl, 'https://openrouter.ai/api/v1');
  }

  override async complete(prompt: string, opts: AIRequestOptions = {}): Promise<AIResponse> {
    const start = Date.now();
    const messages = [];
    if (opts.systemPrompt) {
      messages.push({ role: 'system', content: opts.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': process.env.APP_NAME || 'AI Intelligence OS',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText} - ${errText}`);
    }

    const res = await response.json();
    const content = res.choices?.[0]?.message?.content ?? '';
    const inputTokens = res.usage?.prompt_tokens ?? 0;
    const outputTokens = res.usage?.completion_tokens ?? 0;

    return {
      content,
      tokensUsed: inputTokens + outputTokens,
      model: this.model,
      provider: this.name,
      latencyMs: Date.now() - start,
    };
  }
}
