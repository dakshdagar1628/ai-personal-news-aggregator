-- Migration 006: Add start_processing_job function to handle queue state transition and atomic increments
-- Run after 004_ai_processing.sql

CREATE OR REPLACE FUNCTION start_processing_job(p_news_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE processing_queue
  SET status = 'processing',
      started_at = NOW(),
      attempts = attempts + 1
  WHERE news_id = p_news_id AND status = 'pending';
END;
$$ LANGUAGE plpgsql;
