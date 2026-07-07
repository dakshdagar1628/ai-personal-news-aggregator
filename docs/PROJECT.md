# Project Specification — AI Intelligence OS

> Version: 1.0 | Status: MVP Planning | Last Updated: 2026-07-06

---

## 1. Project Vision

AI Intelligence OS exists to eliminate information overload for AI professionals. The AI landscape moves faster than any individual can manually track — new models drop, papers publish, tools launch, and community conversations spike every single day across a fragmented ecosystem of blogs, feeds, forums, and video platforms.

**One dashboard to rule them all.** AI Intelligence OS is a personal command center that automatically monitors the AI universe on your behalf, curates what matters, and delivers a clean daily briefing — so you stay informed without sacrificing hours to feed-scrolling.

---

## 2. Problem Statement

Developers, researchers, and founders working in AI currently face a daily information tax:

- **15+ sources to check manually** — OpenAI blog, Anthropic releases, Google AI, arXiv, GitHub trending, Hacker News, Reddit r/MachineLearning, Product Hunt, YouTube channels, newsletters, and more
- **Hours wasted on repetitive browsing** — conservative estimate: 1–2 hours per day of tab-switching, scroll-checking, and context-switching just to stay current
- **Important updates missed** — without a systematic approach, critical announcements (new model releases, API changes, pivotal research) are easily lost in the noise
- **No unified signal** — every source has different formats, update frequencies, and signal-to-noise ratios; there is no single ranked view of "what matters today in AI"

The cost is compounded for solo practitioners and small teams who cannot afford a dedicated research function.

---

## 3. Solution

AI Intelligence OS addresses this with four integrated layers:

1. **Automated collection** — n8n workflows run on schedule, pulling from 15 sources via RSS, public APIs, and targeted scrapers. No manual browsing required.
2. **AI curation** — each collected item passes through Claude for summarization, category classification, and importance scoring. Low-signal noise is deprioritized; high-signal content surfaces to the top.
3. **Unified dashboard** — a fast Next.js frontend presents all curated content in one place, filterable by source, category, date range, and importance score.
4. **Daily digest** — every morning at 6am, an executive summary report is generated covering the previous 24 hours, with top stories, category breakdowns, and an AI-written overview — ready to read with your first coffee.

---

## 4. Target Users

| User Type | Description |
|---|---|
| **AI Engineers** | Software engineers building AI-powered products who need to track the model and tooling landscape |
| **AI Researchers** | Academics and industry researchers who need to stay current with publications and community discourse |
| **AI Founders** | Startup founders building in the AI space who need competitive intelligence and market signal |
| **AI Enthusiasts** | Technically engaged individuals who follow AI progress closely as a professional interest |

**MVP target:** A single user (the developer themselves). No authentication, no multi-tenancy, no personalization in v1.

---

## 5. MVP Scope

### Included in MVP

- **Dashboard** — Next.js 14 frontend with feed view, report viewer, source status page, and settings
- **Supabase backend** — PostgreSQL database with full schema for news items, sources, categories, tags, and daily reports
- **n8n automation** — self-hosted workflow engine running all collection, processing, and reporting jobs on schedule
- **15 source collectors** — one n8n workflow per source, covering blogs, RSS feeds, Reddit, HN, GitHub, Product Hunt, YouTube, and research papers
- **AI processing pipeline** — Claude-powered summarization, category classification, importance scoring (0.00–1.00), and tag extraction for every collected item
- **Daily digest reports** — automated morning report generation with executive summary, top stories, and category groupings
- **Deduplication** — URL hash-based dedup prevents duplicate items from multiple collection runs

### Excluded from MVP (Future)

- Instagram and X/Twitter collectors
- AI Chat interface ("ask about today's AI news")
- User authentication and multi-user support
- Mobile app
- Weekly and monthly rollup reports
- Advanced personalization (interest profiles, keyword filtering)
- Push notifications and email delivery
- Paid tiers or monetization

---

## 6. Success Metrics

| Metric | Target |
|---|---|
| Dashboard initial load time | < 2 seconds |
| Daily report generation | Completed by 6:00am daily |
| Duplicate item rate | < 5% of collected items |
| System uptime | > 95% |
| Source collection coverage | All 15 sources successfully polled each day |

---

## 7. Constraints

- **Solo developer** — all design, development, infrastructure, and maintenance is handled by one person; scope must be achievable without a team
- **MVP budget-conscious** — infrastructure choices favor free tiers and low-cost options (Supabase free, Vercel free, n8n self-hosted)
- **No authentication in MVP** — the system is built for a single user; adding auth is explicitly deferred to Phase 7
- **API rate limits** — Claude API, Reddit API, GitHub API, and Product Hunt API all impose rate limits that collection schedules and batch sizes must respect
- **n8n execution limits** — self-hosted n8n has no hard limits, but cloud plans cap executions; architecture must account for this if migrating

---

## 8. Assumptions

- All 15 targeted sources either publish an RSS/Atom feed or expose a publicly accessible API or scrapeable HTML structure
- The Claude API remains available and cost-effective at MVP scale (estimated < $5/month for summarization volume)
- Vercel's free tier is sufficient for the Next.js frontend at single-user traffic levels
- Supabase's free tier (500MB database, 2GB bandwidth) is sufficient for MVP data volume
- n8n can be self-hosted reliably for the duration of MVP development and initial use

---

## 9. Non-Goals

The following are explicitly out of scope and will not be considered during MVP design or implementation:

- **Social features** — no sharing, commenting, upvoting, or community interaction
- **User accounts** — no registration, login, or per-user data isolation
- **Ad revenue or monetization** — no advertising integrations, paywalls, or subscription infrastructure
- **Mobile-first design** — the dashboard is designed for desktop/laptop; responsive mobile support is a post-MVP concern
- **Real-time updates** — content is collected on a schedule (not a live stream); the dashboard reflects the last collection run

---

## 10. Glossary

| Term | Definition |
|---|---|
| **Collector** | An n8n workflow responsible for fetching raw content from a single source on a schedule and inserting normalized records into the database |
| **Normalizer** | The transformation step within a collector that maps source-specific data formats (RSS fields, API response shapes, scraped HTML) into the standard `news_items` schema |
| **Daily Report** | An auto-generated document summarizing the previous 24 hours of collected and processed AI news; produced every morning and stored in the `daily_reports` table |
| **Importance Score** | A floating-point value between 0.00 and 1.00 assigned by Claude to each news item, reflecting its estimated relevance and significance to an AI professional |
| **Source** | A tracked origin of AI content (e.g., "OpenAI Blog", "Hacker News", "arXiv"); defined as a row in the `sources` table with its collection configuration |
| **Category** | A high-level classification of a news item's subject matter (e.g., Models, Tools & Libraries, Research, Business & Industry, Community, Policy & Safety) |
| **Item / News Item** | A single collected piece of content (blog post, Reddit thread, GitHub repo, paper, video, etc.) stored as a row in the `news_items` table |
