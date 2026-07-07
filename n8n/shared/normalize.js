/**
 * SHARED NORMALIZER
 * Converts raw collector output into a clean contract-compliant item.
 * Paste the normalizeItem function into n8n Code nodes.
 */

function normalizeTitle(title) {
  if (!title) return '';
  return String(title).trim().replace(/\s+/g, ' ').slice(0, 500);
}

function normalizeUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  // Strip tracking params that cause false duplicates
  try {
    const parsed = new URL(u);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref','source'].forEach(p => parsed.searchParams.delete(p));
    return parsed.href;
  } catch { return u; }
}

function normalizeDate(val) {
  if (!val) return null;
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch { return null; }
}

function normalizeTags(tags) {
  if (!tags) return [];
  const arr = Array.isArray(tags) ? tags : String(tags).split(',');
  return arr
    .map(t => String(t).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    .filter(t => t.length > 0 && t.length <= 50)
    .slice(0, 20);
}

function normalizeText(text, maxLen = 50000) {
  if (!text) return null;
  return String(text).trim().replace(/\s+/g, ' ').slice(0, maxLen) || null;
}

/**
 * Main normalizer — pass raw collector item, receive clean contract item.
 */
function normalizeItem(raw, sourceSlug) {
  return {
    title:        normalizeTitle(raw.title),
    url:          normalizeUrl(raw.url || raw.link || raw.href || ''),
    source_slug:  sourceSlug || raw.source_slug || '',
    content_raw:  normalizeText(raw.content_raw || raw.content || raw.description || raw.body),
    author:       normalizeText(raw.author || raw.creator || raw.byline, 200),
    published_at: normalizeDate(raw.published_at || raw.pubDate || raw.isoDate || raw.created_at),
    tags:         normalizeTags(raw.tags || raw.keywords || raw.categories || []),
    language:     raw.language || 'en',
    category_hint:raw.category_hint || raw.category || null,
    image_url:    normalizeUrl(raw.image_url || raw.thumbnail || raw.enclosure?.url || ''),
    external_id:  raw.external_id || raw.id || raw.guid || null,
    metadata:     raw.metadata || {},
    collected_at: new Date().toISOString(),
    url_hash:     null, // set by deduplication step
  };
}

module.exports = { normalizeItem, normalizeTitle, normalizeUrl, normalizeDate, normalizeTags };
