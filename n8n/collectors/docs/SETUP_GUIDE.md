# Collector Setup Guide

## Step 1 — Database Migrations

Run in order against your Supabase project:

```sql
-- In Supabase SQL Editor:
\i database/migrations/001_initial_schema.sql
\i database/migrations/002_collector_health.sql
\i database/migrations/003_raw_payload.sql
```

## Step 2 — Environment Variables

Add to your n8n instance environment:

```bash
APP_URL=http://localhost:3000          # Your Next.js app URL
PIPELINE_MASTER_WORKFLOW_ID=           # Set after importing pipeline-master

# Auth — only needed for collectors that require it
GITHUB_TOKEN=ghp_...
REDDIT_ACCESS_TOKEN=...
PRODUCT_HUNT_API_TOKEN=...
YOUTUBE_API_KEY=...
```

## Step 3 — Import Workflows (in order)

1. `n8n/workflows/pipeline-master.json`  ← Import first, copy its ID
2. Set `PIPELINE_MASTER_WORKFLOW_ID` in n8n env to that ID
3. Import all `collector-*.json` files

## Step 4 — Seed Sources Table

Each collector resolves its `source_slug` to a `source_id` UUID via `GET /api/sources?slug=`.
Seed the sources table from `config/sources.config.ts` or via the API:

```bash
curl -X POST $APP_URL/api/sources \
  -H "Content-Type: application/json" \
  -d '{"name":"OpenAI","slug":"openai","type":"rss","url":"https://openai.com/blog","is_active":true}'
```

## Step 5 — Activate Collectors

Start with high-priority collectors:
- `collector-openai` (reference implementation — activate first to verify pipeline)
- `collector-anthropic`
- `collector-google-ai`
- `collector-hugging-face`

Then activate medium and low priority collectors as needed.

## Step 6 — Verify Health

After first runs check:
```
GET $APP_URL/api/collector-health
GET $APP_URL/api/collector-runs?limit=10
```

## Reddit OAuth Setup

Reddit requires OAuth. Get a token:
```bash
curl -X POST https://www.reddit.com/api/v1/access_token \
  -u "$REDDIT_CLIENT_ID:$REDDIT_CLIENT_SECRET" \
  -d "grant_type=client_credentials" \
  -H "User-Agent: AI-Intelligence-OS/1.0"
```
Store the `access_token` as `REDDIT_ACCESS_TOKEN`.

## GitHub Token Scopes

A classic PAT with `public_repo` read scope is sufficient.
Fine-grained tokens: read-only access to public repositories.
