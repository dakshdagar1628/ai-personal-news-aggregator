# OpenAI Collector — Test Scenarios

## How to Test

1. Import `n8n/workflows/collector-openai.json` into n8n
2. Set `APP_URL` in n8n environment variables
3. Use the **Manual Trigger** (add one via n8n UI, or run via CLI) to execute

---

## Scenario 1 — Successful Fetch (Happy Path)

**Setup:** App running, Supabase configured (or mock fallback active), `openai-blog` source exists in DB.

**Expected:**
- RSS feed returns items
- All items with valid title + url pass validation
- Items not in DB are stored via POST /api/news
- Execution Summary shows `status: "success"`, `items_stored > 0`

**Check:** Query `/api/news?source_id=<openai-blog-id>` — new items should appear.

---

## Scenario 2 — Duplicate Articles (Re-run)

**Setup:** Run the collector twice in succession without new posts published.

**Expected:**
- Second run: Filter Duplicates drops all items (all hashes already in DB)
- Workflow takes the "No New Items" path
- Summary: `items_deduplicated = 0`, `items_duplicate = N`, `status: "success"`
- No duplicate rows in the `news` table

---

## Scenario 3 — Invalid Article (Missing Title)

**Setup:** Mock or intercept RSS response to include one item with an empty `<title>` tag.

**Expected:**
- Normalize produces an item with `title: ""`
- Validate logs `[VALIDATE] rejected` for that item
- Summary: `items_skipped = 1`
- Invalid item is not stored

---

## Scenario 4 — Empty RSS Feed

**Setup:** Mock RSS response returns a valid feed with zero `<item>` entries.

**Expected:**
- Limit Items outputs 0 items
- Pipeline proceeds normally through all nodes
- Has New Items? → false → No New Items path
- Summary: all counts = 0, `status: "success"` (not an error)

---

## Scenario 5 — Network Failure (RSS Unreachable)

**Setup:** Set the RSS URL to an unreachable host, or block network in n8n.

**Expected:**
- "Fetch OpenAI RSS" node throws a network error
- n8n triggers the linked `error-handler` workflow
- Error classified as `NETWORK` or `TIMEOUT`
- Permanent failure logged if retries exhausted

---

## Scenario 6 — API Failure (App Unreachable)

**Setup:** Stop the Next.js app. Run the collector.

**Expected:**
- Fetch RSS succeeds (feed is public)
- Normalize / Validate / Enrich succeed (pure JS)
- Check Existing Hashes: HTTP node gets connection refused → `neverError: true` returns empty/error body
- Filter Duplicates: treats all items as new (no existing hashes found)
- Store Items: POST fails, n8n retries 3× then continues
- Summary: `store_failures = N`, `status: "partial"`
- Error handler fires

---

## Scenario 7 — Source ID Not Found

**Setup:** Remove the `openai-blog` row from the `sources` table (or use a fresh DB with no seed data).

**Expected:**
- Resolve Source ID: GET /api/sources?slug=openai-blog returns `data: null`
- Attach Source ID: logs `[STORE] source_id not found`, filters out all items
- Store Items receives 0 items, makes 0 POST calls
- Summary: `items_stored = 0`

**Fix:** Seed the sources table — run `database/migrations/001_initial_schema.sql` and insert the `openai-blog` source row.

---

## Verifying Dedup Integrity

```sql
-- No duplicate url_hash values should exist
SELECT url_hash, COUNT(*) as cnt
FROM news
WHERE source_id = (SELECT id FROM sources WHERE slug = 'openai-blog')
GROUP BY url_hash
HAVING COUNT(*) > 1;
-- Expected: 0 rows
```
