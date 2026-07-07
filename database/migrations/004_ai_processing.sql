-- Migration 004: AI processing queue and processed results
-- Run after 003_raw_payload.sql

CREATE TYPE processing_status AS ENUM ('pending','processing','completed','failed','retrying','skipped');

CREATE TABLE IF NOT EXISTS processing_queue (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id           UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  status            processing_status NOT NULL DEFAULT 'pending',
  priority          INTEGER NOT NULL DEFAULT 5,
  attempts          INTEGER NOT NULL DEFAULT 0,
  max_attempts      INTEGER NOT NULL DEFAULT 3,
  scheduled_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  failed_at         TIMESTAMPTZ,
  next_retry_at     TIMESTAMPTZ,
  error_message     TEXT,
  error_details     JSONB,
  processing_version TEXT NOT NULL DEFAULT '1.0.0',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processed_articles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id              UUID NOT NULL UNIQUE REFERENCES news(id) ON DELETE CASCADE,
  -- Summaries
  summary_short        TEXT,           -- 1 sentence
  summary_medium       TEXT,           -- 3 sentences
  summary_long         TEXT,           -- paragraph
  executive_summary    TEXT,           -- executive-level
  bullet_summary       JSONB,          -- array of bullet strings
  -- Classification
  categories           TEXT[] NOT NULL DEFAULT '{}',
  primary_category     TEXT,
  -- Tags & keywords
  tags_primary         TEXT[] NOT NULL DEFAULT '{}',
  tags_secondary       TEXT[] NOT NULL DEFAULT '{}',
  keywords             TEXT[] NOT NULL DEFAULT '{}',
  technologies         TEXT[] NOT NULL DEFAULT '{}',
  frameworks           TEXT[] NOT NULL DEFAULT '{}',
  programming_languages TEXT[] NOT NULL DEFAULT '{}',
  models               TEXT[] NOT NULL DEFAULT '{}',
  companies            TEXT[] NOT NULL DEFAULT '{}',
  apis                 TEXT[] NOT NULL DEFAULT '{}',
  -- Scores (0-100)
  importance_score     NUMERIC(5,2),
  developer_score      NUMERIC(5,2),
  learning_score       NUMERIC(5,2),
  business_score       NUMERIC(5,2),
  urgency_score        NUMERIC(5,2),
  innovation_score     NUMERIC(5,2),
  confidence_score     NUMERIC(5,2),
  score_explanations   JSONB,          -- { importance: "...", developer: "..." }
  -- Action recommendation
  recommended_action   TEXT,           -- should_read | should_watch | should_install | should_star | should_learn | should_ignore
  action_explanation   TEXT,
  action_details       JSONB,          -- { read: bool, watch: bool, install: bool, star: bool, learn: bool, ignore: bool, reasons: {...} }
  -- Relations
  related_items        UUID[] NOT NULL DEFAULT '{}',
  semantic_group_id    UUID,           -- links semantically identical stories
  is_duplicate         BOOLEAN NOT NULL DEFAULT false,
  canonical_id         UUID REFERENCES processed_articles(id),
  -- Language
  language             TEXT DEFAULT 'en',
  language_confidence  NUMERIC(4,3),
  -- Processing metadata
  processed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processing_version   TEXT NOT NULL DEFAULT '1.0.0',
  prompt_version       TEXT NOT NULL DEFAULT '1.0.0',
  ai_provider          TEXT NOT NULL DEFAULT 'claude',
  ai_model             TEXT,
  tokens_used          INTEGER,
  processing_time_ms   INTEGER,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_groups (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT,
  description  TEXT,
  first_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  item_count   INTEGER NOT NULL DEFAULT 1,
  sources      TEXT[] NOT NULL DEFAULT '{}',
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processing_stats (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  queue_size        INTEGER NOT NULL DEFAULT 0,
  pending_count     INTEGER NOT NULL DEFAULT 0,
  processing_count  INTEGER NOT NULL DEFAULT 0,
  completed_today   INTEGER NOT NULL DEFAULT 0,
  failed_today      INTEGER NOT NULL DEFAULT 0,
  avg_processing_ms INTEGER,
  avg_ai_latency_ms INTEGER,
  total_tokens_used INTEGER,
  failure_rate      NUMERIC(5,4),
  throughput_per_hr NUMERIC(8,2),
  ai_provider       TEXT,
  model_used        TEXT,
  prompt_version    TEXT,
  metadata          JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pq_status           ON processing_queue (status);
CREATE INDEX IF NOT EXISTS idx_pq_scheduled        ON processing_queue (scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_pq_news_id          ON processing_queue (news_id);
CREATE INDEX IF NOT EXISTS idx_pq_retry            ON processing_queue (next_retry_at) WHERE status = 'retrying';
CREATE INDEX IF NOT EXISTS idx_pa_news_id          ON processed_articles (news_id);
CREATE INDEX IF NOT EXISTS idx_pa_semantic         ON processed_articles (semantic_group_id) WHERE semantic_group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pa_categories       ON processed_articles USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_pa_tags             ON processed_articles USING GIN (tags_primary);
CREATE INDEX IF NOT EXISTS idx_pa_keywords         ON processed_articles USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_pa_importance       ON processed_articles (importance_score DESC) WHERE importance_score IS NOT NULL;

CREATE TRIGGER pq_updated_at BEFORE UPDATE ON processing_queue     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pa_updated_at BEFORE UPDATE ON processed_articles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sg_updated_at BEFORE UPDATE ON semantic_groups      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
