# COLLECTOR_TEMPLATE.md

Step-by-step guide to building a new collector in 15 minutes.

## Step 1 — Duplicate the example workflow

Copy `examples/example-mock-collector.json` and rename it:
```
n8n/workflows/collector-<your-source-slug>.json
```

## Step 2 — Update the context node

In `Set Workflow Context`, change:
```js
workflow_name: 'collector-<your-source-slug>',
source_slug:   '<your-source-slug>',   // must match sources table
```

## Step 3 — Replace the fetch node

Delete `Generate Mock Data`. Add your real fetch:

| Source type | n8n node to use |
|---|---|
| RSS feed | HTTP Request → parse XML in Code node |
| REST API | HTTP Request (GET) |
| GraphQL | HTTP Request (POST with query body) |
| Scraper | HTTP Request → parse HTML in Code node |
| YouTube | HTTP Request → YouTube Data API v3 |

Your fetch node must output items with **at minimum**:
```json
{ "title": "...", "url": "...", "description": "..." }
```
The Normalize step will map everything else.

## Step 4 — Verify source_slug exists in DB

Run once before testing:
```
GET /api/sources → check your source slug appears
```
If missing, POST /api/sources or run the seed SQL.

## Step 5 — Test

1. Set `APP_URL` env var in n8n
2. Click **Execute Workflow**
3. Verify `Execution Summary` shows `items_stored > 0`
4. Check dashboard — items should appear

## Step 6 — Schedule

In the Manual Trigger node → switch to Schedule Trigger.
Use interval from `config/sources.config.json → schedule`.

## Checklist

- [ ] source_slug matches DB record
- [ ] Only fetch node replaced (all other nodes untouched)
- [ ] Error workflow set to `error-handler`
- [ ] Tested with Execute once
- [ ] Schedule set correctly
- [ ] Workflow file saved to `n8n/workflows/`
