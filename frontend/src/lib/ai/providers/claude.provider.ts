import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIResponse, AIRequestOptions } from './ai-provider.interface';

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude';
  readonly model: string;
  private client: Anthropic;

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
    this.model = model ?? process.env.CLAUDE_MODEL ?? 'claude-3-5-sonnet-latest';
  }

  async complete(prompt: string, opts: AIRequestOptions = {}): Promise<AIResponse> {
    const start = Date.now();
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];
    const res = await this.client.messages.create({
      model: this.model,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.3,
      system: opts.systemPrompt,
      messages,
    });
    const content = res.content[0]?.type === 'text' ? res.content[0].text : '';
    return {
      content,
      tokensUsed: res.usage.input_tokens + res.usage.output_tokens,
      model: this.model,
      provider: this.name,
      latencyMs: Date.now() - start,
    };
  }

  async completeJSON<T>(prompt: string, opts: AIRequestOptions = {}): Promise<{ data: T; meta: Omit<AIResponse,'content'> }> {
    const res = await this.complete(prompt, { ...opts, maxTokens: opts.maxTokens ?? 2048 });
    const match = res.content.match(/```json\s*([\s\S]*?)\s*```/) ?? res.content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const jsonStr = match ? match[1] ?? match[0] : res.content.trim();
    const data = JSON.parse(jsonStr) as T;
    const { content: _c, ...meta } = res;
    return { data, meta };
  }
}
