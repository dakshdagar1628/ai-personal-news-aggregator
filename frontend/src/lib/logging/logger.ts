type Level = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG'

interface LogEntry {
  level: Level
  message: string
  context?: Record<string, unknown>
  durationMs?: number
  timestamp: string
}

const COLORS: Record<Level, string> = {
  INFO:    '\x1b[36m',
  WARN:    '\x1b[33m',
  ERROR:   '\x1b[31m',
  SUCCESS: '\x1b[32m',
  DEBUG:   '\x1b[35m',
}
const RESET = '\x1b[0m'

function emit(level: Level, message: string, context?: Record<string, unknown>, durationMs?: number) {
  const entry: LogEntry = { level, message, context, durationMs, timestamp: new Date().toISOString() }
  const color = COLORS[level]
  const dur = durationMs !== undefined ? ` (${durationMs}ms)` : ''
  const ctx = context ? ` ${JSON.stringify(context)}` : ''
  console.log(`${color}[${level}]${RESET} ${entry.timestamp} ${message}${dur}${ctx}`)
  return entry
}

export const logger = {
  info:    (msg: string, ctx?: Record<string, unknown>) => emit('INFO',    msg, ctx),
  warn:    (msg: string, ctx?: Record<string, unknown>) => emit('WARN',    msg, ctx),
  error:   (msg: string, ctx?: Record<string, unknown>) => emit('ERROR',   msg, ctx),
  success: (msg: string, ctx?: Record<string, unknown>) => emit('SUCCESS', msg, ctx),
  debug:   (msg: string, ctx?: Record<string, unknown>) => emit('DEBUG',   msg, ctx),

  timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now()
    emit('INFO', `${label} — start`)
    return fn().then(
      result => { emit('SUCCESS', `${label} — done`, undefined, Date.now() - start); return result },
      err    => { emit('ERROR',   `${label} — failed`, { error: String(err) }, Date.now() - start); throw err }
    )
  },
}
