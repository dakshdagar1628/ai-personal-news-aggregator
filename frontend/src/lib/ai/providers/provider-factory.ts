import type { AIProvider } from './ai-provider.interface';
import { ClaudeProvider } from './claude.provider';

export type ProviderName = 'claude';

let _instance: AIProvider | null = null;

export function getAIProvider(name?: ProviderName): AIProvider {
  if (_instance) return _instance;
  const provider = name ?? (process.env.AI_PROVIDER as ProviderName) ?? 'claude';
  if (provider === 'claude') {
    _instance = new ClaudeProvider();
  } else {
    throw new Error(`Unknown AI provider: ${provider}`);
  }
  return _instance;
}

export function resetProvider(): void { _instance = null; }
