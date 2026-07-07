export interface MockRepo {
  id: string; name: string; owner: string; description: string
  stars: number; starsToday: number; language: string; url: string; topics: string[]
}

export const MOCK_REPOS: MockRepo[] = [
  { id: '1', name: 'open-webui', owner: 'open-webui', description: 'User-friendly WebUI for LLMs (formerly Ollama WebUI)', stars: 48200, starsToday: 312, language: 'Python', url: '#', topics: ['llm', 'ollama', 'webui'] },
  { id: '2', name: 'llm', owner: 'simonw', description: 'Access large language models from the command-line', stars: 6800, starsToday: 187, language: 'Python', url: '#', topics: ['llm', 'cli', 'openai'] },
  { id: '3', name: 'anything-llm', owner: 'Mintplex-Labs', description: 'All-in-one Desktop & Docker AI app with full RAG', stars: 32100, starsToday: 156, language: 'JavaScript', url: '#', topics: ['rag', 'llm', 'ai'] },
  { id: '4', name: 'mem0', owner: 'mem0ai', description: 'The memory layer for AI agents', stars: 24600, starsToday: 144, language: 'Python', url: '#', topics: ['memory', 'agents', 'ai'] },
  { id: '5', name: 'claude-code', owner: 'anthropics', description: 'Claude Code CLI — AI coding assistant', stars: 18900, starsToday: 128, language: 'TypeScript', url: '#', topics: ['claude', 'coding', 'cli'] },
]
