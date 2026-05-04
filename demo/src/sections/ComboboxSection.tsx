import React, {useRef, useState} from 'react'
import {
  Combobox,
  getTextareaCaretCoords,
  MentionChip,
  Textarea,
  useComboboxNav,
} from '@lukeashford/aurelius'
import {FileImage, FileText, FileVideo} from 'lucide-react'
import Section from './Section'

interface Artifact {
  name: string
  title: string
  kind: 'image' | 'text' | 'video'
}

const ARTIFACTS: Artifact[] = [
  {name: 'hero_pose', title: 'Hero Pose', kind: 'image'},
  {name: 'villain_pose', title: 'Villain Pose', kind: 'image'},
  {name: 'sidekick_pose', title: 'Sidekick Pose', kind: 'image'},
  {name: 'opening_shot', title: 'Opening Shot', kind: 'video'},
  {name: 'closing_shot', title: 'Closing Shot', kind: 'video'},
  {name: 'treatment', title: 'Treatment Document', kind: 'text'},
  {name: 'script', title: 'Script', kind: 'text'},
  {name: 'logline', title: 'Logline', kind: 'text'},
]

const KIND_ICON = {
  image: FileImage,
  text: FileText,
  video: FileVideo,
}

interface TriggerState {
  query: string
  tokenStart: number
  tokenEnd: number
  caret: { top: number; left: number }
}

/**
 * Reference wiring for an `@`-mention picker on top of an aurelius Textarea — exactly the
 * shape atrium will use:
 *
 * - Explicit "trigger" state owned by the consumer; no caret-vs-value timing tricks.
 * - Caret-anchored positioning via `getTextareaCaretCoords` (mirror-div).
 * - Opens **upward** above the caret — the right default for chat inputs that sit at the
 *   bottom of the viewport. For the downward case, drop the `translateY(-100%)` transform
 *   and offset `top` by `getTextareaCaretCoords(el).height` to clear the caret line.
 * - Closes on selection / Escape / when the trigger token disappears from under the caret.
 * - No trailing space on insert.
 */
export default function ComboboxSection() {
  const [value, setValue] = useState('Try typing @ to trigger the picker. ')
  const [trigger, setTrigger] = useState<TriggerState | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Trigger detection is keystroke-based, not state-based: the picker opens
  // only when a single-character user edit (typing or backspace) leaves the
  // caret inside an `@\w*` token. Multi-char value changes (programmatic
  // mention insert, paste) and pure caret movements (arrow keys, clicks)
  // never open it — so we don't need a `justInserted` flag, and there's no
  // `onSelect` listener.
  const prevValueRef = useRef(value)

  const refreshTrigger = (el: HTMLTextAreaElement) => {
    const next = el.value
    const prev = prevValueRef.current
    prevValueRef.current = next

    if (Math.abs(next.length - prev.length) !== 1) {
      setTrigger(null)
      return
    }

    const upTo = next.slice(0, el.selectionStart)
    const m = upTo.match(/(?:^|\s)@(\w*)$/)
    if (!m) {
      setTrigger(null)
      return
    }
    setTrigger({
      query: m[1],
      tokenStart: el.selectionStart - m[1].length - 1,
      tokenEnd: el.selectionStart,
      caret: getTextareaCaretCoords(el),
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    refreshTrigger(e.target)
  }

  const filtered = trigger
      ? ARTIFACTS.filter(a => a.name.toLowerCase().includes(trigger.query.toLowerCase()))
      : []

  const insert = (artifact: Artifact) => {
    if (!trigger) {
      return
    }
    const before = value.slice(0, trigger.tokenStart)
    const after = value.slice(trigger.tokenEnd)
    const replacement = `@${artifact.name}`
    setValue(`${before}${replacement}${after}`)
    setTrigger(null)

    const el = textareaRef.current
    if (el) {
      const pos = before.length + replacement.length
      // React applies the controlled value on the next paint; setting selection
      // synchronously here would target the pre-update value. Defer one frame so
      // the new text is in the DOM before we move the caret.
      requestAnimationFrame(() => {
        el.setSelectionRange(pos, pos)
        el.focus()
      })
    }
  }

  const dismiss = () => setTrigger(null)

  const nav = useComboboxNav({items: filtered, onSelect: insert, onDismiss: dismiss})

  // Single backspace at the tail of an `@\w+` token deletes the whole token,
  // matching the chip-on-send behaviour: a mention is one logical thing, so
  // it should disappear in one keystroke. Mirrors atrium's chat-input wiring.
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (nav.handleKeyDown(e)) {
      return
    }
    if (e.key === 'Backspace' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      const el = e.currentTarget
      if (el.selectionStart === el.selectionEnd) {
        const before = el.value.slice(0, el.selectionStart)
        const m = before.match(/(?:^|\s)(@\w+)$/)
        if (m) {
          e.preventDefault()
          const tokenStart = el.selectionStart - m[1].length
          const next = el.value.slice(0, tokenStart) + el.value.slice(el.selectionStart)
          setValue(next)
          requestAnimationFrame(() => {
            el.setSelectionRange(tokenStart, tokenStart)
            el.focus()
          })
        }
      }
    }
  }

  return (
      <Section title="Combobox + useComboboxNav"
               subtitle="Floating panel + keyboard hook for inline autocompletes (e.g. @-mentions, slash commands).">
        <div className="space-y-4">
          <div className="relative max-w-lg">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                rows={4}
                placeholder="Type @ to open the picker…"
            />
            {trigger && filtered.length > 0 && (
                <Combobox
                    style={{
                      top: trigger.caret.top,
                      left: trigger.caret.left,
                      // Bottom of the panel sits at the caret regardless of list height —
                      // the panel grows upward as more rows fit within `maxHeight`.
                      transform: 'translateY(-100%)',
                    }}
                    items={filtered}
                    selectedIndex={nav.selectedIndex}
                    getItemKey={(a) => a.name}
                    onSelectItem={insert}
                    renderItem={(a, isSelected) => {
                      const Icon = KIND_ICON[a.kind]
                      return (
                          <div className={`flex items-center gap-3 px-3 py-2 ${
                              isSelected ? 'text-white' : 'text-silver'
                          }`}>
                            <Icon className="w-4 h-4 shrink-0"/>
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-xs">@{a.name}</span>
                              <span className="text-xs opacity-60 truncate">{a.title}</span>
                            </div>
                          </div>
                      )
                    }}
                />
            )}
          </div>
          <div className="text-xs text-silver">
            ↑/↓ navigate · Enter / Tab insert · Escape dismiss · panel opens above the caret
            (chat-input pattern)
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-silver">
            <span>Available:</span>
            {ARTIFACTS.map(a => <MentionChip key={a.name} name={a.name}/>)}
          </div>
        </div>
      </Section>
  )
}
