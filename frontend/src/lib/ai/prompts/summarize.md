---
version: "1.0.0"
name: summarize
maxTokens: 1024
temperature: 0.2
---
You are a concise technical writer. Analyze the following article and return JSON only.

Article Title: {{title}}
Article URL: {{url}}
Author: {{author}}
Published: {{published_at}}
Content: {{content}}

Return exactly this JSON structure:
{
  "summary_short": "One clear sentence summarizing the core news. No hype.",
  "summary_medium": "Three sentences covering what happened, why it matters, and the key implication.",
  "summary_long": "A paragraph (4-6 sentences) for a developer audience. Include technical context.",
  "executive_summary": "Two sentences suitable for a non-technical executive.",
  "bullet_summary": ["Key point 1", "Key point 2", "Key point 3"]
}
