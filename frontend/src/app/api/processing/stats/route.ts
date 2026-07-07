import { ok, fail } from '@/lib/api/response';
import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function GET() {
  if (!isSupabaseConfigured()) return ok(MOCK_STATS, 'Mock stats');
  const db = getServerClient();
  try {
    const [queueRes, procRes] = await Promise.all([
      db.from('processing_queue').select('status'),
      db.from('processed_articles')
        .select('processing_time_ms,tokens_used,ai_provider,ai_model,processed_at')
        .order('processed_at', { ascending: false }).limit(500),
    ]);
    const queue = (queueRes.data ?? []).reduce<Record<string,number>>((a,r) => {
      a[r.status] = (a[r.status] ?? 0) + 1; return a;
    }, {});
    const proc = procRes.data ?? [];
    const avgMs = proc.reduce((s, r) => s + (r.processing_time_ms ?? 0), 0) / (proc.length || 1);
    const totalTokens = proc.reduce((s, r) => s + (r.tokens_used ?? 0), 0);
    return ok({
      queue,
      total_processed:    proc.length,
      avg_processing_ms:  Math.round(avgMs),
      total_tokens_used:  totalTokens,
      ai_provider:        proc[0]?.ai_provider ?? 'claude',
      model_used:         proc[0]?.ai_model ?? '',
    });
  } catch (e) { return fail(e); }
}

const MOCK_STATS = {
  queue: { pending: 0, processing: 0, completed: 0, failed: 0 },
  total_processed: 0, avg_processing_ms: 0, total_tokens_used: 0,
};
