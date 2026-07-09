import type { AIProvider, AIResponse, AIRequestOptions } from './ai-provider.interface';

export class OpenAIProvider implements AIProvider {
  readonly name: string = 'openai';
  readonly model: string;
  protected apiKey: string;
  protected baseUrl: string;

  constructor(apiKey?: string, model?: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey ?? process.env.OPENAI_API_KEY ?? '';
    this.model = model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
    this.baseUrl = baseUrl;
  }

  async complete(prompt: string, opts: AIRequestOptions = {}): Promise<AIResponse> {
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
      throw new Error(`OpenAI-compatible API request failed: ${response.status} ${response.statusText} - ${errText}`);
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

  async completeJSON<T>(prompt: string, opts: AIRequestOptions = {}): Promise<{ data: T; meta: Omit<AIResponse, 'content'> }> {
    const res = await this.complete(prompt, { ...opts, maxTokens: opts.maxTokens ?? 2048 });
    const match = res.content.match(/```json\s*([\s\S]*?)\s*```/) ?? res.content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const jsonStr = match ? match[1] ?? match[0] : res.content.trim();
    const data = JSON.parse(jsonStr) as T;
    const { content: _c, ...meta } = res;
    return { data, meta };
  }
}
