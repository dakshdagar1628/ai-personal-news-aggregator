# ARCHITECTURE.md — AI Intelligence OS

## Overview

AI Intelligence OS is an automated pipeline that collects AI-related content from 15+ sources, processes it with Claude AI (summarization, categorization, importance scoring), and presents it in a unified Next.js dashboard with a daily morning digest.

---

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                             │
│  OpenAI │ Anthropic │ Google AI │ HN │ Reddit │ GitHub           │
│  Product Hunt │ YouTube │ Papers │ MCP Servers │ AI Tools        │
└──────────────────────┬───────────────────────────────────────────┘
                       │  RSS / API / Scraper
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                        n8n AUTOMATION                            │
│  Collectors (1/source) → Normalizer → Deduplicator (url_hash)   │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Supabase REST API (service role key)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   SUPABASE (PostgreSQL)                          │
│         sources │ categories │ news │ daily_reports              │
└──────────┬───────────────────────────────┬───────────────────────┘
           │ is_processed=false            │ daily trigger
           ▼                               ▼
┌───────────────────────────┐  ┌──────────────────────────────────┐
│   AI PROCESSING (n8n)     │  │   REPORT GENERATOR (n8n)         │
│  Claude API → summary     │  │   Scheduled 5:30am               │
│  categorize, score, tags  │  │   Writes → daily_reports         │
└───────────────────────────┘  └──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│              NEXT.JS DASHBOARD (Vercel)                          │
│  / (feed) │ /reports │ /sources │ /settings                      │
│  Server Components + shadcn/ui + Tailwind                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Layer Breakdown

### 1. Data Collection Layer (n8n)
- One workflow per source — isolated, independently restartable
- Trigger: scheduled cron per `check_interval_minutes`
- Protocols: RSS/Atom, REST APIs, lightweight scraping

### 2. Data Normalization Layer (n8n)
- All collectors pass output through shared normalization step
- Maps source-specific fields → standard `NewsItemInsert` shape
- Computes `url_hash` (SHA-256 of URL) for deduplication
- **Rule:** nothing writes to DB without passing normalization

### 3. Storage Layer (Supabase PostgreSQL)
- n8n uses `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- Next.js uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `updated_at` trigger auto-fires on all mutable tables
- RLS policies planned for Phase 7

### 4. AI Processing Layer (n8n batch workflow)
- Queries `news WHERE is_processed = false`
- Calls Claude API: summarize → categorize → score → tag
- Falls back to OpenAI if Claude unavailable
- Sets `is_processed = true` on completion
- Tracks `ai_tokens_used` for cost monitoring

### 5. Report Generation Layer (n8n scheduled)
- Trigger: 5:30am daily
- Aggregates last 24h processed news
- Claude generates: executive summary, top stories, key themes
- Status lifecycle: `draft → generating → ready | failed`

### 6. Presentation Layer (Next.js + Vercel)
- App Router with nested layouts
- Server Components for data fetching, Client Components for interactivity
- shadcn/ui + Tailwind CSS

---

## Data Flow

```
1.  n8n cron triggers collector workflow
2.  Collector fetches raw data (RSS/API/scrape)
3.  Normalizer maps to standard schema
4.  url_hash computed → checked against existing records
5.  Duplicate? Skip. New? Insert news (is_processed=false)
6.  AI batch workflow queries unprocessed rows
7.  Claude called per item: summary, category, score, tags
8.  news row updated: is_processed=true, AI fields written
9.  5:30am: Report Generator workflow fires
10. Queries processed news from past 24h
11. Claude generates daily digest
12. daily_reports row inserted with status=ready
13. Next.js dashboard fetches and renders
```

---

## Component Responsibilities

| Component | Responsibility | Technology |
|---|---|---|
| Collector workflows | Fetch raw content | n8n |
| Normalizer | Standard schema + url_hash | n8n Function node |
| Supabase DB | Source of truth | PostgreSQL |
| AI Processing workflow | Summarize, categorize, score | n8n + Claude API |
| Report Generator | Daily digest | n8n + Claude API |
| Next.js App | Dashboard UI | Next.js 14 |
| Vercel | Hosting | Vercel |

---

## Security Architecture

| Key | Where Used | Exposure |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | n8n only | Never in browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Next.js frontend | Public (RLS guards) |
| `ANTHROPIC_API_KEY` | n8n only | Never in browser |
| `GITHUB_TOKEN` | n8n only | Never in browser |

---

## Known Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Rate limits | Per-source intervals + exponential backoff |
| Duplicate content | `url_hash` unique constraint at DB level |
| AI cost runaway | Token tracking + batch processing |
| Source failures | `error_count` tracking + `is_active` flag |
| Report failure | `status=failed` captured + manual re-trigger |

---

## Future Additions

- Phase 7: Supabase Auth + RLS + user_preferences
- Phase 8: Email digest (Resend), webhooks
- Phase 9: X/Twitter + Instagram collectors
- Phase 12: AI Chat via pgvector RAG
