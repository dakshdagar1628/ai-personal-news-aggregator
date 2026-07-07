export interface CategoryConfig {
  slug: string
  name: string
  description: string
  color: string
  icon: string
  sortOrder: number
}

export const CATEGORIES: CategoryConfig[] = [
  { slug: 'model-releases',   name: 'Model Releases',    description: 'New AI model announcements',           color: '#8B5CF6', icon: 'cpu',            sortOrder: 1 },
  { slug: 'research-papers',  name: 'Research Papers',   description: 'Academic papers and technical reports', color: '#3B82F6', icon: 'file-text',      sortOrder: 2 },
  { slug: 'ai-tools',         name: 'AI Tools',          description: 'New tools, libraries, frameworks',      color: '#10B981', icon: 'tool',           sortOrder: 3 },
  { slug: 'developer-updates',name: 'Developer Updates', description: 'SDK, API, and platform updates',        color: '#F59E0B', icon: 'code',           sortOrder: 4 },
  { slug: 'github-trending',  name: 'GitHub Trending',   description: 'Trending repos on GitHub',             color: '#6366F1', icon: 'trending-up',    sortOrder: 5 },
  { slug: 'hacker-news',      name: 'Hacker News',       description: 'Top AI discussions on HN',             color: '#EF4444', icon: 'flame',          sortOrder: 6 },
  { slug: 'reddit-ai',        name: 'Reddit AI',         description: 'Top posts from AI subreddits',         color: '#FF6314', icon: 'message-circle', sortOrder: 7 },
  { slug: 'product-hunt',     name: 'Product Hunt',      description: 'New AI products on Product Hunt',      color: '#DA552F', icon: 'rocket',         sortOrder: 8 },
  { slug: 'youtube',          name: 'YouTube',           description: 'AI video content',                     color: '#FF0000', icon: 'play',           sortOrder: 9 },
  { slug: 'free-offers',      name: 'Free Offers',       description: 'Free tiers, credits, limited offers',  color: '#22C55E', icon: 'gift',           sortOrder: 10 },
  { slug: 'mcp-servers',      name: 'MCP Servers',       description: 'MCP server releases',                  color: '#A855F7', icon: 'server',         sortOrder: 11 },
  { slug: 'industry-news',    name: 'Industry News',     description: 'General AI industry news',             color: '#64748B', icon: 'newspaper',      sortOrder: 12 },
]
