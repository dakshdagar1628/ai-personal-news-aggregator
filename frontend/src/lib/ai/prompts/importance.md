---
version: "1.0.0"
name: importance
maxTokens: 512
temperature: 0.1
---
Score this article for a software developer audience. Return JSON only.

Title: {{title}}
Category: {{primary_category}}
Summary: {{summary}}
Source: {{source_slug}}

Score each dimension 0-100. Be conservative — reserve 90+ for genuinely landmark events.

Return:
{
  "importance_score": 0,
  "developer_score": 0,
  "learning_score": 0,
  "business_score": 0,
  "urgency_score": 0,
  "innovation_score": 0,
  "confidence_score": 0,
  "score_explanations": {
    "importance": "one sentence",
    "developer": "one sentence",
    "learning": "one sentence",
    "business": "one sentence",
    "urgency": "one sentence",
    "innovation": "one sentence",
    "confidence": "one sentence"
  }
}
