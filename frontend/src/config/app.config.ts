export const APP_CONFIG = {
  name:    'AI Intelligence OS',
  version: '0.1.0',
  url:     process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
} as const

export const PAGINATION = { defaultPageSize: 20, maxPageSize: 100 } as const

export const AI_MODELS = {
  primary:   process.env.CLAUDE_MODEL      ?? 'claude-3-5-sonnet-latest',
  secondary: process.env.OPENAI_MODEL      ?? 'gpt-4o',
  openrouter:process.env.OPENROUTER_MODEL  ?? 'google/gemini-2.5-flash',
} as const

export const FEATURE_FLAGS = {
  ENABLE_AUTH:          false,
  ENABLE_NOTIFICATIONS: false,
  ENABLE_CHAT:          false,
} as const
