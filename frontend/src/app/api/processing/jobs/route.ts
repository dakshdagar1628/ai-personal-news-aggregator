import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/response';
import { processArticle } from '@/lib/processing/processing-orchestrator.service';
import { getPendingJobs, getRetryJobs } from '@/lib/processing/queue.service';

// GET /api/processing/jobs?batch=5  — process next N pending jobs
export async function GET(req: NextRequest) {
  const batch = Math.min(parseInt(req.nextUrl.searchParams.get('batch') ?? '1', 10), 10);
  try {
    const [pending, retry] = await Promise.all([getPendingJobs(batch), getRetryJobs(batch)]);
    const jobs = [...retry, ...pending].slice(0, batch);
    if (!jobs.length) return ok([], 'No pending jobs');
    const results = await Promise.allSettled(
      jobs.map(j => processArticle(j.news_id as string))
    );
    return ok(results.map((r, i) => ({
      news_id: jobs[i].news_id,
      status: r.status,
      value: r.status === 'fulfilled' ? r.value : null,
      reason: r.status === 'rejected' ? String(r.reason) : null,
    })));
  } catch (e) { return fail(e); }
}

// POST /api/processing/jobs  — process specific article
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { news_id?: string };
  if (!body.news_id) return fail(new Error('news_id required'));
  try {
    const result = await processArticle(body.news_id);
    return ok(result);
  } catch (e) { return fail(e); }
}
