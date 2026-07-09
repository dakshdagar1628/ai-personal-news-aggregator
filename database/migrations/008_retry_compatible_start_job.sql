-- Migration 008: Update start_processing_job to support 'retrying' status
-- Run after 007_processing_queue_unique.sql

BEGIN;

CREATE OR REPLACE FUNCTION start_processing_job(p_news_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE processing_queue
  SET status = 'processing',
      started_at = NOW(),
      attempts = attempts + 1
  WHERE news_id = p_news_id AND status IN ('pending', 'retrying');
END;
$$ LANGUAGE plpgsql;

COMMIT;
