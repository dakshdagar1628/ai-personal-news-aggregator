export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequestOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  jsonMode?: boolean;
}

export interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
  provider: string;
  latencyMs: number;
  cached?: boolean;
}

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  complete(prompt: string, opts?: AIRequestOptions): Promise<AIResponse>;
  completeJSON<T = unknown>(prompt: string, opts?: AIRequestOptions): Promise<{ data: T; meta: Omit<AIResponse,'content'> }>;
}
