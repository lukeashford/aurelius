import React from 'react'
import {X} from 'lucide-react'
import {cx} from '../utils'
import {Tooltip} from './Tooltip'

export interface MentionChipProps
    extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'onClick'> {
  /**
   * The artifact name (the @-handle, without the leading @).
   */
  name: string
  /**
   * Optional human-readable title; shown in the hover tooltip alongside the name.
   */
  title?: string
  /**
   * Optional icon rendered before the name — typically a kind glyph (e.g. `FileImage`,
   * `FileVideo`) or `HelpCircle` for unknown / stale references. Sized at `w-3 h-3` to
   * match the chip's text scale.
   */
  leadingIcon?: React.ReactNode
  /**
   * Called when the chip is clicked. When provided, the chip becomes keyboard-focusable
   * and gains a hover affordance.
   */
  onClick?: () => void
  /**
   * Called when the remove (×) button is clicked. When provided, an × appears on hover/focus.
   * Use only on input-side previews; rendered messages should leave this unset.
   */
  onRemove?: () => void
}

/**
 * Inline chip representing an `@name` artifact mention. Use anywhere a stable reference to a
 * project artifact appears — typed input previews, rendered chat messages, deliverable
 * descriptions. Renders the name in monospace with a leading `@` glyph and a gold-tinted border,
 * mirroring the addressable handle the user sees on the artifact card.
 *
 * Pair with the `Combobox` primitive for the typing surface, and with the
 * `MarkdownContent` `mentionRenderer` prop to render mentions inline inside rendered chat
 * messages — typically `mentionRenderer={(name) => <MentionChip name={name} … />}`.
 */
export const MentionChip = React.forwardRef<HTMLSpanElement, MentionChipProps>(
    ({name, title, leadingIcon, onClick, onRemove, className, ...rest}, ref) => {
      const clickable = !!onClick

      const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (!clickable) {
          return
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick!()
        }
      }

      const chip = (
          <span
              {...rest}
              ref={ref}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? onClick : undefined}
              onKeyDown={clickable ? handleKeyDown : undefined}
              className={cx(
                  // `aurelius-mention` (defined in theme.css) supplies the
                  // colour palette via CSS variables so the parent prose
                  // context (.prose-inherit user bubble vs .prose-invert
                  // assistant bubble) can override defaults via the cascade —
                  // no per-call variant prop or context wiring.
                  'aurelius-mention',
                  'group relative inline-flex items-center gap-1 align-baseline',
                  'px-1.5 py-0.5 text-xs font-mono border',
                  clickable && 'cursor-pointer focus:outline-none '
                      + 'focus-visible:ring-1 focus-visible:ring-current',
                  className
              )}
              aria-label={title ? `${name}: ${title}` : name}
          >
            {leadingIcon && (
                <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>
            )}
            <span className="truncate max-w-40">
              <span className="opacity-60">@</span>{name}
            </span>
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove()
                    }}
                    className={cx(
                        'aurelius-mention-x',
                        'p-0.5 -mr-0.5 transition-colors',
                        'opacity-0 group-hover:opacity-100 focus:opacity-100'
                    )}
                    aria-label={`Remove mention of ${name}`}
                >
                  <X className="w-3 h-3"/>
                </button>
            )}
          </span>
      )

      if (!title) {
        return chip
      }
      return (
          <Tooltip content={title} side="top">
            {chip}
          </Tooltip>
      )
    }
)

MentionChip.displayName = 'MentionChip'

export default MentionChip
