import { useEffect, useRef, useState } from 'react'
import { useOSStore } from '../../store/useOSStore'
import { executeCommand } from './parser'

const welcome = [
  { type: 'system', lines: ['STATO OS Terminal 2.0', 'Portfolio navigation shell · type “help” to begin.'] },
]

export default function TerminalApp() {
  const [history, setHistory] = useState(welcome)
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const { openApp, launchProject } = useOSStore()

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [history])

  const run = (raw) => {
    const result = executeCommand(raw, { openApp, launchProject })
    if (result.clear) {
      setHistory([])
      return
    }
    setHistory((current) => [...current, { type: 'command', command: raw, lines: result.lines, tone: result.tone }])
  }

  const submit = (event) => {
    event.preventDefault()
    const raw = input.trim()
    if (!raw) return
    setCommandHistory((current) => [...current, raw])
    setHistoryIndex(-1)
    setInput('')
    run(raw)
  }

  const handleKeyDown = (event) => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key) || !commandHistory.length) return
    event.preventDefault()
    if (event.key === 'ArrowUp') {
      const nextIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
    } else {
      const nextIndex = Math.min(commandHistory.length, historyIndex + 1)
      setHistoryIndex(nextIndex === commandHistory.length ? -1 : nextIndex)
      setInput(nextIndex === commandHistory.length ? '' : commandHistory[nextIndex])
    }
  }

  return (
    <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-meta"><span>stato@os:~</span><span>navigation shell · UTF-8</span></div>
      <div className="terminal-output" ref={outputRef} aria-live="polite">
        {history.map((entry, index) => (
          <div className={`terminal-entry ${entry.tone ? `is-${entry.tone}` : ''}`} key={`${entry.command || 'system'}-${index}`}>
            {entry.command && <p className="terminal-command"><b>stato@os</b><i>:</i><em>~</em><span>$</span> {entry.command}</p>}
            {entry.lines.map((line, lineIndex) => <p key={`${line}-${lineIndex}`}>{line || '\u00a0'}</p>)}
          </div>
        ))}
      </div>
      <form className="terminal-prompt" onSubmit={submit}>
        <label htmlFor="terminal-input"><b>stato@os</b><i>:</i><em>~</em><span>$</span></label>
        <input ref={inputRef} id="terminal-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} autoComplete="off" autoCapitalize="none" spellCheck="false" aria-label="Terminal command" autoFocus />
        <i className="terminal-cursor" aria-hidden="true" />
        <button className="terminal-run" type="submit" aria-label="Run command">↵</button>
      </form>
    </div>
  )
}
