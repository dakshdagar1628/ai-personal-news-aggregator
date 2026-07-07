---
version: "1.0.0"
name: keywords
maxTokens: 512
temperature: 0.1
---
Extract structured metadata from this article. Return JSON only.

Title: {{title}}
Summary: {{summary}}
Content: {{content}}

Return:
{
  "tags_primary": ["3-5 main topic tags, kebab-case"],
  "tags_secondary": ["up to 8 secondary tags"],
  "keywords": ["up to 10 important keywords"],
  "technologies": ["tech stack items mentioned"],
  "frameworks": ["frameworks mentioned"],
  "programming_languages": ["languages mentioned"],
  "models": ["AI models mentioned e.g. GPT-4, Claude 3"],
  "companies": ["company names"],
  "apis": ["API names mentioned"]
}
