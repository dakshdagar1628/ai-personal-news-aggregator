import { NextResponse } from 'next/server'
import { AppError, toAppError } from './errors'
import { logger } from '@/lib/logging/logger'

export interface SuccessBody<T> {
  success: true; data: T; message: string; timestamp: string
}
export interface ErrorBody {
  success: false; error: string; code: string; details?: unknown; timestamp: string
}
export interface PaginatedMeta {
  total: number; page: number; pageSize: number; hasMore: boolean
}
export interface PaginatedBody<T> extends SuccessBody<T[]> {
  pagination: PaginatedMeta
}

function ts() { return new Date().toISOString() }

export function ok<T>(data: T, message = 'OK', status = 200): NextResponse<SuccessBody<T>> {
  return NextResponse.json({ success: true, data, message, timestamp: ts() }, { status })
}

export function created<T>(data: T, message = 'Created'): NextResponse<SuccessBody<T>> {
  return ok(data, message, 201)
}

export function paginated<T>(
  data: T[], total: number, page: number, pageSize: number, message = 'OK'
): NextResponse<PaginatedBody<T>> {
  return NextResponse.json({
    success: true, data, message, timestamp: ts(),
    pagination: { total, page, pageSize, hasMore: page * pageSize < total },
  })
}

export function fail(err: unknown): NextResponse<ErrorBody> {
  const e = toAppError(err)
  logger.error(`API error: ${e.message}`, { code: e.code, status: e.statusCode })
  return NextResponse.json(
    { success: false, error: e.message, code: e.code, details: e.details, timestamp: ts() },
    { status: e.statusCode }
  )
}
