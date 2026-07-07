# OpenAI Blog Collector

**Version:** 1.0.0  
**Source:** OpenAI Blog RSS — `https://openai.com/blog/rss.xml`  
**Schedule:** Every 2 hours (`0 */2 * * *`)  
**Workflow file:** `n8n/workflows/collector-openai.json`

---

## Pipeline

```
Schedule Trigger
  → Set Workflow Context   (sets _ctx: run_id, source_slug, timestamps)
  → Fetch OpenAI RSS       ← ONLY collector-specific node
  → Limit Items            (cap at max_items = 20)
  → Normalize Items        (clean URLs, dates, tags — shared logic)
  → Validate Items         (drop items missing title/url — shared logic)
  → Enrich Items           (url_hash, read time, collector metadata — shared logic)
  → Check Existing Hashes  (GET /api/search)
  → Filter Duplicates      (FNV-1a hash dedup — shared logic)
  → Has New Items?
      ├─ YES → Resolve Source ID (GET /api/sources?slug=openai-blog)
      │        → Attach Source ID
      │        → Store Items (POST /api/news, per item)
      │        → Execution Summary
      └─ NO  → No New Items (NoOp) → Execution Summary
```

**Only the "Fetch OpenAI RSS" node is OpenAI-specific.** All other nodes use the shared pipeline pattern and can be copied verbatim to any new collector.

---

## Environment Variables

| Variable      | Required | Description                          |
|---------------|----------|--------------------------------------|
| `APP_URL`     | Yes      | Next.js app base URL (e.g. `http://localhost:3000`) |

No API key is required — the OpenAI blog RSS feed is public.

---

## Failure Cases & Retry Strategy

| Failure                  | Behaviour                                              |
|--------------------------|--------------------------------------------------------|
| RSS fetch fails (5xx)    | n8n built-in retry (3×, 2s interval) on Store node; error-handler workflow triggered |
| RSS feed empty           | Normalize → 0 items → "No New Items" path → summary logged, no error |
| Item missing title/url   | Dropped at Validate step; logged as `[VALIDATE] rejected` |
| Duplicate URL            | Filtered at Filter Duplicates step; logged as `[DEDUP] skipped` |
| Source ID not found      | Attach Source ID filters out items with no source_id; logged as `[STORE] source_id not found` |
| POST /api/news fails     | n8n Store Items node retries 3×; partial failures reflected in summary `store_failures` count |
| App unreachable          | error-handler workflow fires; permanent failure logged |

---

## Execution Summary Fields

```json
{
  "workflow":           "collector-openai",
  "source_slug":        "openai-blog",
  "run_id":             "run_1720000000000",
  "started_at":         "2024-01-01T00:00:00.000Z",
  "finished_at":        "2024-01-01T00:00:15.000Z",
  "duration_ms":        15000,
  "status":             "success | partial",
  "items_fetched":      20,
  "items_validated":    19,
  "items_deduplicated": 3,
  "items_stored":       3,
  "items_skipped":      1,
  "items_duplicate":    16,
  "store_failures":     0
}
```

---

## Known Limitations

- RSS feed returns ~20 most recent posts; older posts are not backfilled.
- No AI summarization or importance scoring in this phase (Phase 6+).
- `category_id` is not set — category matching is a future enrichment step.
- Content is raw RSS snippet, not full article body.

---

## Adding a New Collector

1. Copy `n8n/workflows/collector-openai.json`
2. Replace the "Fetch OpenAI RSS" node with your source-specific fetch node
3. Update `source_slug` in "Set Workflow Context"
4. Update the `?slug=` value in "Resolve Source ID"
5. Adjust schedule cron if needed
6. Import into n8n and activate

All other nodes (Normalize, Validate, Enrich, Dedup, Store, Summary) require zero changes.
