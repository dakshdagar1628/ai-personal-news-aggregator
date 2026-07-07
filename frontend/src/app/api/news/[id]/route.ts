import { NextRequest } from 'next/server'
import { newsService } from '@/lib/database/news.service'
import { ok, fail } from '@/lib/api/response'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await newsService.getNewsById(params.id)
    return ok(item)
  } catch (e) { return fail(e) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const item = await newsService.updateNews(params.id, body)
    return ok(item, 'Updated')
  } catch (e) { return fail(e) }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await newsService.deleteNews(params.id)
    return ok(null, 'Deleted')
  } catch (e) { return fail(e) }
}
