# LOGGING.md

## Log Levels

| Level | When | n8n method |
|---|---|---|
| `[START]` | First node executes | `console.log` |
| `[INFO]` | Normal progress | `console.log` |
| `[WARN]` | Skipped/degraded | `console.warn` |
| `[ERROR]` | Failures | `console.error` |
| `[DEDUP]` | Duplicate skipped | `console.log` |
| `[VALIDATE]` | Item rejected | `console.warn` |
| `[SUMMARY]` | Final node | `console.log` |

## Required Log Points

Every workflow must log at these points:

```
[START]    { workflow_name, source_slug, run_id, started_at }
[NORMALIZE] processed N items
[VALIDATE] valid=N invalid=N
[DEDUP]    new=N skipped=N
[STORE]    stored=N failed=N
[SUMMARY]  { all fields + duration_ms }
```

## Execution Summary Shape

```json
{
  "workflow":     "collector-hacker-news",
  "source_slug":  "hacker-news",
  "run_id":       "run_1720256400000",
  "started_at":   "2026-07-06T08:00:00Z",
  "finished_at":  "2026-07-06T08:00:12Z",
  "duration_ms":  12340,
  "status":       "success | partial | failed",
  "items_stored": 18,
  "items_failed": 0,
  "items_total":  25
}
```

## Viewing Logs

- **n8n UI**: Executions tab → click run → expand each node
- **Console**: available in n8n Docker logs: `docker logs -f n8n`
- **Future (Phase 6)**: Summary logs written to `workflow_logs` Supabase table for dashboard display
