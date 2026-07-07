# API Reference — AI Intelligence OS

Base URL: `http://localhost:3000/api`

All responses follow:
```json
{ "success": true|false, "data": {}, "message": "", "timestamp": "ISO8601" }
```
Errors:
```json
{ "success": false, "error": "...", "code": "NOT_FOUND|VALIDATION_ERROR|...", "details": {} }
```

---

## GET /api/news
List news items. Supports search and filtering.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `q` | string | Full-text search on title |
| `source_id` | uuid | Filter by source |
| `category_id` | uuid | Filter by category |
| `tags` | string | Comma-separated tags |
| `from` | ISO8601 | Start date |
| `to` | ISO8601 | End date |
| `min_score` | 0-1 | Minimum importance score |
| `featured` | boolean | Featured items only |
| `processed` | boolean | AI-processed only |
| `page` | int | Default: 1 |
| `pageSize` | int | Default: 20, max: 100 |
| `sortBy` | string | published_at \| collected_at \| importance_score |
| `sortDir` | asc\|desc | Default: desc |

**Response:** `PaginatedResponse<NewsItem>`

---

## POST /api/news
Create a news item (used by n8n collectors).

**Body:** `CreateNewsInput` (validated by Zod)
Required: `source_id`, `title`, `url`
Returns `null` with message `"Duplicate — skipped"` if URL already exists.

---

## GET /api/news/:id
Get single news item by UUID.

---

## PUT /api/news/:id
Update a news item. Body: partial `UpdateNewsInput`.

---

## DELETE /api/news/:id
Delete a news item.

---

## GET /api/categories
List all active categories ordered by `sort_order`.

---

## GET /api/sources
List sources. `?active=true` to return only active sources.

## POST /api/sources
Create a new source. Body: `CreateSourceInput`.

---

## GET /api/reports
List daily reports (last 30). `?date=YYYY-MM-DD` returns specific day.

## POST /api/reports
Upsert a daily report (used by n8n report generator).

---

## GET /api/search
Unified search across news. Same params as `GET /api/news`.

Response shape: `{ results: NewsItem[], total: number, query: string }`

---

## Error Codes
| Code | HTTP | Meaning |
|---|---|---|
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Zod validation failed |
| `DATABASE_ERROR` | 500 | Supabase error |
| `INTERNAL_ERROR` | 500 | Unexpected error |
