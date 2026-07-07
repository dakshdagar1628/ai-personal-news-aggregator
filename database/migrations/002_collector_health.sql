-- Migration 002: Collector health tracking
-- Run after 001_initial_schema.sql

CREATE TABLE IF NOT EXISTS collector_health (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id             TEXT NOT NULL UNIQUE,
  collector_name           TEXT NOT NULL,
  status                   TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle','running','success','failed','partial')),
  is_enabled               BOOLEAN NOT NULL DEFAULT true,
  last_run_at              TIMESTAMPTZ,
  last_success_at          TIMESTAMPTZ,
  last_failure_at          TIMESTAMPTZ,
  last_run_duration_ms     INTEGER,
  avg_run_duration_ms      INTEGER,
  total_runs               INTEGER NOT NULL DEFAULT 0,
  successful_runs          INTEGER NOT NULL DEFAULT 0,
  failed_runs              INTEGER NOT NULL DEFAULT 0,
  total_items_collected    INTEGER NOT NULL DEFAULT 0,
  total_items_stored       INTEGER NOT NULL DEFAULT 0,
  total_duplicates         INTEGER NOT NULL DEFAULT 0,
  total_validation_errors  INTEGER NOT NULL DEFAULT 0,
  last_error_message       TEXT,
  current_version          TEXT NOT NULL DEFAULT '1.0.0',
  metadata                 JSONB,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collector_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id      TEXT NOT NULL,
  collector_name    TEXT NOT NULL,
  source_slug       TEXT NOT NULL,
  run_id            TEXT NOT NULL UNIQUE,
  started_at        TIMESTAMPTZ NOT NULL,
  finished_at       TIMESTAMPTZ,
  duration_ms       INTEGER,
  status            TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','success','partial','failed')),
  items_fetched     INTEGER NOT NULL DEFAULT 0,
  items_validated   INTEGER NOT NULL DEFAULT 0,
  items_stored      INTEGER NOT NULL DEFAULT 0,
  items_duplicate   INTEGER NOT NULL DEFAULT 0,
  items_skipped     INTEGER NOT NULL DEFAULT 0,
  store_failures    INTEGER NOT NULL DEFAULT 0,
  error_message     TEXT,
  version           TEXT NOT NULL DEFAULT '1.0.0',
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collector_health_id     ON collector_health (collector_id);
CREATE INDEX IF NOT EXISTS idx_collector_health_status ON collector_health (status);
CREATE INDEX IF NOT EXISTS idx_collector_runs_id       ON collector_runs (collector_id);
CREATE INDEX IF NOT EXISTS idx_collector_runs_started  ON collector_runs (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_collector_runs_run_id   ON collector_runs (run_id);

CREATE TRIGGER collector_health_updated_at
  BEFORE UPDATE ON collector_health
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
