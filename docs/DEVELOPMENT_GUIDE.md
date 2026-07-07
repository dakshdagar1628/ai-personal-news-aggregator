# AI Intelligence OS — Development Guide

> This document is the single source of truth for how we build, commit, and collaborate on this project.
> All contributors must follow these standards.

---

## Table of Contents

1. [Coding Standards](#1-coding-standards)
2. [Git Conventions](#2-git-conventions)
3. [Development Rules](#3-development-rules)
4. [n8n Workflow Standards](#4-n8n-workflow-standards)
5. [Prompt Engineering Standards](#5-prompt-engineering-standards)
6. [Environment Setup](#6-environment-setup)
7. [MVP Scope](#7-mvp-scope)

---

## 1. Coding Standards

### Folder & File Naming

| Context | Convention | Example |
|---|---|---|
| Folders | kebab-case | `daily-reports/`, `source-health/` |
| React components | PascalCase `.tsx` | `NewsCard.tsx`, `DailyReportViewer.tsx` |
| Utility / lib files | camelCase `.ts` | `supabaseClient.ts`, `formatDate.ts` |
| Type files | camelCase + `.types.ts` | `news.types.ts`, `api.types.ts` |
| Hook files | camelCase + `use` prefix | `useNews.ts`, `useDailyReport.ts` |
| n8n workflow files | kebab-case + `-workflow.json` | `hacker-news-workflow.json` |

### Component Naming

| Component Type | Convention | Example |
|---|---|---|
| Page components | PascalCase + `Page` suffix | `DashboardPage`, `ReportPage` |
| Layout components | PascalCase + `Layout` suffix | `DashboardLayout`, `SidebarLayout` |
| UI components | PascalCase | `NewsCard`, `CategoryBadge`, `ImportanceBar` |

- **Server components by default.** Only add `"use client"` when the component uses browser APIs, event handlers, or React hooks that require it.
- Keep client components as leaf nodes — push interactivity down the tree, not up.

### Database Naming

| Object | Convention | Example |
|---|---|---|
| Tables | snake_case, plural | `news`, `daily_reports`, `sources` |
| Columns | snake_case | `source_id`, `published_at`, `url_hash` |
| Indexes | `idx_{table}_{column}` | `idx_news_url_hash`, `idx_news_published_at` |
| Functions | snake_case verb phrase | `update_updated_at()`, `deduplicate_news()` |
| Views | snake_case, plural | `news_with_sources`, `daily_report_summaries` |
| Foreign keys | `fk_{table}_{referenced_table}` | `fk_news_sources` |

### TypeScript Rules

- **Strict mode always enabled.** No exceptions.
- **No `any`.** Use `unknown` with type narrowing, or define a proper type. If you find yourself writing `any`, stop and model the type correctly.
- All database table types defined in `src/types/database.types.ts` — generated from Supabase or maintained manually.
- All API response types defined in `src/types/api.types.ts`.
- Use `interface` for object shapes that can be extended.
- Use `type` for unions, intersections, and aliases.
- Always annotate function return types explicitly — don't rely on inference at the boundary.
- Use `zod` for runtime validation of all external data (API responses, env vars, user input).

```typescript
// Bad
async function fetchNews(id: any): Promise<any> { ... }

// Good
async function fetchNews(id: string): Promise<NewsItem> { ... }
```

### Code Formatting

- **Prettier** — enforced via pre-commit hook:
  - Single quotes
  - 2-space indent
  - Trailing commas: `es5`
  - 100-character line limit
  - Semicolons: `true`
- **ESLint** — Next.js recommended + TypeScript strict rules
- All files must end with a single newline character

Run formatting before committing:
```bash
npm run lint
npm run format
```

---

## 2. Git Conventions

### Commit Format — Conventional Commits

```
<type>(<scope>): <short description>

[optional body — explain the WHY, not the WHAT]

[optional footer — breaking changes, issue refs]
```

#### Types

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code change that is neither a fix nor a feature |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependencies, tooling |
| `ci` | CI/CD pipeline changes |

#### Scopes

| Scope | Area |
|---|---|
| `frontend` | Next.js app, components, pages |
| `database` | Supabase schema, migrations, RLS |
| `n8n` | Workflow files, collector logic |
| `docs` | Any documentation |
| `config` | Project configuration files |
| `prompts` | AI prompt files |

#### Examples

```
feat(frontend): add NewsCard component with importance bar
feat(n8n): add Hacker News collector workflow
fix(database): correct url_hash index to prevent collision
docs(readme): update installation steps for Supabase v2
chore(config): add prettier config and pre-commit hook
refactor(frontend): extract category badge into shared component
test(database): add migration rollback tests
```

### Branch Naming

| Purpose | Pattern | Example |
|---|---|---|
| Feature | `feature/<scope>/<short-description>` | `feature/frontend/news-card` |
| Fix | `fix/<scope>/<short-description>` | `fix/database/url-hash-collision` |
| Documentation | `docs/<description>` | `docs/architecture` |
| Chore / tooling | `chore/<description>` | `chore/deps-update` |
| Release | `release/v<major>.<minor>.<patch>` | `release/v1.0.0` |

### Branch Rules

- **`main`** — production only. Protected. No direct commits. Merges via PR with review.
- **`develop`** — integration branch. All feature branches merge here first. CI runs on every push.
- **Never commit directly to `main`.**
- One feature per branch — keep PRs small and reviewable.
- Delete branch after merge.
- Rebase on `develop` before opening a PR to avoid merge conflicts.

### Pull Request Checklist

Before marking a PR ready for review:
- [ ] Branch is rebased on latest `develop`
- [ ] All linting passes (`npm run lint`)
- [ ] All types check (`npm run type-check`)
- [ ] Any new env vars are added to `.env.example`
- [ ] Documentation updated if feature-facing
- [ ] n8n workflows exported to `n8n/workflows/` if changed
- [ ] Migrations are additive only

---

## 3. Development Rules

These rules exist to keep the codebase predictable, debuggable, and maintainable as the project scales.

### Architecture Rules

| Rule | Rationale |
|---|---|
| **One feature per branch** | Keeps PRs focused and reviewable. Large PRs hide bugs. |
| **One collector per n8n workflow** | Isolates failures. A broken Reddit collector won't take down GitHub. |
| **Every collector normalizes to standard schema before writing to DB** | Consistency. Downstream components only need to understand one shape. |
| **No duplicated business logic** | DRY. Share via `src/lib/`. If you write it twice, extract it. |
| **AI processing runs after collection, never inline** | Separation of concerns. Collection is fast and cheap; AI processing is slow and expensive — decouple them. |

### Reliability Rules

| Rule | Rationale |
|---|---|
| **Every workflow must include error handling + alerting** | Silent failures are the worst kind. Know when something breaks. |
| **Every database operation must include validation** | Data integrity. Garbage in, garbage out. Use zod before every insert. |
| **url_hash deduplication must run before every news insert** | No duplicates in the DB, ever. This is the last line of defense. |
| **All dates stored as UTC** | Timezone-safe. Convert to local time only at display layer. |
| **All SQL migrations are additive only — never destructive in production** | You can always add. You can rarely safely remove. If you need to remove a column, deprecate it first. |

### Security Rules

| Rule | Rationale |
|---|---|
| **Never store API keys in code** | Use `.env.local` and environment variables only. Keys in code end up in git history. |
| **Never commit `.env.local`** | It contains secrets. The `.gitignore` enforces this but don't override it. |
| **Use Supabase RLS on all tables** | Row-level security is the last line of defense for data access. |

### Maintainability Rules

| Rule | Rationale |
|---|---|
| **Every new feature must include a documentation update** | Code without docs is a time bomb. Future-you will not remember. |
| **Components must not fetch data directly — use hooks** | Separation of concerns. UI should not know about Supabase. |
| **Prompts live in `prompts/` as `.md` files** | Version-controlled, reviewable, and easy to iterate. |

---

## 4. n8n Workflow Standards

### Workflow Structure

Every n8n workflow must follow this structure:

1. **README node** (sticky note, top of canvas) — explains:
   - Purpose: what this workflow does
   - Trigger: schedule, webhook, or manual
   - Inputs: what it expects
   - Outputs: what it writes to the DB
   - Error behavior: what happens on failure

2. **Trigger node** — Schedule Trigger or Webhook

3. **Fetch node(s)** — HTTP Request or service node

4. **Transform / normalize node** — Code node that maps raw data to standard `NewsItem` schema

5. **Deduplicate node** — check `url_hash` against Supabase before insert

6. **Insert node** — Supabase upsert

7. **Error Handler node** (last node, connected to all nodes via error branch)

### Credential Naming

Credential names follow the pattern: `{Service} - Production`

```
Supabase - Production
Anthropic - Production
Reddit - Production
GitHub - Production
YouTube - Production
```

### File Conventions

- Workflows export to `n8n/workflows/` as JSON files
- Naming: `{source-slug}-collector.json` or `{process-name}-processor.json`
- Examples: `hacker-news-collector.json`, `daily-report-generator.json`, `reddit-collector.json`
- Always export after modifying a workflow — the JSON file is the source of truth in version control

### Standard NewsItem Schema

All collectors must normalize to this shape before inserting:

```typescript
{
  title: string;            // Original title, trimmed
  url: string;              // Canonical URL
  url_hash: string;         // SHA-256 of normalized URL
  source_id: string;        // UUID of the source record
  published_at: string;     // ISO 8601 UTC
  author: string | null;
  summary: string | null;   // Raw excerpt or null — AI summary added later
  score: number | null;     // Source-native score (upvotes, stars, etc.)
  category_hints: string[]; // Raw tags from source, before AI categorization
  raw_data: object;         // Full original payload for debugging
}
```

---

## 5. Prompt Engineering Standards

### File Organization

All prompts live in the `prompts/` directory as Markdown files:

```
prompts/
  news-categorizer.md
  importance-scorer.md
  daily-report-generator.md
  executive-summary.md
```

### Prompt File Structure

Every prompt file must include these sections:

```markdown
# Prompt: {Name}

## Purpose
One sentence describing what this prompt does.

## Input Variables
| Variable | Type | Description |
|---|---|---|
| `{{title}}` | string | Article title |
| `{{content}}` | string | Article body or summary |

## Output Format
JSON object with fields: ...

## Temperature
0.3 — low for structured extraction, higher for creative summaries

## Example

### Input
<title>OpenAI releases GPT-5</title>
<content>...</content>

### Output
{ "category": "AI/ML", "importance": 8 }

## Prompt

[Actual prompt text here]
```

### Prompt Writing Rules

- Use XML tags for variable injection: `<title>{{title}}</title>`
- Always specify output format explicitly — never leave it to the model to decide
- When structured data is needed, specify JSON with exact field names and types
- Document temperature setting per prompt and why
- Test prompts with edge cases: empty content, non-English text, very long text
- Version prompts in git like code — changes to prompts are changes to behavior

---

## 6. Environment Setup

### Prerequisites

- Node.js 20+ (`node --version` to check)
- npm 10+ or pnpm 8+
- Git
- Docker (for local n8n) or n8n.cloud account
- Supabase account (free tier is sufficient for dev)

### Step-by-Step Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/ai-intelligence-os.git
cd ai-intelligence-os
```

**2. Install Node.js dependencies**
```bash
cd frontend
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env.local
# Open .env.local and fill in all required values
```

**4. Create a Supabase project**
- Go to supabase.com and create a new project
- Copy your project URL and anon key into `.env.local`
- Copy your service role key (Settings → API)
- Copy your direct DB connection string (Settings → Database)

**5. Run database migrations**
- Open the Supabase SQL Editor
- Run each file in `database/migrations/` in order (by filename prefix number)
- Example: `001_initial_schema.sql`, `002_add_indexes.sql`

**6. Run seed data**
- In the Supabase SQL Editor, run `database/seeds/01_sources.sql`
- This populates the `sources` table with all configured collectors

**7. Verify environment variables are set**
```bash
cat .env.local | grep -v "^#" | grep -v "^$"
```

**8. Start the development server**
```bash
npm run dev
# App available at http://localhost:3000
```

**9. Set up n8n**

Option A — Docker (recommended for local dev):
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
# n8n available at http://localhost:5678
```

Option B — n8n.cloud:
- Create account at n8n.cloud
- Update `N8N_BASE_URL` in `.env.local`

**10. Import n8n workflows**
- Open n8n at `http://localhost:5678`
- Go to Workflows → Import from File
- Import each JSON from `n8n/workflows/`
- Add credentials for each service (see credential naming convention above)

**11. Test the pipeline**
- Manually trigger one collector workflow in n8n
- Check the `news` table in Supabase to confirm records appear
- Open the frontend and verify articles display

---

## 7. MVP Scope

The MVP covers Phase 1–3 of the project roadmap. The goal is a working personal news aggregator with AI-powered daily reports, not a polished product.

| Feature | In MVP? | Notes |
|---|---|---|
| Hacker News collector | Yes | Primary dev/tech source |
| Reddit collector | Yes | r/MachineLearning, r/LocalLLaMA, r/programming |
| GitHub Trending collector | Yes | Track trending repos |
| Product Hunt collector | Yes | Daily new products |
| YouTube collector | No | Phase 4 — needs transcript processing |
| Twitter/X collector | No | Phase 5 — API costs + complexity |
| Daily report generation (Claude) | Yes | Core AI feature |
| Importance scoring (1–10) | Yes | Core AI feature |
| Category classification | Yes | Core AI feature |
| News feed UI | Yes | Basic list view |
| Daily report viewer | Yes | Read-only report page |
| Source health dashboard | No | Phase 4 — operational tooling |
| User authentication | No | Single-user tool — no auth needed in MVP |
| Multi-user support | No | Out of scope |
| Email digest | No | Phase 7 |
| Mobile app | No | Out of scope |
| Search | No | Phase 4 — post-MVP |
| Custom feed filters | No | Phase 4 |
| AI chat with news | No | Phase 6 |
| n8n webhook triggers | No | MVP uses scheduled polling only |
| Dark mode | Yes | Tailwind built-in, trivial to add |
| Pagination | Yes | Required for usability |
| Loading states / skeletons | Yes | Required for UX |
| Error boundaries | Yes | Required for reliability |
| Supabase RLS | Yes | Security baseline |
| Vercel deployment | Yes | MVP is deployed, not just local |
| Custom domain | No | Post-MVP |
| Analytics | No | Phase 4 |
| Automated tests | No | Phase 4 — fast iteration in MVP |

> **MVP success criteria:** At least 3 collectors running, daily report generating automatically, and the UI showing today's report and a news feed. Everything else is post-MVP.
