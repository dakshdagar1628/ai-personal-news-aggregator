# ERROR_HANDLING.md

## Error Categories

| Category | HTTP/Trigger | Retryable | Action |
|---|---|---|---|
| `RATE_LIMIT` | 429 | Yes (60s delay) | Retry with backoff |
| `TIMEOUT` | ETIMEDOUT | Yes (5s delay) | Retry with backoff |
| `NETWORK` | ECONNREFUSED | Yes (10s delay) | Retry with backoff |
| `VALIDATION` | 422 | No | Log and skip |
| `NOT_FOUND` | 404 | No | Log and skip |
| `AUTH` | 401/403 | No | Alert + stop |
| `UNKNOWN` | — | Yes (5s delay) | Retry once |

## Error Handler Workflow

Set on every workflow:
```json
"settings": { "errorWorkflow": "error-handler" }
```

The `error-handler` workflow (`templates/07-error-handler.template.json`):
1. Receives error via **Error Trigger** node
2. Classifies error by message pattern
3. Logs structured error entry
4. Routes: retryable → retry queue | permanent → alert

## In-Node Error Handling

Use `neverError: true` on HTTP Request nodes to prevent workflow abort:
```json
"options": { "response": { "response": { "neverError": true } } }
```
Then check `$json.error` in the next Code node.

## Recovery Patterns

**Partial batch failure** — some items fail storage:
- Log failures with item URL
- Continue with remaining items
- Report partial success in Execution Summary

**Full workflow failure** — error handler catches it:
- Increments `error_count` on source record via API
- After 3 consecutive failures, marks source `is_active: false`

## Logging Error Events

Always include:
```js
console.error('[ERROR]', JSON.stringify({
  category, workflow, source_slug, message, timestamp, retryable
}));
```
