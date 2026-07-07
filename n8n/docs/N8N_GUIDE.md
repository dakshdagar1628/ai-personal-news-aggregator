# N8N_GUIDE.md — AI Intelligence OS

## Setup

1. **Install n8n** — `docker run -d -p 5678:5678 n8nio/n8n` or use n8n.cloud
2. **Set env vars** in n8n settings:
   - `APP_URL` → `http://localhost:3000` (or Vercel URL)
3. **Import credentials** from `credentials/credentials.template.json` — fill real values in n8n UI
4. **Import workflows** — drag-drop JSON files from `examples/` and `templates/`

## Folder Structure

```
n8n/
├── shared/         JS modules (contract, normalize, validate, dedup, retry, logger)
├── templates/      Individual step templates — one per pipeline stage
├── examples/       Complete importable reference workflows
├── workflows/      Production workflow files (added as you build collectors)
├── collectors/     One sub-folder per source (future)
├── processors/     AI processing workflows (Phase 5)
├── reports/        Report generation workflows (Phase 5)
├── notifications/  Email/webhook workflows (Phase 7)
├── config/         JSON config files (sources, retry, monitoring)
├── credentials/    Placeholder credential configs (never commit real values)
└── docs/           This documentation
```

## Pipeline Contract

Every collector produces items conforming to:

```json
{
  "title":         "string (required, max 500)",
  "url":           "string (required, valid https URL)",
  "source_slug":   "string (required, matches sources table slug)",
  "content_raw":   "string | null",
  "author":        "string | null",
  "published_at":  "ISO8601 | null",
  "tags":          "string[]",
  "language":      "string (default: en)",
  "category_hint": "string | null",
  "external_id":   "string | null",
  "metadata":      "object"
}
```

**Rule:** A collector only implements the _Fetch_ step. It must pass raw output through the shared pipeline before storage.

## Adding a New Collector

1. Duplicate `examples/example-mock-collector.json`
2. Rename to `collector-<source-slug>.json`
3. Replace **only** the `Generate Mock Data` node with a real fetch node
4. Update `source_slug` in the `Set Workflow Context` node
5. Test with the mock data approach first
6. See `COLLECTOR_TEMPLATE.md` for full instructions
