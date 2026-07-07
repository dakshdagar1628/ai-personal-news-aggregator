import Link from 'next/link'
import { Github, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { RepoCard } from '@/components/cards/RepoCard'
import { MOCK_REPOS } from '@/data/mock/repos'

export function GitHubWidget() {
  return (
    <section className="space-y-3">
      <SectionHeader
        icon={Github}
        title="Trending on GitHub"
        description="Most starred AI repos today"
        action={
          <Link href="/github" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_REPOS.slice(0, 3).map(r => <RepoCard key={r.id} repo={r} />)}
      </div>
    </section>
  )
}
