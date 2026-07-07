# AI Intelligence OS

**Your personal AI-powered command center for the AI universe.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

---

## What is this?

AI Intelligence OS eliminates the need to browse dozens of AI websites daily. Instead of manually checking OpenAI's blog, Anthropic's releases, Google AI updates, GitHub trending repos, Reddit threads, Hacker News discussions, Product Hunt launches, YouTube videos, and research papers — this system does it for you, automatically, every day.

The platform collects content from 15+ sources, deduplicates it, runs it through Claude to generate summaries, assigns importance scores, applies category tags, and surfaces everything in a clean unified dashboard. Each morning a daily digest report is generated so you can start your day with a curated briefing on everything that matters in AI — without the noise.

---

## Features

- **Multi-source collection** — RSS feeds, APIs, and scrapers covering 15+ top AI sources
- **AI summarization** — Claude-powered concise summaries for every item
- **Importance scoring** — 0.00–1.00 relevance score so the best content rises to the top
- **Category tagging** — automatic classification (Models, Tools, Research, Business, Community, etc.)
- **Daily digest reports** — executive summary generated every morning at 6am
- **Modern dashboard** — clean Next.js 14 UI with sidebar navigation and live data
- **Deduplication** — URL hash-based dedup prevents the same story appearing multiple times
- **Source health monitoring** — tracks error rates and last-checked timestamps per source

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend Automation** | n8n (self-hosted workflow engine) |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Claude API by Anthropic |
| **Hosting** | Vercel |

---

## Project Structure

```
ai-intelligence-os/
│
├── frontend/                   # Next.js 14 application
│   ├── app/                    # App Router pages and layouts
│   │   ├── (dashboard)/        # Dashboard route group
│   │   │   ├── page.tsx        # Main feed page (/)
│   │   │   ├── reports/        # Daily digest report viewer
│   │   │   ├── sources/        # Source health and management
│   │   │   └── settings/       # App configuration UI
│   │   ├── layout.tsx          # Root layout with sidebar
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/             # Sidebar, Topbar, Shell
│   │   ├── feed/               # NewsCard, FeedList, Filters
│   │   └── reports/            # ReportViewer, ReportCard
│   ├── lib/                    # Utilities and clients
│   │   ├── supabase.ts         # Supabase client initialization
│   │   ├── types.ts            # TypeScript types from DB schema
│   │   └── utils.ts            # Shared helper functions
│   ├── public/                 # Static assets
│   ├── .env.local              # Local environment variables (git-ignored)
│   ├── .env.example            # Example env file for onboarding
│   └── package.json
│
├── n8n/                        # n8n workflow definitions (exported JSON)
│   ├── collectors/             # One workflow file per data source
│   │   ├── openai-blog.json
│   │   ├── anthropic-blog.json
│   │   ├── google-ai.json
│   │   ├── reddit-machinelearning.json
│   │   ├── hackernews.json
│   │   ├── github-trending.json
│   │   ├── product-hunt.json
│   │   └── ...                 # (15 total)
│   ├── processing/             # AI processing workflows
│   │   ├── summarizer.json
│   │   ├── categorizer.json
│   │   └── scorer.json
│   └── reports/                # Report generation workflows
│       └── daily-digest.json
│
├── supabase/                   # Database layer
│   ├── schema.sql              # Full database schema
│   ├── migrations/             # Schema migration files
│   └── seed.sql                # Seed data for sources table
│
├── docs/                       # Project documentation
│   ├── PROJECT.md              # Vision, scope, constraints, glossary
│   ├── ROADMAP.md              # Phased development plan
│   ├── ARCHITECTURE.md         # System design and data flow
│   ├── DATABASE.md             # Schema reference and ER diagram
│   ├── N8N_WORKFLOWS.md        # Workflow setup and configuration guide
│   └── SOURCES.md              # All 15 sources with config details
│
├── .gitignore
├── LICENSE
└── README.md                   # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18.17+ and npm
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic API key](https://console.anthropic.com)
- n8n (self-hosted or cloud)
- A [Vercel](https://vercel.com) account (for deployment)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-intelligence-os.git
cd ai-intelligence-os

# 2. Navigate to the frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local

# 5. Fill in your values in .env.local (see Environment Variables below)

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `ANTHROPIC_API_KEY` | Claude API key for AI processing |
| `N8N_WEBHOOK_SECRET` | Shared secret for securing n8n webhook calls |
| `NEXT_PUBLIC_APP_URL` | Public URL of your deployed app |

---

## Documentation

- [PROJECT.md](docs/PROJECT.md) — Vision, problem statement, MVP scope, constraints, and glossary
- [ROADMAP.md](docs/ROADMAP.md) — Phased development plan with milestones and checklists
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design, component diagram, and data flow
- [DATABASE.md](docs/DATABASE.md) — Full schema reference and entity relationships
- [N8N_WORKFLOWS.md](docs/N8N_WORKFLOWS.md) — Workflow setup, configuration, and deployment guide
- [SOURCES.md](docs/SOURCES.md) — All 15 data sources with RSS URLs, API docs, and config details

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Foundation — structure, schema, docs | In Progress |
| Phase 2 | Dashboard Shell | Planned |
| Phase 3 | Data Collectors (15 sources) | Planned |
| Phase 4 | AI Processing | Planned |
| Phase 5 | Daily Reports | Planned |
| Phase 6 | Refinement & Deployment | Planned |

See the full [ROADMAP.md](docs/ROADMAP.md) for detailed milestones and future phases.

---

## Contributing

This project is currently in solo MVP development. Contributions, suggestions, and issue reports are welcome once the v1.0 foundation is stable. Please open an issue to discuss any significant changes before submitting a pull request.

---

## License

MIT License — see [LICENSE](LICENSE) for details.
