# Queue System

## Flow
1. Pipeline-master stores article → calls POST /api/processing/queue (auto-enqueue)
2. n8n `ai-processing-trigger` runs every 15 min → GET /api/processing/jobs?batch=5
3. Each job calls `processArticle(newsId)` → runs all AI stages
4. Result stored in `processed_articles`, `news.is_processed` = true

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/processing/queue | List pending jobs |
| GET | /api/processing/queue?action=stats | Queue size by status |
| POST | /api/processing/queue | Enqueue article |
| GET | /api/processing/jobs?batch=N | Process next N articles |
| POST | /api/processing/jobs | Process specific article |
| POST | /api/processing/retry | Requeue failed jobs |
| GET | /api/processing/stats | Processing statistics |

## Retry Strategy
- Max 3 attempts per article
- Failed jobs can be requeued via POST /api/processing/retry
- Articles are never deleted from the queue on failure — raw data is always preserved

## Scaling
- Increase batch size in `ai-processing-trigger.json` (currently 5/tick)
- Add multiple n8n trigger workflows with staggered schedules
- Future: replace polling with Supabase Realtime webhook
