-- Seed: Categories
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
  ('Model Releases',   'model-releases',  'New AI model announcements and releases',        '#8B5CF6', 'cpu',            1),
  ('Research Papers',  'research-papers', 'Academic papers and technical reports',           '#3B82F6', 'file-text',      2),
  ('AI Tools',         'ai-tools',        'New tools, libraries, and frameworks',            '#10B981', 'tool',           3),
  ('Developer Updates','developer-updates','SDK, API, and platform developer news',          '#F59E0B', 'code',           4),
  ('GitHub Trending',  'github-trending', 'Trending repositories on GitHub',                '#6366F1', 'trending-up',    5),
  ('Hacker News',      'hacker-news',     'Top AI discussions on Hacker News',              '#EF4444', 'flame',          6),
  ('Reddit AI',        'reddit-ai',       'Top posts from AI subreddits',                   '#FF6314', 'message-circle', 7),
  ('Product Hunt',     'product-hunt',    'New AI products launched on Product Hunt',       '#DA552F', 'rocket',         8),
  ('YouTube',          'youtube',         'AI video content and channel updates',           '#FF0000', 'play',           9),
  ('Free Offers',      'free-offers',     'Free tiers, credits, and limited-time offers',  '#22C55E', 'gift',           10),
  ('MCP Servers',      'mcp-servers',     'Model Context Protocol server releases',        '#A855F7', 'server',         11),
  ('Industry News',    'industry-news',   'General AI industry news and analysis',         '#64748B', 'newspaper',      12)
ON CONFLICT (slug) DO NOTHING;
