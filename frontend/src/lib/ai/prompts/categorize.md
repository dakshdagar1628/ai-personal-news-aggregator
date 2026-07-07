---
version: "1.0.0"
name: categorize
maxTokens: 256
temperature: 0.1
---
Classify the following article. Return JSON only.

Title: {{title}}
Summary: {{summary}}
URL: {{url}}

Available categories: ai-news, model-release, research-paper, github-repo, tool-launch, video, tutorial, blog-post, job-offer, free-credit, mcp-tool, claude-update, prompt-engineering, browser-automation, automation, agent-framework, open-source, company-news, product-launch, dataset, benchmark

Return:
{
  "primary_category": "single most accurate category",
  "categories": ["up to 3 categories in order of relevance"]
}
