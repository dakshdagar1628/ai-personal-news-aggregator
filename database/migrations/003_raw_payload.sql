-- Migration 003: Add raw and normalized payload columns to news table
-- Enables reprocessing historical data without re-fetching

ALTER TABLE news
  ADD COLUMN IF NOT EXISTS raw_payload        JSONB,
  ADD COLUMN IF NOT EXISTS normalized_payload JSONB,
  ADD COLUMN IF NOT EXISTS category_hint      TEXT,
  ADD COLUMN IF NOT EXISTS external_id        TEXT,
  ADD COLUMN IF NOT EXISTS estimated_read_time INTEGER;

CREATE INDEX IF NOT EXISTS idx_news_external_id ON news (external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_category_hint ON news (category_hint) WHERE category_hint IS NOT NULL;

COMMENT ON COLUMN news.raw_payload        IS 'Original payload from the source as received by the collector';
COMMENT ON COLUMN news.normalized_payload IS 'Normalized payload after pipeline processing';
COMMENT ON COLUMN news.category_hint      IS 'Category hint from collector — used by AI categorization step';
COMMENT ON COLUMN news.external_id        IS 'Source-specific unique ID (RSS guid, GitHub ID, etc.)';
COMMENT ON COLUMN news.estimated_read_time IS 'Estimated read time in minutes based on content length';
