# Scoring Guide

## Dimensions (all 0–100)

| Dimension | Description | 90+ Means |
|-----------|-------------|-----------|
| importance_score | Overall significance in the AI field | Landmark event (GPT-4 launch, major breakthrough) |
| developer_score | Direct relevance to software developers | New API, framework, tool developers use daily |
| learning_score | Educational value | Comprehensive tutorial, novel concept explained |
| business_score | Business/commercial impact | Raises/acquisitions, major product pivots |
| urgency_score | Time-sensitivity | Breaking news, 24h limited offers |
| innovation_score | Technical novelty | New technique, architecture, or capability |
| confidence_score | Model's confidence in all other scores | High = clear, unambiguous article |

## Interpretation
- 0–30: Low relevance — likely should_ignore
- 31–60: Medium — worth reading if topic interests you
- 61–80: High — relevant to most developers
- 81–100: Critical — read today

## Action Mapping
| Score Range | Primary Recommendation |
|-------------|----------------------|
| developer ≥ 75 AND urgency ≥ 60 | should_read (urgent) |
| learning ≥ 70 | should_learn |
| categories includes github-repo AND developer ≥ 65 | should_star |
| categories includes tool-launch AND developer ≥ 70 | should_install |
| All scores < 40 | should_ignore |
