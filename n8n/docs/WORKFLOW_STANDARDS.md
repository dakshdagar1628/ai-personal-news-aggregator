# WORKFLOW_STANDARDS.md

## Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| Collector | `collector-<slug>` | `collector-hacker-news` |
| Processor | `processor-<action>` | `processor-ai-summarize` |
| Report | `report-<period>` | `report-daily` |
| Notification | `notification-<channel>` | `notification-email` |
| Error handler | `error-handler` | `error-handler` |

## Mandatory Rules

1. **One workflow per source** — never combine two sources in one workflow
2. **One responsibility per workflow** — collect OR process OR report, never all
3. **Always use shared templates** — never duplicate normalize/validate/dedup logic
4. **Every workflow logs** — `Set Workflow Context` first, `Execution Summary` last
5. **Every workflow validates** — run Validate Items before any storage call
6. **Every workflow deduplicates** — run Deduplicate before any storage call
7. **Error workflow set** — every workflow must set `settings.errorWorkflow: 'error-handler'`
8. **No hardcoded secrets** — use `$env.VAR_NAME` expressions only
9. **Version your workflows** — set `_meta.version` in workflow JSON

## Node Naming Convention

```
Set Workflow Context     ← always first (after trigger)
Generate [Source] Data   ← fetch step (collector-specific)
Normalize Items          ← always this name
Validate Items           ← always this name
Attach URL Hashes        ← always this name
Check Existing (API)     ← always this name
Filter Duplicates        ← always this name
Has New Items?           ← always this name
Store Items (API)        ← always this name
Execution Summary        ← always last
```

## Retry Policy (default)

| Scenario | Max Attempts | Initial Delay | Backoff |
|---|---|---|---|
| Rate limit (429) | 3 | 60s | 2x |
| Network error | 3 | 10s | 2x |
| Server error (5xx) | 3 | 5s | 2x |
| Validation error | 0 | — | — |
| Auth error (401/403) | 0 | — | — |

Configure per-workflow in `config/workflow.config.json → retry`.

## Version History

Bump `_meta.version` on every structural change:
- `1.0.0` → initial
- `1.1.0` → new node added / logic change
- `2.0.0` → breaking change (new required input)
