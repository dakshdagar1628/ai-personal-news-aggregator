/**
 * SHARED VALIDATOR
 * Validates normalized items before dedup/storage.
 * Returns { valid: [], invalid: [] } split.
 */

const REQUIRED_FIELDS = ['title', 'url', 'source_slug'];
const MAX_LENGTHS = { title: 500, url: 2000, content_raw: 50000, author: 200 };

function validateItem(item) {
  const errors = [];

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!item[field] || String(item[field]).trim() === '') {
      errors.push({ field, error: 'required field is empty' });
    }
  }

  // URL format
  if (item.url) {
    try { new URL(item.url); }
    catch { errors.push({ field: 'url', error: `invalid URL: ${item.url}` }); }
  }

  // Length guards
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (item[field] && String(item[field]).length > max) {
      errors.push({ field, error: `exceeds max length ${max}` });
    }
  }

  // Tags
  if (!Array.isArray(item.tags)) {
    errors.push({ field: 'tags', error: 'must be array' });
  }

  // Date
  if (item.published_at) {
    const d = new Date(item.published_at);
    if (isNaN(d.getTime())) errors.push({ field: 'published_at', error: 'invalid ISO date' });
    if (d > new Date()) errors.push({ field: 'published_at', error: 'future date not allowed' });
  }

  return { valid: errors.length === 0, errors };
}

function splitValid(items) {
  const valid = [], invalid = [];
  for (const item of items) {
    const result = validateItem(item);
    if (result.valid) valid.push(item);
    else invalid.push({ item, errors: result.errors });
  }
  return { valid, invalid };
}

module.exports = { validateItem, splitValid };
