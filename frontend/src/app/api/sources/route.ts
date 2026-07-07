import { NextRequest } from 'next/server'
import { sourcesService } from '@/lib/database/sources.service'
import { ok, created, fail } from '@/lib/api/response'

export async function GET(req: NextRequest) {
  try {
    const url  = new URL(req.url)
    const slug = url.searchParams.get('slug')
    const activeOnly = url.searchParams.get('active') === 'true'
    const data = await sourcesService.getSources(activeOnly)
    if (slug) {
      const src = data.find((s: { slug: string }) => s.slug === slug)
      return src ? ok(src) : ok(null, 'Source not found')
    }
    return ok(data)
  } catch (e) { return fail(e) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const src  = await sourcesService.createSource(body)
    return created(src, 'Source created')
  } catch (e) { return fail(e) }
}
