---
version: "1.0.0"
name: related
maxTokens: 512
temperature: 0.1
---
Given this article and a list of existing articles, identify the most related ones. Return JSON only.

Target Article:
Title: {{title}}
Summary: {{summary}}
Tags: {{tags}}
Categories: {{categories}}

Existing Articles (id, title, summary):
{{candidates}}

Return up to 5 most relevant:
{
  "related_ids": ["uuid1", "uuid2"],
  "reasoning": "one sentence"
}
