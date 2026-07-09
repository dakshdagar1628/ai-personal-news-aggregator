import { ok, created, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';
import { z } from 'zod';

const runSchema = z.object({
  collector_id:   z.string(),
  collector_name: z.string(),
  source_slug:    z.string(),
  run_id:         z.string(),
  started_at:     z.string(),
  finished_at:    z.string().optional(),
  duration_ms:    z.number().int().optional(),
  status:         z.enum(['running','success','partial','failed']),
  items_fetched:  z.number().int().default(0),
  items_validated:z.number().int().default(0),
  items_stored:   z.number().int().default(0),
  items_duplicate:z.number().int().default(0),
  items_skipped:  z.number().int().default(0),
  store_failures: z.number().int().default(0),
  error_message:  z.string().optional(),
  version:        z.string().default('1.0.0'),
  metadata:       z.record(z.string(), z.unknown()).optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collector_id = url.searchParams.get('collector_id');
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);

  if (!isSupabaseConfigured()) return ok([], 'Mock runs');

  const db = getServerClient();
  let q = db.from('collector_runs').select('*').order('started_at', { ascending: false }).limit(limit);
  if (collector_id) q = q.eq('collector_id', collector_id);
  const { data, error } = await q;
  if (error) return fail(error);
  return ok(data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = runSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error);
  if (!isSupabaseConfigured()) return created(parsed.data, 'Mock run stored');

  const db = getServerClient();
  const { data, error } = await db.from('collector_runs')
    .upsert(parsed.data, { onConflict: 'run_id' }).select().single();
  if (error) return fail(error);
  return created(data, 'Run recorded');
}
