import type { AIProvider } from './ai-provider.interface';
import { ClaudeProvider } from './claude.provider';
import { OpenAIProvider } from './openai.provider';
import { OpenRouterProvider } from './openrouter.provider';

export type ProviderName = 'claude' | 'openai' | 'openrouter';

let _instance: AIProvider | null = null;

export function getAIProvider(name?: ProviderName): AIProvider {
  if (_instance) return _instance;
  const provider = name ?? (process.env.AI_PROVIDER as ProviderName) ?? 'openrouter';
  if (provider === 'claude') {
    _instance = new ClaudeProvider();
  } else if (provider === 'openai') {
    _instance = new OpenAIProvider();
  } else if (provider === 'openrouter') {
    _instance = new OpenRouterProvider();
  } else {
    throw new Error(`Unknown AI provider: ${provider}`);
  }
  return _instance;
}

export function resetProvider(): void { _instance = null; }
