-- Migration 007: Add UNIQUE constraint to processing_queue(news_id)
-- Run after 006_start_processing_job.sql

BEGIN;

-- Clean up any historical duplicate entries in processing_queue (keeping the newest one)
DELETE FROM processing_queue a USING processing_queue b
WHERE a.id < b.id AND a.news_id = b.news_id;

-- Add the unique constraint
ALTER TABLE processing_queue
  ADD CONSTRAINT unique_pq_news_id UNIQUE (news_id);

COMMIT;
