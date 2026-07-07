# Dashboard Intelligence — Phase 8

## Pages
| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Executive overview — report summary, events, trends, health |
| `/events` | Server | Semantic event center — deduplicated grouped stories |
| `/trends` | Server | 7-day rolling trends by category/tech/model/tag |
| `/timeline` | Server | Chronological article browser (today/week/month/year) |
| `/search` | Client | Full-text search across all collected intelligence |
| `/collector-health` | Server | All 39 collectors — status, runs, items |
| `/processing` | Server | AI queue status, token usage, latency |
| `/reports` | Server | Today's report + historical reports |
| `/knowledge` | Server | Entity frequency graph (companies, models, tech) |
| `/bookmarks` | Client | localStorage bookmarks |
| `/settings` | Client | Theme, preferences |

## Key Components (`src/components/intelligence/`)
- `MetricCard` — KPI display with color coding
- `EventCard` — Grouped event with importance + sources
- `TrendCard` — Horizontal bar trend item
- `HealthCard` — Collector status row
- `RecommendationCard` — Action badge + explanation
- `QueueStatus` — Processing queue status grid
- `InsightPanel` — Titled section wrapper

## Data Flow
All server pages use `fetchAPI()` from `src/lib/dashboard/fetcher.ts` with `revalidate: 300` (5 min cache).
Client pages (`search`, `bookmarks`, `settings`) use `fetch()` or `localStorage` directly.

## New API Routes (Phase 8)
- `GET /api/dashboard` — aggregated homepage data
- `GET /api/events` — semantic groups
- `GET /api/trends` — 7-day rolling aggregates
- `GET /api/recommendations` — action-filtered processed articles
- `GET /api/timeline?range=today|week|month|year` — chronological articles
- `GET /api/knowledge` — entity frequency map
- `GET /api/bookmarks` — placeholder (localStorage in this phase)
