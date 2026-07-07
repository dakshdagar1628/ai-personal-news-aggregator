import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/response';
import { requeueFailed } from '@/lib/processing/queue.service';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { news_id?: string };
  try {
    const count = await requeueFailed(body.news_id);
    return ok({ requeued: count }, `${count} job(s) requeued`);
  } catch (e) { return fail(e); }
}
