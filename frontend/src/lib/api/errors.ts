export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly details?: unknown
  ) { super(message) }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(id ? `${resource} '${id}' not found` : `${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super('Validation failed', 422, 'VALIDATION_ERROR', details)
  }
}

export class DatabaseError extends AppError {
  constructor(msg: string, details?: unknown) {
    super(`Database error: ${msg}`, 500, 'DATABASE_ERROR', details)
  }
}

export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err
  const msg = err instanceof Error ? err.message : String(err)
  return new AppError(msg)
}
