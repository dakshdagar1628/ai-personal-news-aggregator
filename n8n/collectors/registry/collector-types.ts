export type FetchType = 'rss' | 'github-releases' | 'github-search' | 'reddit' | 'hn' | 'graphql' | 'youtube' | 'http';
export type ScheduleKey = 'high' | 'medium' | 'low' | 'daily';
export type Priority = 'high' | 'medium' | 'low';
export type CollectorGroup = 'ai-companies' | 'github' | 'research' | 'communities' | 'product' | 'learning' | 'opportunities';

export interface CollectorDefinition {
  id:           string;
  name:         string;
  slug:         string;
  group:        CollectorGroup;
  fetchType:    FetchType;
  fetchUrl:     string;
  scheduleKey:  ScheduleKey;
  priority:     Priority;
  categoryHint: string;
  enabled:      boolean;
  requiresAuth: boolean;
  authEnvKey:   string | null;
  tags:         string[];
  description:  string;
}

export interface CollectorRegistry {
  version:    string;
  schedules:  Record<ScheduleKey, string>;
  collectors: CollectorDefinition[];
}

export interface CollectorHealth {
  collector_id:            string;
  collector_name:          string;
  status:                  'idle' | 'running' | 'success' | 'failed' | 'partial';
  is_enabled:              boolean;
  last_run_at:             string | null;
  last_success_at:         string | null;
  last_failure_at:         string | null;
  last_run_duration_ms:    number | null;
  avg_run_duration_ms:     number | null;
  total_runs:              number;
  successful_runs:         number;
  failed_runs:             number;
  total_items_collected:   number;
  total_items_stored:      number;
  total_duplicates:        number;
  total_validation_errors: number;
  last_error_message:      string | null;
  current_version:         string;
  metadata:                Record<string, unknown>;
}

export interface CollectorRunReport {
  collector_id:     string;
  collector_name:   string;
  source_slug:      string;
  run_id:           string;
  started_at:       string;
  finished_at:      string;
  duration_ms:      number;
  status:           'success' | 'partial' | 'failed';
  items_fetched:    number;
  items_validated:  number;
  items_stored:     number;
  items_duplicate:  number;
  items_skipped:    number;
  store_failures:   number;
  error_message?:   string;
  version:          string;
}
