import { useEffect, useRef, useState } from 'react'
import { useOSStore } from '../../store/useOSStore'
import { commandNames, commands } from './commands'

const welcome = [
  { type: 'system', lines: ['STATO OS Terminal 1.0', 'Type “help” to inspect available commands.'] },
]

export default function TerminalApp() {
  const [history, setHistory] = useState(welcome)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const { openApp } = useOSStore()

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [history])

  const execute = (event) => {
    event.preventDefault()
    const raw = input.trim()
    if (!raw) return
    const command = raw.toLowerCase().split(/\s+/)[0]
    setInput('')
    if (command === 'clear') {
      setHistory([])
      return
    }
    const handler = commands[command]
    const lines = handler
      ? handler({ openApp })
      : [`Command not found: ${command}`, `Try “help” or one of: ${commandNames.join(', ')}`]
    setHistory((current) => [...current, { type: 'command', command: raw, lines }])
  }

  return (
    <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-meta"><span>stato@portfolio</span><span>zsh · 80×24</span></div>
      <div className="terminal-output" ref={outputRef} aria-live="polite">
        {history.map((entry, index) => (
          <div className="terminal-entry" key={`${entry.command || 'system'}-${index}`}>
            {entry.command && <p className="terminal-command"><b>stato</b><i>~</i><span>$</span> {entry.command}</p>}
            {entry.lines.map((line) => <p key={line}>{line || '\u00a0'}</p>)}
          </div>
        ))}
      </div>
      <form className="terminal-prompt" onSubmit={execute}>
        <label htmlFor="terminal-input"><b>stato</b><i>~</i><span>$</span></label>
        <input
          ref={inputRef}
          id="terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          aria-label="Terminal command"
          autoFocus
        />
        <i className="terminal-cursor" aria-hidden="true" />
      </form>
    </div>
  )
}
