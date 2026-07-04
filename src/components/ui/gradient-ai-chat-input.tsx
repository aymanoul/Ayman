import { useRef, useState, type KeyboardEvent } from 'react'
import { SparkIcon, SendIcon, Paperclip } from '../icons'
import '../../styles/gradient-ai-chat-input.css'

// Gradient-AI-Chat-Input — an Mushaf angepasst.
//
// Ein Chat-Eingabefeld mit dem typischen "AI"-Verlaufsrahmen — hier aber nicht
// als kaltes Neon, sondern als illuminierte Gold→Salbei→Bordeaux-Bordüre, die
// beim Fokus sanft wandert (Tezhip statt Tech). Mitgewachsene Textarea, Enter
// sendet, Shift+Enter = Zeilenumbruch. `prefers-reduced-motion` friert den
// Verlauf ein. Gleiche API wie die Vorlage: placeholder / onSend / onFileAttach.

export interface GradientAIChatInputProps {
  placeholder?: string
  onSend?: (message: string) => void
  /** Wird nur gerendert, wenn gesetzt — im Kontext "Frage stellen" bleibt es aus. */
  onFileAttach?: () => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  /** Maximale Zeilenhöhe, bevor die Textarea intern scrollt. */
  maxRows?: number
}

export function GradientAIChatInput({
  placeholder = 'Send message...',
  onSend,
  onFileAttach,
  disabled = false,
  autoFocus = false,
  className,
  maxRows = 6,
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
          {onFileAttach && (
            <button
              type="button"
              className="gaci__btn gaci__attach"
              onClick={onFileAttach}
              disabled={disabled}
              aria-label="Datei anhängen"
            >
              <Paperclip aria-hidden />
            </button>
          )}

          <span className="gaci__spark" aria-hidden>
            <SparkIcon />
          </span>

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
            className="gaci__btn gaci__send"
            onClick={submit}
            disabled={!canSend}
            aria-label="Senden"
          >
            <SendIcon aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GradientAIChatInput
