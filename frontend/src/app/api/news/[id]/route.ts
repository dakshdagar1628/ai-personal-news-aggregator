import { NextRequest } from 'next/server'
import { newsService } from '@/lib/database/news.service'
import { ok, fail } from '@/lib/api/response'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const { id } = await params
    const item = await newsService.getNewsById(id)
    return ok(item)
  } catch (e) { return fail(e) }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const { id } = await params
    const body = await req.json()
    const item = await newsService.updateNews(id, body)
    return ok(item, 'Updated')
  } catch (e) { return fail(e) }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const { id } = await params
    await newsService.deleteNews(id)
    return ok(null, 'Deleted')
  } catch (e) { return fail(e) }
}
