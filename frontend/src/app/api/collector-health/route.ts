import { ok, created, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';
import { logger } from '@/lib/logging/logger';
import { z } from 'zod';

const upsertSchema = z.object({
  collector_id:           z.string(),
  collector_name:         z.string(),
  status:                 z.enum(['idle','running','success','failed','partial']),
  is_enabled:             z.boolean().optional(),
  last_run_at:            z.string().optional(),
  last_success_at:        z.string().optional(),
  last_failure_at:        z.string().optional(),
  last_run_duration_ms:   z.number().int().optional(),
  items_fetched:          z.number().int().default(0),
  items_stored:           z.number().int().default(0),
  items_duplicate:        z.number().int().default(0),
  items_skipped:          z.number().int().default(0),
  store_failures:         z.number().int().default(0),
  last_error_message:     z.string().nullable().optional(),
  current_version:        z.string().default('1.0.0'),
  metadata:               z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return ok(MOCK_HEALTH, 'Mock collector health');
  }
  return logger.timed('GET /api/collector-health', async () => {
    const db = getServerClient();
    const { data, error } = await db.from('collector_health').select('*').order('collector_name');
    if (error) throw error;
    return ok(data);
  }).catch(fail);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error);

  const input = parsed.data;
  if (!isSupabaseConfigured()) return created(input, 'Mock upsert');

  return logger.timed(`UPSERT health:${input.collector_id}`, async () => {
    const db = getServerClient();
    // Update aggregates
    const { data: existing } = await db.from('collector_health')
      .select('total_runs,successful_runs,failed_runs,total_items_collected,total_items_stored,total_duplicates,total_validation_errors,avg_run_duration_ms')
      .eq('collector_id', input.collector_id).single();

    const prev = existing ?? { total_runs:0,successful_runs:0,failed_runs:0,total_items_collected:0,total_items_stored:0,total_duplicates:0,total_validation_errors:0,avg_run_duration_ms:null };
    const runs = prev.total_runs + 1;
    const successes = prev.successful_runs + (input.status === 'success' ? 1 : 0);
    const failures  = prev.failed_runs    + (input.status === 'failed'  ? 1 : 0);
    const prevAvg   = prev.avg_run_duration_ms ?? input.last_run_duration_ms ?? 0;
    const newAvg    = input.last_run_duration_ms != null
      ? Math.round((prevAvg * (runs - 1) + input.last_run_duration_ms) / runs) : prevAvg;

    const row = {
      collector_id:           input.collector_id,
      collector_name:         input.collector_name,
      status:                 input.status,
      is_enabled:             input.is_enabled ?? true,
      last_run_at:            input.last_run_at ?? new Date().toISOString(),
      last_success_at:        input.status === 'success' ? (input.last_success_at ?? new Date().toISOString()) : undefined,
      last_failure_at:        input.status === 'failed'  ? (input.last_failure_at  ?? new Date().toISOString()) : undefined,
      last_run_duration_ms:   input.last_run_duration_ms,
      avg_run_duration_ms:    newAvg,
      total_runs:             runs,
      successful_runs:        successes,
      failed_runs:            failures,
      total_items_collected:  prev.total_items_collected + input.items_fetched,
      total_items_stored:     prev.total_items_stored    + input.items_stored,
      total_duplicates:       prev.total_duplicates      + input.items_duplicate,
      total_validation_errors:prev.total_validation_errors + input.items_skipped,
      last_error_message:     input.last_error_message ?? null,
      current_version:        input.current_version,
      metadata:               input.metadata ?? null,
    };

    const { data, error } = await db.from('collector_health')
      .upsert(row, { onConflict: 'collector_id' }).select().single();
    if (error) throw error;
    return created(data, 'Health updated');
  }).catch(fail);
}

const MOCK_HEALTH = [
  { collector_id:'openai',collector_name:'OpenAI',status:'success',is_enabled:true,total_runs:24,successful_runs:23,failed_runs:1,total_items_stored:142,total_duplicates:58,current_version:'1.0.0' },
  { collector_id:'anthropic',collector_name:'Anthropic',status:'idle',is_enabled:true,total_runs:0,successful_runs:0,failed_runs:0,total_items_stored:0,total_duplicates:0,current_version:'1.0.0' },
];
