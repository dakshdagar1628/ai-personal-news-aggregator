export interface ReportStory {
  news_id:          string;
  title:            string;
  url:              string;
  summary:          string;
  importance_score: number;
  developer_score:  number;
  source:           string;
  category:         string;
  why_it_matters:   string;
  recommended_action: string;
  estimated_read_min: number;
  related_ids:      string[];
}

export interface ReportEvent {
  id:               string;
  title:            string;
  description:      string;
  primary_category: string;
  importance:       number;
  news_ids:         string[];
  source_count:     number;
  sources:          string[];
}

export interface CompanyUpdate {
  company:    string;
  updates:    ReportStory[];
  summary:    string;
}

export interface GitHubItem {
  news_id:     string;
  title:       string;
  url:         string;
  summary:     string;
  stars?:      number;
  language?:   string;
  reason:      string;
  recommendation: string;
  subcategory: string;
}

export interface ResearchPaper {
  news_id:      string;
  title:        string;
  url:          string;
  main_idea:    string;
  why_matters:  string;
  difficulty:   string;
  should_read:  boolean;
  topics:       string[];
}

export interface Opportunity {
  news_id:      string;
  title:        string;
  url:          string;
  type:         string;
  description:  string;
  expires_at?:  string;
  value:        string;
}

export interface ReportStatistics {
  articles_processed: number;
  sources_count:      number;
  repositories:       number;
  research_papers:    number;
  tools:              number;
  opportunities:      number;
  avg_importance:     number;
  avg_confidence:     number;
  processing_time_ms: number;
  top_categories:     { category: string; count: number }[];
  top_companies:      string[];
  top_technologies:   string[];
}

export interface DailyReport {
  id:                  string;
  report_date:         string;
  version:             number;
  status:              string;
  headline:            string;
  summary:             string;
  key_themes:          string[];
  estimated_read_min:  number;
  top_stories:         ReportStory[];
  ai_company_updates:  CompanyUpdate[];
  github_highlights:   GitHubItem[];
  tools:               ReportStory[];
  research_papers:     ResearchPaper[];
  tutorials:           ReportStory[];
  opportunities:       Opportunity[];
  learn_today:         Record<string, unknown>;
  action_center:       ReportStory[];
  trends:              Record<string, unknown>;
  events:              ReportEvent[];
  statistics:          ReportStatistics;
  prompt_version:      string;
  generated_at:        string;
}
