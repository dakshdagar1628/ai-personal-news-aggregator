import { ok } from '@/lib/api/response';
// Bookmarks are stored client-side in localStorage in this phase.
// This endpoint is a placeholder for future server-side persistence.
export async function GET() { return ok([], 'Bookmarks are stored locally'); }
export async function POST() { return ok(null, 'Bookmarks are stored locally'); }
