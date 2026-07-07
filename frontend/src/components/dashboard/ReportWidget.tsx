import Link from 'next/link'
import { FileText, ArrowRight, Sparkles } from 'lucide-react'

const MOCK_REPORT = {
  date: 'July 6, 2026',
  summary: 'A landmark day for frontier AI: Anthropic shipped Claude 4 with a 200K context window, OpenAI published the GPT-5 technical report, and Google DeepMind\'s Gemini Ultra 2 set a new MMLU record at 92.3%. Meanwhile, the developer tooling ecosystem accelerated with Cursor\'s $500M raise.',
  topStories: [
    'Claude 4 launches with 200K context and extended thinking mode',
    'GPT-5 technical report reveals training and safety methodology',
    'Gemini Ultra 2 sets new MMLU benchmark at 92.3%',
    'Cursor raises $500M at $9B valuation',
    'New zero-shot CoT paper matches GPT-4 performance',
  ],
  themes: ['Frontier model releases', 'Coding AI investment wave', 'Benchmark milestones'],
}

export function ReportWidget() {
  return (
    <section className="space-y-3">
      <SectionHeader />
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-3">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Daily AI Digest</p>
            <p className="text-xs text-muted-foreground">{MOCK_REPORT.date} · Generated at 5:30am</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <Sparkles size={12} /> Ready
          </div>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{MOCK_REPORT.summary}</p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Top Stories</p>
            <ol className="space-y-1.5">
              {MOCK_REPORT.topStories.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="shrink-0 w-4 text-xs text-muted-foreground font-mono mt-0.5">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex flex-wrap gap-1.5">
              {MOCK_REPORT.themes.map(t => (
                <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{t}</span>
              ))}
            </div>
            <Link href="/reports" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              Full report <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHeader() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="rounded-lg bg-primary/10 p-1.5"><FileText className="h-4 w-4 text-primary" /></div>
      <div>
        <h2 className="font-semibold text-sm">Daily Report</h2>
        <p className="text-xs text-muted-foreground">AI-generated morning digest</p>
      </div>
    </div>
  )
}
