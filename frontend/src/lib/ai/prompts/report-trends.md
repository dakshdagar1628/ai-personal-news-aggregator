---
version: "1.0.0"
name: report-trends
maxTokens: 512
temperature: 0.3
---
Analyze today's AI intelligence data and identify trends. Return JSON only.

Date: {{date}}
Categories distribution: {{categories}}
Top tags: {{tags}}
Top companies: {{companies}}
Top models: {{models}}
Top technologies: {{technologies}}

Return:
{
  "most_discussed": ["tech/topic with brief note"],
  "fastest_growing": ["topic with brief note"],
  "emerging": ["new thing with brief note"],
  "developer_trends": ["actionable trend"],
  "summary": "2 sentence trend summary"
}
