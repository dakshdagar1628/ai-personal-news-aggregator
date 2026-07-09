import { getServerClient, isSupabaseConfigured } from '@/lib/database/client';

export async function enqueueArticle(newsId: string, priority = 5): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const db = getServerClient();
  await db.from('processing_queue').upsert(
    { news_id: newsId, status: 'pending', priority, scheduled_at: new Date().toISOString() },
    { onConflict: 'news_id', ignoreDuplicates: true }
  );
}

export async function getPendingJobs(limit = 10) {
  if (!isSupabaseConfigured()) return [];
  const db = getServerClient();
  const { data } = await db.from('processing_queue')
    .select('*, news(title,url,source_id)')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('scheduled_at')
    .limit(limit);
  return data ?? [];
}

export async function getRetryJobs(limit = 10) {
  if (!isSupabaseConfigured()) return [];
  const db = getServerClient();
  const { data } = await db.from('processing_queue')
    .select('*, news(title,url)')
    .eq('status', 'retrying')
    .lte('next_retry_at', new Date().toISOString())
    .limit(limit);
  return data ?? [];
}

export async function requeueFailed(newsId?: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const db = getServerClient();
  let q = db.from('processing_queue')
    .update({ status: 'pending', next_retry_at: null, error_message: null, scheduled_at: new Date().toISOString() })
    .eq('status', 'failed')
    .lt('attempts', 3);
  if (newsId) q = q.eq('news_id', newsId);
  const { count } = await q;
  return count ?? 0;
}

export async function getQueueStats() {
  if (!isSupabaseConfigured()) return MOCK_STATS;
  const db = getServerClient();
  const statuses = ['pending', 'processing', 'completed', 'failed', 'retrying', 'skipped'];
  const counts = await Promise.all(
    statuses.map(async status => {
      const { count } = await db
        .from('processing_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      return { status, count: count ?? 0 };
    })
  );
  return counts.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = c.count;
    return acc;
  }, {});
}

const MOCK_STATS = { pending: 0, processing: 0, completed: 0, failed: 0, retrying: 0, skipped: 0 };
