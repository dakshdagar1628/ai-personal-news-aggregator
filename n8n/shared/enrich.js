/**
 * SHARED ENRICHER
 * Adds metadata fields required by the storage layer and future AI processing.
 * Paste enrichItem() inline into any n8n Code node.
 *
 * Called AFTER normalize + validate, BEFORE dedup + storage.
 */

function estimateReadTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // 200 wpm
}

function enrichItem(item, collectorMeta) {
  const {
    collectorName    = 'unknown',
    collectorVersion = '1.0.0',
    pipelineVersion  = '1.0.0',
    sourceSlug       = '',
  } = collectorMeta;

  // FNV-1a hash (same as dedup.js — no crypto needed in n8n)
  function hashUrl(url) {
    const s = url.trim().toLowerCase();
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h.toString(16).padStart(8, '0');
  }

  return {
    ...item,
    url_hash:             hashUrl(item.url),
    language:             item.language || 'en',
    fetched_at:           new Date().toISOString(),
    estimated_read_time:  estimateReadTime(item.content_raw),
    metadata: {
      ...(item.metadata || {}),
      collector_name:    collectorName,
      collector_version: collectorVersion,
      pipeline_version:  pipelineVersion,
      source_slug:       sourceSlug,
    },
  };
}

module.exports = { enrichItem, estimateReadTime };
