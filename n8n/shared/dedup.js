/**
 * SHARED DEDUPLICATOR
 * Generates url_hash and filters items already in Supabase.
 * The dedup step calls GET /api/news?url_hash=<hash> before inserting.
 *
 * In n8n: use HTTP Request node to call the dedup check endpoint,
 * then use a Code node with this logic to split new vs duplicate items.
 */

/**
 * Simple 16-char hash using FNV-1a (no crypto module needed in n8n sandbox).
 */
function hashUrl(url) {
  const normalized = url.trim().toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/**
 * Attaches url_hash to each item.
 */
function attachHashes(items) {
  return items.map(item => ({ ...item, url_hash: hashUrl(item.url) }));
}

/**
 * Given items with url_hash and a Set of existing hashes,
 * returns { newItems, duplicates }.
 */
function splitDuplicates(items, existingHashes) {
  const newItems = [], duplicates = [];
  const seen = new Set(existingHashes);
  for (const item of items) {
    if (seen.has(item.url_hash)) {
      duplicates.push(item);
    } else {
      newItems.push(item);
      seen.add(item.url_hash); // prevent within-batch duplicates
    }
  }
  return { newItems, duplicates };
}

module.exports = { hashUrl, attachHashes, splitDuplicates };
