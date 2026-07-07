---
version: "1.0.0"
name: report-executive
maxTokens: 512
temperature: 0.3
---
Write a concise daily AI intelligence executive summary. Return JSON only.

Date: {{date}}
Articles Processed: {{article_count}}
Sources: {{source_count}}
Top Categories: {{top_categories}}
Top Stories: {{top_stories}}

Return:
{
  "headline": "One punchy sentence capturing today's biggest theme",
  "summary": "Executive summary under 200 words. Cover biggest developments, ecosystem state, key implications for developers.",
  "key_themes": ["theme1", "theme2", "theme3"],
  "estimated_read_min": 8
}
