-- Migration 009: Add missing sources from collector workflows
-- Run after 008_retry_compatible_start_job.sql

BEGIN;

INSERT INTO sources (name, slug, type, url, check_interval_minutes, metadata) VALUES
  ('AI Agents', 'ai-agents', 'rss', 'https://api.github.com/search/repositories?q=topic:ai-agent+topic:autonomous-agent&sort=updated&order=desc&per_page=25', 120, '{}'),
  ('AI Launches', 'ai-launches', 'rss', 'https://api.producthunt.com/v2/api/graphql', 120, '{}'),
  ('AI Opportunities', 'ai-opportunities', 'rss', 'https://feeds.feedburner.com/ycombinator', 120, '{}'),
  ('Anthropic', 'anthropic', 'rss', 'https://www.anthropic.com/rss.xml', 120, '{}'),
  ('arXiv CS.AI', 'arxiv', 'rss', 'http://export.arxiv.org/rss/cs.AI', 120, '{}'),
  ('Browser Automation', 'browser-automation', 'rss', 'https://api.github.com/search/repositories?q=topic:browser-automation+topic:ai&sort=updated&order=desc&per_page=25', 120, '{}'),
  ('Cursor', 'cursor', 'rss', 'https://changelog.cursor.com/rss.xml', 120, '{}'),
  ('ElevenLabs', 'elevenlabs', 'rss', 'https://api.github.com/repos/elevenlabs/elevenlabs-python/releases?per_page=10', 120, '{}'),
  ('Firecrawl', 'firecrawl', 'rss', 'https://api.github.com/repos/mendableai/firecrawl/releases?per_page=10', 120, '{}'),
  ('Fireworks AI', 'fireworks-ai', 'rss', 'https://api.github.com/repos/fw-ai/fireworks-ai-python/releases?per_page=10', 120, '{}'),
  ('GitHub AI Releases', 'github-ai-releases', 'rss', 'https://api.github.com/search/repositories?q=topic:llm+topic:language-model&sort=updated&order=desc&per_page=25', 120, '{}'),
  ('Google AI', 'google-ai', 'rss', 'https://blog.google/technology/ai/rss/', 120, '{}'),
  ('Groq', 'groq', 'rss', 'https://api.github.com/repos/groq/groq-python/releases?per_page=10', 120, '{}'),
  ('HF Papers', 'hf-papers', 'rss', 'https://huggingface.co/papers/rss', 120, '{}'),
  ('Hugging Face', 'hugging-face', 'rss', 'https://huggingface.co/blog/feed.xml', 120, '{}'),
  ('LangChain', 'langchain', 'rss', 'https://blog.langchain.dev/rss/', 120, '{}'),
  ('LlamaIndex', 'llamaindex', 'rss', 'https://api.github.com/repos/run-llama/llama_index/releases?per_page=10', 120, '{}'),
  ('Lovable', 'lovable', 'rss', 'https://lovable.dev/blog/rss.xml', 120, '{}'),
  ('MCP Repos', 'mcp-repos', 'rss', 'https://api.github.com/search/repositories?q=topic:mcp+model-context-protocol&sort=updated&order=desc&per_page=25', 120, '{}'),
  ('Meta AI', 'meta-ai', 'rss', 'https://engineering.fb.com/category/ai-research/feed/', 120, '{}'),
  ('Microsoft AI', 'microsoft-ai', 'rss', 'https://blogs.microsoft.com/ai/feed/', 120, '{}'),
  ('Mistral AI', 'mistral-ai', 'rss', 'https://api.github.com/repos/mistralai/mistral-inference/releases?per_page=10', 120, '{}'),
  ('Ollama', 'ollama', 'rss', 'https://api.github.com/repos/ollama/ollama/releases?per_page=10', 120, '{}'),
  ('Perplexity', 'perplexity', 'rss', 'https://api.github.com/repos/perplexity-ai/perplexity-live/releases?per_page=10', 120, '{}'),
  ('Prompt Engineering', 'prompt-engineering', 'rss', 'https://api.github.com/search/repositories?q=topic:prompt-engineering&sort=stars&order=desc&per_page=25', 120, '{}'),
  ('RAG Repos', 'rag-repos', 'rss', 'https://api.github.com/search/repositories?q=topic:rag+retrieval-augmented-generation&sort=updated&order=desc&per_page=25', 120, '{}'),
  ('Reddit AI', 'reddit', 'rss', 'https://oauth.reddit.com/r/MachineLearning+artificial+LocalLLaMA/new.json?limit=25', 120, '{}'),
  ('Replicate', 'replicate', 'rss', 'https://replicate.com/blog/rss', 120, '{}'),
  ('Runway', 'runway', 'rss', 'https://api.github.com/repos/runwayml/stable-diffusion-public-assets/releases?per_page=10', 120, '{}'),
  ('Stability AI', 'stability-ai', 'rss', 'https://stability.ai/news/rss', 120, '{}'),
  ('Together AI', 'together-ai', 'rss', 'https://api.github.com/repos/togethercomputer/together-python/releases?per_page=10', 120, '{}'),
  ('Vercel AI SDK', 'vercel-ai', 'rss', 'https://api.github.com/repos/vercel/ai/releases?per_page=10', 120, '{}'),
  ('Windsurf', 'windsurf', 'rss', 'https://api.github.com/repos/codeium/windsurf/releases?per_page=10', 120, '{}'),
  ('xAI', 'xai', 'rss', 'https://api.github.com/repos/xai-org/grok-1/releases?per_page=10', 120, '{}'),
  ('YouTube AI Search', 'youtube', 'rss', 'https://www.googleapis.com/youtube/v3/search', 120, '{}')
ON CONFLICT (slug) DO NOTHING;

COMMIT;
