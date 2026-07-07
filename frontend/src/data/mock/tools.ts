export interface MockTool {
  id: string; name: string; description: string; category: string
  url: string; pricing: 'free' | 'freemium' | 'paid'; tags: string[]
}

export const MOCK_TOOLS: MockTool[] = [
  { id: '1', name: 'Cursor', description: 'AI-powered code editor with GPT-4 integration', category: 'Coding', url: '#', pricing: 'freemium', tags: ['coding', 'editor', 'gpt-4'] },
  { id: '2', name: 'Perplexity AI', description: 'AI-powered search and research assistant', category: 'Search', url: '#', pricing: 'freemium', tags: ['search', 'research'] },
  { id: '3', name: 'v0.dev', description: 'Generate UI components from text descriptions', category: 'UI Generation', url: '#', pricing: 'freemium', tags: ['ui', 'react', 'tailwind'] },
  { id: '4', name: 'Replit Agent', description: 'Build full apps from natural language descriptions', category: 'Coding', url: '#', pricing: 'paid', tags: ['coding', 'agents', 'fullstack'] },
  { id: '5', name: 'ElevenLabs', description: 'AI voice synthesis and cloning platform', category: 'Audio', url: '#', pricing: 'freemium', tags: ['voice', 'tts', 'audio'] },
]
