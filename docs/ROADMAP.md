# ROADMAP.md — AI Intelligence OS

## Phase 1 — Foundation ✅ (Current)
- [x] Folder structure
- [x] Architecture design
- [x] Database schema
- [x] TypeScript types
- [x] Documentation
- [x] Coding standards & git conventions
- [x] Environment config
- [x] Prompt templates

**Effort:** 1–2 days

---

## Phase 2 — Dashboard Shell
- [ ] Next.js 14 project init (App Router, TypeScript, Tailwind)
- [ ] shadcn/ui setup
- [ ] Root layout (sidebar + topbar)
- [ ] Routes: `/`, `/reports`, `/sources`, `/settings`
- [ ] Placeholder pages + loading skeletons
- [ ] Supabase client (browser + server)
- [ ] Error boundary + 404 page
- [ ] Deploy to Vercel (staging)

**Effort:** 3–4 days

---

## Phase 3 — Data Collectors
- [ ] n8n instance setup
- [ ] Hacker News collector (RSS)
- [ ] Reddit r/artificial + r/MachineLearning (RSS)
- [ ] OpenAI Blog (RSS)
- [ ] Anthropic Blog (RSS)
- [ ] Google AI Blog (RSS)
- [ ] GitHub Trending (scraper)
- [ ] GitHub Releases (API)
- [ ] Product Hunt (API)
- [ ] YouTube AI channels (API)
- [ ] Papers With Code (RSS)
- [ ] AI Tools collector
- [ ] MCP Servers (GitHub API)
- [ ] Claude Code / Antigravity updates
- [ ] Shared normalizer + deduplication
- [ ] Error handler on every workflow

**Effort:** 5–7 days

---

## Phase 4 — AI Processing
- [ ] AI processing n8n workflow
- [ ] Summarization (Claude API)
- [ ] Categorization
- [ ] Importance scoring (0.00–1.00)
- [ ] Tag extraction
- [ ] Batch processing (query `is_processed=false`)
- [ ] OpenAI fallback
- [ ] Token usage tracking

**Effort:** 3–4 days

---

## Phase 5 — Daily Reports
- [ ] Report generator workflow (cron 5:30am)
- [ ] Query last 24h processed news
- [ ] Claude daily digest generation
- [ ] `daily_reports` table population
- [ ] Report viewer `/reports/[date]`
- [ ] Today's report on homepage
- [ ] Failed report re-trigger

**Effort:** 3–4 days

---

## Phase 6 — Refinement & Deployment
- [ ] Vercel production deployment
- [ ] Custom domain
- [ ] Source health dashboard
- [ ] Performance optimization
- [ ] Error monitoring
- [ ] Final README

**Effort:** 2–3 days

---

## Future Phases (Post-MVP)

| Phase | Focus |
|---|---|
| 7 | Auth (Supabase Auth, RLS, multi-user) |
| 8 | Notifications (email digest, webhooks) |
| 9 | Social sources (X/Twitter, Instagram) |
| 10 | Advanced personalization |
| 11 | Mobile app |
| 12 | AI Chat (RAG over news via pgvector) |
| 13 | Weekly/monthly reports |
