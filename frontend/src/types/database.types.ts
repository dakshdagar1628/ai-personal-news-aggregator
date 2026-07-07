export type SourceType   = 'rss' | 'api' | 'scraper' | 'youtube'
export type ReportStatus = 'draft' | 'generating' | 'ready' | 'failed'

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
      sources:       { Row: Source;      Insert: SourceInsert;   Update: Partial<SourceInsert>   }
      categories:    { Row: Category;    Insert: CategoryInsert; Update: Partial<CategoryInsert> }
      news:          { Row: NewsItem;    Insert: NewsItemInsert; Update: Partial<NewsItemInsert> }
      daily_reports: { Row: DailyReport; Insert: Omit<DailyReport, 'id' | 'created_at' | 'updated_at'>; Update: Partial<DailyReport> }
    }
  }
}
