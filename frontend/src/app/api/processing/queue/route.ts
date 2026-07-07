import { NextRequest } from 'next/server';
import { ok, created, fail } from '@/lib/api/response';
import { getPendingJobs, enqueueArticle, getQueueStats } from '@/lib/processing/queue.service';

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');
  if (action === 'stats') {
    try { return ok(await getQueueStats()); } catch (e) { return fail(e); }
  }
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10);
  try { return ok(await getPendingJobs(limit)); } catch (e) { return fail(e); }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { news_id?: string; priority?: number };
  if (!body.news_id) return fail(new Error('news_id required'));
  try {
    await enqueueArticle(body.news_id, body.priority ?? 5);
    return created({ news_id: body.news_id }, 'Enqueued');
  } catch (e) { return fail(e); }
}
