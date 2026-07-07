-- Seed: Sources
INSERT INTO sources (name, slug, type, url, check_interval_minutes, metadata) VALUES
  ('Hacker News',             'hacker-news',              'rss',     'https://news.ycombinator.com/rss',                              30,  '{"filter": "AI"}'),
  ('Reddit r/artificial',     'reddit-artificial',        'rss',     'https://www.reddit.com/r/artificial/.rss',                      60,  '{"subreddit": "artificial"}'),
  ('Reddit r/MachineLearning','reddit-machinelearning',   'rss',     'https://www.reddit.com/r/MachineLearning/.rss',                 60,  '{"subreddit": "MachineLearning"}'),
  ('OpenAI Blog',             'openai-blog',              'rss',     'https://openai.com/blog/rss',                                   120, '{}'),
  ('Anthropic Blog',          'anthropic-blog',           'rss',     'https://www.anthropic.com/news/rss',                            120, '{}'),
  ('Google AI Blog',          'google-ai-blog',           'rss',     'https://blog.research.google/feeds/posts/default',              120, '{}'),
  ('GitHub Trending',         'github-trending',          'scraper', 'https://github.com/trending?since=daily&spoken_language_code=', 120, '{"language": ""}'),
  ('GitHub Releases',         'github-releases',          'api',     'https://api.github.com',                                        60,  '{"repos": ["openai/openai-python", "anthropics/anthropic-sdk-python"]}'),
  ('Product Hunt',            'product-hunt',             'api',     'https://api.producthunt.com/v2/api/graphql',                    120, '{"topic": "artificial-intelligence"}'),
  ('YouTube AI',              'youtube-ai',               'youtube', 'https://www.googleapis.com/youtube/v3',                         180, '{"channelIds": []}'),
  ('Papers With Code',        'papers-with-code',         'rss',     'https://paperswithcode.com/latest',                             240, '{}'),
  ('AI Tools Directory',      'ai-tools-directory',       'rss',     'https://theresanaiforthat.com/feed/',                           360, '{}'),
  ('Free AI Offers',          'free-ai-offers',           'rss',     'https://reddit.com/r/AIAssistants/.rss',                        120, '{}'),
  ('MCP Servers',             'mcp-servers',              'api',     'https://api.github.com/search/repositories',                    240, '{"query": "mcp-server topic:mcp"}'),
  ('Claude Code Updates',     'claude-code-updates',      'api',     'https://api.github.com/repos/anthropics/claude-code/releases',  120, '{}')
ON CONFLICT (slug) DO NOTHING;
