export interface MockNewsItem {
  id: string; title: string; url: string; source: string; category: string
  summary: string; publishedAt: string; importanceScore: number; tags: string[]
}

export const MOCK_NEWS: MockNewsItem[] = [
  { id: '1', title: 'Anthropic releases Claude 4 with 200K context and extended thinking', url: '#', source: 'Anthropic', category: 'model-releases', summary: 'Anthropic\'s latest model doubles context window and adds step-by-step reasoning mode for complex tasks.', publishedAt: '2026-07-06T08:00:00Z', importanceScore: 0.97, tags: ['claude', 'anthropic', 'llm'] },
  { id: '2', title: 'OpenAI GPT-5 technical report published', url: '#', source: 'OpenAI Blog', category: 'model-releases', summary: 'OpenAI publishes full technical report for GPT-5, detailing training methodology and safety evaluations.', publishedAt: '2026-07-06T06:30:00Z', importanceScore: 0.95, tags: ['gpt-5', 'openai', 'research'] },
  { id: '3', title: 'Google DeepMind Gemini Ultra 2 achieves state-of-the-art on MMLU', url: '#', source: 'Google AI Blog', category: 'research-papers', summary: 'New benchmark results show 92.3% on MMLU, surpassing all previous models on reasoning tasks.', publishedAt: '2026-07-06T05:00:00Z', importanceScore: 0.89, tags: ['gemini', 'google', 'benchmark'] },
  { id: '4', title: 'Ask HN: What MCP servers are you actually using in production?', url: '#', source: 'Hacker News', category: 'hacker-news', summary: 'Community thread discussing real-world MCP server deployments and use cases.', publishedAt: '2026-07-05T22:00:00Z', importanceScore: 0.72, tags: ['mcp', 'production', 'discussion'] },
  { id: '5', title: 'Cursor AI raises $500M Series C at $9B valuation', url: '#', source: 'Industry News', category: 'industry-news', summary: 'AI coding tool Cursor secures major funding round as developer AI tooling market heats up.', publishedAt: '2026-07-05T18:00:00Z', importanceScore: 0.81, tags: ['cursor', 'funding', 'coding'] },
  { id: '6', title: 'New paper: Chain-of-thought prompting without examples achieves GPT-4 level', url: '#', source: 'Papers With Code', category: 'research-papers', summary: 'Researchers show zero-shot CoT prompting can match few-shot performance across math and reasoning benchmarks.', publishedAt: '2026-07-05T14:00:00Z', importanceScore: 0.78, tags: ['cot', 'prompting', 'research'] },
]
