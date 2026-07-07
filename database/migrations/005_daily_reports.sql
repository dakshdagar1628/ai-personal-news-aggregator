-- Migration 005: Daily report engine
ALTER TABLE daily_reports
  ADD COLUMN IF NOT EXISTS version            INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS prompt_version     TEXT NOT NULL DEFAULT '1.0.0',
  ADD COLUMN IF NOT EXISTS processing_version TEXT NOT NULL DEFAULT '1.0.0',
  ADD COLUMN IF NOT EXISTS sections           JSONB,
  ADD COLUMN IF NOT EXISTS top_stories        JSONB,
  ADD COLUMN IF NOT EXISTS ai_company_updates JSONB,
  ADD COLUMN IF NOT EXISTS github_highlights  JSONB,
  ADD COLUMN IF NOT EXISTS tools              JSONB,
  ADD COLUMN IF NOT EXISTS research_papers    JSONB,
  ADD COLUMN IF NOT EXISTS tutorials          JSONB,
  ADD COLUMN IF NOT EXISTS opportunities      JSONB,
  ADD COLUMN IF NOT EXISTS learn_today        JSONB,
  ADD COLUMN IF NOT EXISTS action_center      JSONB,
  ADD COLUMN IF NOT EXISTS trends             JSONB,
  ADD COLUMN IF NOT EXISTS statistics         JSONB,
  ADD COLUMN IF NOT EXISTS events             JSONB,
  ADD COLUMN IF NOT EXISTS estimated_read_min INTEGER,
  ADD COLUMN IF NOT EXISTS sources_count      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS articles_count     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS error_message      TEXT,
  ADD COLUMN IF NOT EXISTS regenerated_at     TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS report_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id      UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  primary_category TEXT,
  importance     NUMERIC(5,2),
  news_ids       UUID[] NOT NULL DEFAULT '{}',
  source_count   INTEGER DEFAULT 1,
  sources        TEXT[] NOT NULL DEFAULT '{}',
  canonical_id   UUID,
  metadata       JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_reports_status  ON daily_reports (status);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date2   ON daily_reports (report_date DESC);
CREATE INDEX IF NOT EXISTS idx_report_events_report  ON report_events (report_id);
