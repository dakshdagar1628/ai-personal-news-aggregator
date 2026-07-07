import { NextRequest } from 'next/server'
import { categoriesService } from '@/lib/database/categories.service'
import { ok, fail } from '@/lib/api/response'

export async function GET() {
  try {
    const data = await categoriesService.getCategories()
    return ok(data)
  } catch (e) { return fail(e) }
}
