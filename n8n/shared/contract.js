/**
 * SHARED DATA CONTRACT
 * Every collector MUST output items conforming to this shape before
 * entering the shared processing pipeline (normalize → validate → dedup → store).
 *
 * Usage in n8n Code node:
 *   const { CONTRACT_FIELDS, createItem, validateContract } = require('./contract');
 *   (or copy the functions inline since n8n Code nodes are sandboxed)
 */

const CONTRACT_FIELDS = {
  required: ['title', 'url', 'source_slug'],
  optional: ['content_raw', 'author', 'published_at', 'tags', 'metadata', 'language',
             'category_hint', 'image_url', 'external_id'],
};

/**
 * Creates a contract-compliant item with all defaults applied.
 * Collectors call this to build their output item.
 */
function createItem(overrides = {}) {
  return {
    // Required
    title:        '',
    url:          '',
    source_slug:  '',
    // Optional — always present with defaults
    content_raw:   null,
    author:        null,
    published_at:  null,
    tags:          [],
    metadata:      {},
    language:      'en',
    category_hint: null,   // slug hint for AI categorization
    image_url:     null,
    external_id:   null,   // source-native ID (tweet ID, HN ID, etc.)
    // System fields — set by pipeline, NOT by collector
    url_hash:      null,   // set by deduplication step
    collected_at:  new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Validates an item against the contract. Returns { valid, errors }.
 */
function validateContract(item) {
  const errors = [];
  for (const field of CONTRACT_FIELDS.required) {
    if (!item[field] || String(item[field]).trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }
  if (item.url && !/^https?:\/\//i.test(item.url)) {
    errors.push(`Invalid URL: ${item.url}`);
  }
  if (item.tags && !Array.isArray(item.tags)) {
    errors.push('tags must be an array');
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { CONTRACT_FIELDS, createItem, validateContract };
