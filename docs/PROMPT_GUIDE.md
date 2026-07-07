# Prompt Guide

## Format
Each prompt is a `.md` file with YAML frontmatter:
```
---
version: "1.0.0"
name: summarize
maxTokens: 1024
temperature: 0.2
---
Prompt body with {{variable}} placeholders
```

## Versioning
Bump `version` in frontmatter when changing a prompt. The processing engine records `prompt_version` on every processed article. This enables reprocessing historical data with the new prompt.

## Available Prompts
| File | Purpose | Key Output Fields |
|------|---------|-------------------|
| `summarize.md` | Multi-level summaries | summary_short/medium/long, executive, bullets |
| `categorize.md` | Category classification | primary_category, categories[] |
| `keywords.md` | Tag/keyword extraction | tags, keywords, technologies, models, companies |
| `importance.md` | Multi-dimension scoring | 7 scores + explanations |
| `recommendation.md` | Developer action advice | recommended_action, action_details |
| `semantic-dedup.md` | Cross-source duplicate detection | is_duplicate, confidence |
| `related.md` | Related article matching | related_ids[] |
| `language.md` | Language detection | language, confidence |

## Adding a Prompt
1. Create `src/lib/ai/prompts/{name}.md` with frontmatter + template
2. Create `src/lib/ai/services/{name}.service.ts` calling `renderPrompt(name, vars)`
3. Add the service call in `processing-orchestrator.service.ts`
