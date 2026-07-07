# AI Intelligence Engine

## Overview
The AI Engine processes every raw article collected by the 40 collectors into structured, actionable intelligence. Collectors never call AI — all AI work flows through this single engine.

## Architecture
```
Collector → news table (raw) → processing_queue → AI Engine → processed_articles table → Dashboard
```

## Provider Abstraction
`src/lib/ai/providers/ai-provider.interface.ts` — `AIProvider` interface
`src/lib/ai/providers/claude.provider.ts`       — Claude implementation
`src/lib/ai/providers/provider-factory.ts`      — singleton factory

To swap providers: implement `AIProvider`, register in `provider-factory.ts`, set `AI_PROVIDER` env var.

## Processing Stages
1. Content Cleaning — strip HTML, URLs, normalize whitespace
2. Language Detection — fast heuristic + AI fallback
3. Summarization — short/medium/long/executive/bullet
4. Category Detection — primary + multi-category
5. Keyword Extraction — tags, keywords, tech, models, companies
6. Importance Scoring — 7 dimensions (0–100)
7. Action Recommendation — read/watch/install/star/learn/ignore
8. Semantic Dedup — AI-powered cross-source story linking
9. Related Content — finds related stored articles
10. Store — `processed_articles` + update `news.is_processed`

## Queue States
`pending → processing → completed`
`pending → processing → failed`
`failed → retrying → pending` (via /api/processing/retry)

## Files
```
src/lib/ai/providers/       — provider abstraction
src/lib/ai/prompts/         — versioned prompt templates (*.md)
src/lib/ai/services/        — one service per stage
src/lib/processing/         — orchestrator + queue manager
src/app/api/processing/     — HTTP API for queue management
n8n/workflows/ai-processing-trigger.json — n8n polling trigger
database/migrations/004_ai_processing.sql
```
