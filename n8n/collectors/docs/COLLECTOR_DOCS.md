# Collector Documentation

All collectors follow the same pipeline. Only the **Fetch** step differs per collector.

## Pipeline (all collectors)

```
Schedule Trigger → Set Context → Fetch [SOURCE-SPECIFIC]
  → Add Context → Execute Pipeline (pipeline-master)
      → Normalize → Validate → Enrich → Dedup
      → Store → Execution Summary → Record Health → Record Run
```

## Setup After Import

1. Import `pipeline-master.json` first — note its workflow ID
2. Set `PIPELINE_MASTER_WORKFLOW_ID` env var in n8n to that ID
3. Import individual collector workflows
4. Set required env vars (see table below)
5. Activate desired collectors

## Environment Variables

| Variable                 | Required By                          | Description                        |
|--------------------------|--------------------------------------|------------------------------------|
| `APP_URL`                | All                                  | Next.js app base URL               |
| `PIPELINE_MASTER_WORKFLOW_ID` | All                            | n8n workflow ID of pipeline-master |
| `GITHUB_TOKEN`           | GitHub group + auth-required sources | GitHub Personal Access Token       |
| `REDDIT_ACCESS_TOKEN`    | reddit                               | Reddit OAuth bearer token          |
| `PRODUCT_HUNT_API_TOKEN` | product-hunt, ai-launches            | Product Hunt API v2 token          |
| `YOUTUBE_API_KEY`        | youtube                              | Google Cloud YouTube Data API v3   |

## Collector Groups

### Group 1 — AI Companies (23 collectors)

| ID | Name | Fetch Type | Schedule |
|----|------|------------|----------|
| openai | OpenAI | RSS | High (2h) |
| anthropic | Anthropic | RSS | High (2h) |
| google-ai | Google AI | RSS | High (2h) |
| hugging-face | Hugging Face | RSS | High (2h) |
| microsoft-ai | Microsoft AI | RSS | Medium (6h) |
| meta-ai | Meta AI | RSS | Medium (6h) |
| mistral-ai | Mistral AI | GitHub Releases | Medium (6h) |
| xai | xAI | GitHub Releases | Medium (6h) |
| perplexity | Perplexity | GitHub Releases | Medium (6h) |
| groq | Groq | GitHub Releases | Medium (6h) |
| together-ai | Together AI | GitHub Releases | Low (12h) |
| fireworks-ai | Fireworks AI | GitHub Releases | Low (12h) |
| stability-ai | Stability AI | RSS | Low (12h) |
| elevenlabs | ElevenLabs | GitHub Releases | Low (12h) |
| runway | Runway | GitHub Releases | Low (12h) |
| replicate | Replicate | RSS | Medium (6h) |
| firecrawl | Firecrawl | GitHub Releases | Low (12h) |
| langchain | LangChain | RSS | Medium (6h) |
| llamaindex | LlamaIndex | GitHub Releases | Low (12h) |
| ollama | Ollama | GitHub Releases | Medium (6h) |
| vercel-ai | Vercel AI SDK | GitHub Releases | Medium (6h) |
| cursor | Cursor | RSS | Medium (6h) |
| windsurf | Windsurf | GitHub Releases | Low (12h) |
| lovable | Lovable | RSS | Low (12h) |

### Group 2 — GitHub (8 collectors)

| ID | Fetch Type | Auth |
|----|------------|------|
| github-trending | GitHub Search API | GITHUB_TOKEN |
| github-ai-releases | GitHub Search API | GITHUB_TOKEN |
| mcp-repos | GitHub Search API | GITHUB_TOKEN |
| ai-agents | GitHub Search API | GITHUB_TOKEN |
| browser-automation | GitHub Search API | GITHUB_TOKEN |
| prompt-engineering | GitHub Search API | GITHUB_TOKEN |
| rag-repos | GitHub Search API | GITHUB_TOKEN |

### Group 3 — Research (3 collectors)

| ID | Feed |
|----|------|
| arxiv | http://export.arxiv.org/rss/cs.AI |
| papers-with-code | https://paperswithcode.com/latest/rss |
| hf-papers | https://huggingface.co/papers/rss |

### Group 4 — Communities (2 collectors)

| ID | API | Auth |
|----|-----|------|
| reddit | Reddit REST API | REDDIT_ACCESS_TOKEN |
| hacker-news | Firebase REST API | None |

### Group 5 — Product (2 collectors)

| ID | API | Auth |
|----|-----|------|
| product-hunt | GraphQL v2 | PRODUCT_HUNT_API_TOKEN |
| ai-launches | GraphQL v2 | PRODUCT_HUNT_API_TOKEN |

### Group 6 — Learning (1 collector)

| ID | API | Auth |
|----|-----|------|
| youtube | YouTube Data API v3 | YOUTUBE_API_KEY |

### Group 7 — Opportunities (1 collector)

| ID | Feed |
|----|------|
| ai-opportunities | YC Feed (configurable) |

## Failure Modes (all collectors)

| Failure | Behaviour |
|---------|-----------|
| Source unreachable | error-handler workflow fires; retried 3× |
| Malformed item | Dropped at Validate; logged; pipeline continues |
| Duplicate URL | Filtered at Dedup; not stored; counted |
| Source ID missing | Items skipped; logged; health updated |
| Store fails | n8n retries 3× per item; partial status |
| App unreachable | Health records failure; error-handler fires |

## Adding a New Collector

1. Add entry to `collector-registry.json`
2. Create `n8n/workflows/collector-{id}.json` with:
   - Schedule Trigger (reads cron from registry)
   - Set Context node (sets `_ctx` with collector metadata)
   - **One fetch node** (the only source-specific logic)
   - Optional extract/transform node if API returns nested data
   - Add Context node
   - Execute Pipeline node (calls `pipeline-master`)
3. Import into n8n, set `PIPELINE_MASTER_WORKFLOW_ID`, activate

No changes to `pipeline-master.json` are ever required.
