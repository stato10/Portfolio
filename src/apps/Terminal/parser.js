import { commandNames, commands } from './commands'

export function parseCommand(raw) {
  const tokens = raw.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return { name: tokens[0] || '', args: tokens.slice(1) }
}

export function executeCommand(raw, context) {
  const parsed = parseCommand(raw)
  if (!parsed.name) return { lines: [] }
  const handler = commands[parsed.name]
  if (!handler) {
    return {
      lines: [`command not found: ${parsed.name}`, `Available: ${commandNames.join(', ')}`],
      tone: 'error',
    }
  }
  return handler({ ...context, args: parsed.args, raw })
}
