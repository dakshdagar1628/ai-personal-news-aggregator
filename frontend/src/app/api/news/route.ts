import { NextRequest } from 'next/server';
import { ok, created, fail, paginated } from '@/lib/api/response';
import { newsService } from '@/lib/database/news.service';
import { searchNewsSchema } from '@/lib/validators/news.schema';
import { z } from 'zod';

const createSchema = z.object({
  source_id:            z.string().uuid(),
  category_id:          z.string().uuid().optional(),
  title:                z.string().min(1).max(500),
  url:                  z.string().url(),
  content_raw:          z.string().max(50000).optional(),
  content_summary:      z.string().max(5000).optional(),
  author:               z.string().max(200).optional(),
  published_at:         z.string().optional(),
  importance_score:     z.number().min(0).max(1).default(0.5),
  tags:                 z.array(z.string()).default([]),
  external_id:          z.string().max(200).optional(),
  category_hint:        z.string().optional(),
  estimated_read_time:  z.number().int().optional(),
  language:             z.string().default('en'),
  raw_payload:          z.record(z.unknown()).optional(),
  normalized_payload:   z.record(z.unknown()).optional(),
  metadata:             z.record(z.unknown()).optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = searchNewsSchema.safeParse(params);
  if (!parsed.success) return fail(parsed.error);
  try {
    const result = await newsService.searchNews(parsed.data);
    return paginated(result.data, result.total, parsed.data.page ?? 1, parsed.data.pageSize ?? 20);
  } catch (e) { return fail(e); }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error);
  try {
    const item = await newsService.createNews(parsed.data as Parameters<typeof newsService.createNews>[0]);
    if (!item) return ok(null, 'Duplicate — skipped');
    return created(item, 'News item created');
  } catch (e) { return fail(e); }
}
