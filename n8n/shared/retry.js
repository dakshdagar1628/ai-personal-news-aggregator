/**
 * SHARED RETRY LOGIC
 * Use in n8n Code nodes for retryable HTTP calls.
 * n8n also supports built-in retry on HTTP Request nodes — configure both.
 */

const DEFAULT_POLICY = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 30000,
  retryOnStatus: [429, 500, 502, 503, 504],
};

/**
 * Executes fn() with exponential backoff.
 * fn must be async and return { status, data } or throw.
 */
async function withRetry(fn, policy = {}) {
  const cfg = { ...DEFAULT_POLICY, ...policy };
  let lastError;
  let delay = cfg.initialDelayMs;

  for (let attempt = 1; attempt <= cfg.maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      const status = err?.response?.status ?? err?.status ?? 0;
      const shouldRetry = attempt < cfg.maxAttempts &&
        (cfg.retryOnStatus.includes(status) || status === 0);

      if (!shouldRetry) throw err;

      console.log(`[RETRY] attempt ${attempt}/${cfg.maxAttempts} failed (${status}), retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, Math.min(delay, cfg.maxDelayMs)));
      delay *= cfg.backoffMultiplier;
    }
  }
  throw lastError;
}

module.exports = { withRetry, DEFAULT_POLICY };
