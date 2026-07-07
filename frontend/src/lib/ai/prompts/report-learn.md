---
version: "1.0.0"
name: report-learn
maxTokens: 384
temperature: 0.3
---
Generate a daily learning recommendation based on today's AI intelligence. Return JSON only.

Top technologies today: {{technologies}}
Top categories: {{categories}}
Highest learning-score article: {{top_learning_article}}

Return:
{
  "topic": "specific topic to learn today",
  "reason": "why this matters right now (1-2 sentences)",
  "estimated_hours": 2,
  "difficulty": "beginner | intermediate | advanced",
  "resources": ["resource description 1", "resource description 2"],
  "priority": "high | medium | low"
}
