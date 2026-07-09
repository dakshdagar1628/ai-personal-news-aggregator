export type SourceType   = 'rss' | 'api' | 'scraper' | 'youtube'
export type ReportStatus = 'draft' | 'generating' | 'ready' | 'failed'
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying' | 'skipped'

export interface Source {
  id: string; name: string; slug: string; type: SourceType; url: string
  is_active: boolean; check_interval_minutes: number; last_checked_at: string | null
  error_count: number; metadata: Record<string, unknown> | null
  created_at: string; updated_at: string
}

export interface Category {
  id: string; name: string; slug: string; description: string | null
  color: string | null; icon: string | null; is_active: boolean
  sort_order: number; created_at: string
}

export interface NewsItem {
  id: string; source_id: string; category_id: string | null
  title: string; url: string; url_hash: string
  content_raw: string | null; content_summary: string | null; author: string | null
  published_at: string | null; collected_at: string
  importance_score: number | null; tags: string[]
  is_processed: boolean; is_featured: boolean; is_duplicate: boolean
  duplicate_of: string | null; metadata: Record<string, unknown> | null
  created_at: string; updated_at: string
}

export interface ReportTopStory {
  news_id: string; title: string; url: string
  source_name: string; importance_score: number; summary: string
}

export interface DailyReport {
  id: string; report_date: string; title: string; summary: string | null
  top_stories: ReportTopStory[] | null; content_by_category: Record<string, ReportTopStory[]> | null
  total_items: number; processed_items: number; status: ReportStatus
  generated_at: string | null; generation_duration_ms: number | null
  ai_model_used: string | null; ai_tokens_used: number | null
  metadata: Record<string, unknown> | null; created_at: string; updated_at: string
}

export interface ProcessingQueueItem {
  id: string; news_id: string; status: ProcessingStatus; priority: number
  attempts: number; max_attempts: number; scheduled_at: string
  started_at: string | null; completed_at: string | null; failed_at: string | null
  next_retry_at: string | null; error_message: string | null; error_details: Record<string, unknown> | null
  processing_version: string; created_at: string; updated_at: string
}

export interface ProcessedArticle {
  id: string; news_id: string; summary_short: string | null; summary_medium: string | null
  summary_long: string | null; executive_summary: string | null; bullet_summary: Record<string, unknown> | null
  categories: string[]; primary_category: string | null; tags_primary: string[]
  tags_secondary: string[]; keywords: string[]; technologies: string[]; frameworks: string[]
  programming_languages: string[]; models: string[]; companies: string[]; apis: string[]
  importance_score: number | null; developer_score: number | null; learning_score: number | null
  business_score: number | null; urgency_score: number | null; innovation_score: number | null
  confidence_score: number | null; score_explanations: Record<string, unknown> | null
  recommended_action: string | null; action_explanation: string | null; action_details: Record<string, unknown> | null
  related_items: string[]; semantic_group_id: string | null; is_duplicate: boolean
  canonical_id: string | null; language: string | null; language_confidence: number | null
  processed_at: string; processing_version: string; prompt_version: string
  ai_provider: string; ai_model: string | null; tokens_used: number | null
  processing_time_ms: number | null; created_at: string; updated_at: string
}

export interface CollectorHealth {
  id: string; collector_id: string; collector_name: string; status: string
  is_enabled: boolean; last_run_at: string | null; last_success_at: string | null
  last_failure_at: string | null; last_run_duration_ms: number | null; avg_run_duration_ms: number | null
  total_runs: number; successful_runs: number; failed_runs: number
  total_items_collected: number; total_items_stored: number; total_duplicates: number
  total_validation_errors: number; last_error_message: string | null
  current_version: string; metadata: Record<string, unknown> | null; created_at: string; updated_at: string
}

export interface CollectorRun {
  id: string; collector_id: string; collector_name: string; source_slug: string
  run_id: string; started_at: string; finished_at: string | null; duration_ms: number | null
  status: string; items_fetched: number; items_validated: number; items_stored: number
  items_duplicate: number; items_skipped: number; store_failures: number; error_message: string | null
  version: string; metadata: Record<string, unknown> | null; created_at: string
}

// Joined
export interface NewsItemFull extends NewsItem { source: Source; category: Category | null }

// Insert shapes
export type SourceInsert   = Omit<Source,   'id' | 'created_at' | 'updated_at'>
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>
export type NewsItemInsert = Omit<NewsItem,  'id' | 'created_at' | 'updated_at'>

// Supabase Database type for createClient<Database>
export type Database = {
  public: {
    Tables: {
      sources:           { Row: Source;               Insert: SourceInsert;                                           Update: Partial<SourceInsert>;                                           Relationships: [] }
      categories:        { Row: Category;             Insert: CategoryInsert;                                         Update: Partial<CategoryInsert>;                                         Relationships: [] }
      news:              { Row: NewsItem;             Insert: NewsItemInsert;                                         Update: Partial<NewsItemInsert>;                                         Relationships: [] }
      daily_reports:     { Row: DailyReport;          Insert: Omit<DailyReport, 'id' | 'created_at' | 'updated_at'>;  Update: Partial<DailyReport>;                                            Relationships: [] }
      processing_queue:  { Row: ProcessingQueueItem;  Insert: Omit<ProcessingQueueItem, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ProcessingQueueItem>;                                  Relationships: [] }
      processed_articles: { Row: ProcessedArticle;     Insert: Omit<ProcessedArticle, 'id' | 'created_at' | 'updated_at'>;    Update: Partial<ProcessedArticle>;                                       Relationships: [] }
      collector_health:  { Row: CollectorHealth;      Insert: Omit<CollectorHealth, 'id' | 'created_at' | 'updated_at'>;     Update: Partial<CollectorHealth>;                                        Relationships: [] }
      collector_runs:    { Row: CollectorRun;         Insert: Omit<CollectorRun, 'id' | 'created_at'>;                 Update: Partial<CollectorRun>;                                           Relationships: [] }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
