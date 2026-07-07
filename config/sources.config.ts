export type SourceType = 'rss' | 'api' | 'scraper' | 'youtube'

export interface SourceConfig {
  slug: string
  name: string
  type: SourceType
  url: string
  checkIntervalMinutes: number
  categoryHints: string[]   // suggested category slugs for items from this source
  metadata?: Record<string, unknown>
}

export const SOURCES: SourceConfig[] = [
  {
    slug: 'hacker-news',
    name: 'Hacker News',
    type: 'rss',
    url: 'https://news.ycombinator.com/rss',
    checkIntervalMinutes: 30,
    categoryHints: ['hacker-news'],
  },
  {
    slug: 'reddit-artificial',
    name: 'Reddit r/artificial',
    type: 'rss',
    url: 'https://www.reddit.com/r/artificial/.rss',
    checkIntervalMinutes: 60,
    categoryHints: ['reddit-ai'],
    metadata: { subreddit: 'artificial' },
  },
  {
    slug: 'reddit-machinelearning',
    name: 'Reddit r/MachineLearning',
    type: 'rss',
    url: 'https://www.reddit.com/r/MachineLearning/.rss',
    checkIntervalMinutes: 60,
    categoryHints: ['reddit-ai', 'research-papers'],
    metadata: { subreddit: 'MachineLearning' },
  },
  {
    slug: 'openai-blog',
    name: 'OpenAI Blog',
    type: 'rss',
    url: 'https://openai.com/blog/rss',
    checkIntervalMinutes: 120,
    categoryHints: ['model-releases', 'developer-updates'],
  },
  {
    slug: 'anthropic-blog',
    name: 'Anthropic Blog',
    type: 'rss',
    url: 'https://www.anthropic.com/news/rss',
    checkIntervalMinutes: 120,
    categoryHints: ['model-releases', 'developer-updates'],
  },
  {
    slug: 'google-ai-blog',
    name: 'Google AI Blog',
    type: 'rss',
    url: 'https://blog.research.google/feeds/posts/default',
    checkIntervalMinutes: 120,
    categoryHints: ['model-releases', 'research-papers'],
  },
  {
    slug: 'github-trending',
    name: 'GitHub Trending',
    type: 'scraper',
    url: 'https://github.com/trending',
    checkIntervalMinutes: 120,
    categoryHints: ['github-trending'],
  },
  {
    slug: 'github-releases',
    name: 'GitHub Releases',
    type: 'api',
    url: 'https://api.github.com',
    checkIntervalMinutes: 60,
    categoryHints: ['developer-updates'],
    metadata: { repos: ['openai/openai-python', 'anthropics/anthropic-sdk-python'] },
  },
  {
    slug: 'product-hunt',
    name: 'Product Hunt',
    type: 'api',
    url: 'https://api.producthunt.com/v2/api/graphql',
    checkIntervalMinutes: 120,
    categoryHints: ['product-hunt', 'ai-tools'],
    metadata: { topic: 'artificial-intelligence' },
  },
  {
    slug: 'youtube-ai',
    name: 'YouTube AI',
    type: 'youtube',
    url: 'https://www.googleapis.com/youtube/v3',
    checkIntervalMinutes: 180,
    categoryHints: ['youtube'],
    metadata: { channelIds: [] },
  },
  {
    slug: 'papers-with-code',
    name: 'Papers With Code',
    type: 'rss',
    url: 'https://paperswithcode.com/latest',
    checkIntervalMinutes: 240,
    categoryHints: ['research-papers'],
  },
  {
    slug: 'ai-tools-directory',
    name: 'AI Tools Directory',
    type: 'rss',
    url: 'https://theresanaiforthat.com/feed/',
    checkIntervalMinutes: 360,
    categoryHints: ['ai-tools'],
  },
  {
    slug: 'mcp-servers',
    name: 'MCP Servers',
    type: 'api',
    url: 'https://api.github.com/search/repositories',
    checkIntervalMinutes: 240,
    categoryHints: ['mcp-servers'],
    metadata: { query: 'mcp-server topic:mcp' },
  },
  {
    slug: 'claude-code-updates',
    name: 'Claude Code Updates',
    type: 'api',
    url: 'https://api.github.com/repos/anthropics/claude-code/releases',
    checkIntervalMinutes: 120,
    categoryHints: ['developer-updates'],
  },
  {
    slug: 'free-ai-offers',
    name: 'Free AI Offers',
    type: 'rss',
    url: 'https://reddit.com/r/AIAssistants/.rss',
    checkIntervalMinutes: 120,
    categoryHints: ['free-offers'],
  },
]
