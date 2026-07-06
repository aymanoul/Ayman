import { useRef, useState, type KeyboardEvent } from 'react'
import { PaperPlane } from '../icons'
import '../../styles/gradient-ai-chat-input.css'

// Gradient-AI-Chat-Input — 1:1 nach der gelieferten Vorlage nachgebaut,
// seitdem entschlackt: kein Datei-Anhang (die Antwort-Engine kann Bilder
// nicht lesen, s. lib/antwort.ts), kein Modell-Chip (keine echte KI dahinter).
//
// Großer runder Kasten mit weichem Pastell-Verlaufsrand (Pfirsich → Rosa),
// mitwachsende Textzeile + Papierflieger zum Senden. Enter sendet,
// Shift+Enter = Zeilenumbruch. `prefers-reduced-motion` friert die Bordüre.

export interface GradientAIChatInputProps {
  placeholder?: string
  onSend?: (message: string) => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  /** Maximale Zeilenhöhe, bevor die Textarea intern scrollt. */
  maxRows?: number
}

export function GradientAIChatInput({
  placeholder = 'Send message...',
  onSend,
  disabled = false,
  autoFocus = false,
  className,
  maxRows = 8,
}: GradientAIChatInputProps) {
  const [value, setValue] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  const canSend = value.trim().length > 0 && !disabled

  function grow() {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const line = parseFloat(getComputedStyle(ta).lineHeight) || 22
    ta.style.height = `${Math.min(ta.scrollHeight, line * maxRows)}px`
  }

  function submit() {
    const message = value.trim()
    if (!message || disabled) return
    onSend?.(message)
    setValue('')
    requestAnimationFrame(() => {
      if (taRef.current) taRef.current.style.height = 'auto'
    })
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className={`gaci${disabled ? ' gaci--disabled' : ''}${className ? ` ${className}` : ''}`}>
      <div className="gaci__frame">
        <div className="gaci__inner">
          <div className="gaci__top">
            <textarea
              ref={taRef}
              className="gaci__input"
              value={value}
              rows={1}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              aria-label={placeholder}
              autoComplete="off"
              onChange={(e) => {
                setValue(e.target.value)
                grow()
              }}
              onKeyDown={onKeyDown}
            />
            <button
              type="button"
              className="gaci__send"
              onClick={submit}
              disabled={!canSend}
              aria-label="Senden"
            >
              <PaperPlane aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GradientAIChatInput
