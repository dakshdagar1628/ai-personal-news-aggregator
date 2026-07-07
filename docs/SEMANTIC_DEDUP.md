# Semantic Duplicate Detection

## Problem
URL hashing (Phase 5) catches exact duplicates. Semantic dedup catches:
- Same announcement covered by OpenAI Blog + TechCrunch + Reddit + HN
- Same paper described in arXiv + Papers with Code + HF Papers
- Same tool launch on Product Hunt + GitHub + a blog post

## Approach
1. For each new article, fetch the 5 most recent processed articles with semantic_group_ids
2. Call `semantic-dedup.md` prompt for each pair
3. If confidence ≥ 0.8: assign same `semantic_group_id`
4. If no match: create new `semantic_groups` row, assign its ID

## Tables
- `semantic_groups(id, title, description, item_count, sources)`
- `processed_articles.semantic_group_id` — links stories in same group
- `processed_articles.is_duplicate` + `canonical_id` — marks non-canonical copies

## Limitations
- Compares against only 5 recent candidates (cost control)
- No vector embeddings — LLM-based comparison only
- Future: pgvector similarity search for better recall at scale
