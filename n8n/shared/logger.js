/**
 * SHARED LOGGER — paste into any n8n Code node
 * Produces structured log entries that can be forwarded to Supabase or console.
 */

function createLogger(workflowName) {
  const entries = [];
  const startTime = Date.now();

  function log(level, message, data = {}) {
    const entry = {
      level,
      workflow: workflowName,
      message,
      data,
      timestamp: new Date().toISOString(),
      elapsed_ms: Date.now() - startTime,
    };
    entries.push(entry);
    // n8n surfaces console.log in execution logs
    console.log(`[${level}] [${workflowName}] ${message}`, JSON.stringify(data));
    return entry;
  }

  return {
    info:    (msg, data) => log('INFO',    msg, data),
    warn:    (msg, data) => log('WARN',    msg, data),
    error:   (msg, data) => log('ERROR',   msg, data),
    success: (msg, data) => log('SUCCESS', msg, data),
    debug:   (msg, data) => log('DEBUG',   msg, data),

    summary(processed, skipped, failed) {
      return log('SUMMARY', 'Execution complete', {
        processed, skipped, failed,
        duration_ms: Date.now() - startTime,
        workflow: workflowName,
      });
    },

    getEntries: () => entries,
    getDurationMs: () => Date.now() - startTime,
  };
}

module.exports = { createLogger };
