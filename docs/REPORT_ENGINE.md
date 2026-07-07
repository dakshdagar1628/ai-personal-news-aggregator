# Daily Report Engine

## Architecture
```
processed_articles
  → report-generator.service.ts
      → event-grouper.service.ts     (semantic dedup → events)
      → ranking.service.ts            (multi-signal score)
      → section-builder.service.ts   (8 sections, pure logic)
      → AI prompts (executive, trends, learn)
  → daily_reports table
  → API: /api/reports/*
  → n8n: report-generator.json (8 PM trigger)
```

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/reporting/report-generator.service.ts` | Main orchestrator |
| `src/lib/reporting/section-builder.service.ts`  | Builds all 8 report sections |
| `src/lib/reporting/event-grouper.service.ts`    | Groups duplicates into events |
| `src/lib/reporting/ranking.service.ts`          | Weighted multi-signal ranking |
| `src/lib/reporting/types.ts`                    | All report TypeScript types |
| `src/lib/ai/prompts/report-*.md`               | Versioned AI prompts |

## Report Sections
1. Executive Summary (AI-generated)
2. Top Stories (ranked, max 10)
3. AI Company Updates (grouped by company)
4. GitHub Highlights (repos, MCP, agents)
5. Research Papers (simplified summaries)
6. Tutorials & Videos
7. Opportunities (free credits, betas)
8. Learn Today (AI-generated daily pick)
9. Action Center (urgency-ranked actions)
10. Trends (AI-generated)
11. Events (semantic group view)
12. Statistics

## Regeneration
`POST /api/reports/regenerate { "date": "YYYY-MM-DD" }`
Re-runs the full pipeline using stored processed_articles data. Raw collector data is never touched.

## Versioning
`REPORT_PROMPT_VERSION` in `report-generator.service.ts`. Bump when prompts change to track which version generated each report.
