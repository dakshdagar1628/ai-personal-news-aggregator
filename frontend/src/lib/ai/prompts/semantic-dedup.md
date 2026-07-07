---
version: "1.0.0"
name: semantic-dedup
maxTokens: 256
temperature: 0.1
---
Determine if these two articles cover the same event or announcement. Return JSON only.

Article A:
Title: {{title_a}}
Summary: {{summary_a}}
URL: {{url_a}}

Article B:
Title: {{title_b}}
Summary: {{summary_b}}
URL: {{url_b}}

Return:
{
  "is_duplicate": true,
  "confidence": 0.95,
  "reason": "one sentence explanation"
}
