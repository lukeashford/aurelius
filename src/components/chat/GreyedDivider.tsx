import React from 'react'
import {ArrowDown} from 'lucide-react'
import {cx} from '../../utils'

export interface GreyedDividerProps {
  /** Number of message rows in the greyed-future region. */
  messageCount: number
  /** Number of checkpoint rows in the greyed-future region. */
  checkpointCount: number
  /** Click handler that jumps the active leaf to the deepest greyed leaf. */
  onJumpToLatest?: () => void
}

function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`
}

function summarize(messageCount: number, checkpointCount: number): string {
  const parts: string[] = []
  if (messageCount > 0) {
    parts.push(pluralize(messageCount, 'message', 'messages'))
  }
  if (checkpointCount > 0) {
    parts.push(pluralize(checkpointCount, 'checkpoint', 'checkpoints'))
  }
  return parts.length > 0 ? parts.join(', ') : 'no items'
}

/**
 * A full-width divider that announces the start of the greyed-future region —
 * the timeline beyond the user's current rewound position. Clicking
 * "Jump to latest" returns to the deepest leaf the user previously reached.
 *
 * Visual: hairline rule with a centered summary chip and a right-aligned
 * jump-to-latest action. Renders nothing when both counts are zero.
 */
export const GreyedDivider = React.forwardRef<HTMLDivElement, GreyedDividerProps>(
    function GreyedDivider({messageCount, checkpointCount, onJumpToLatest}, ref) {
      if (messageCount === 0 && checkpointCount === 0) {
        return null
      }

      return (
          <div
              ref={ref}
              role="separator"
              aria-label="Start of rewound timeline"
              className="flex items-center gap-3 py-2 text-xs text-silver/50 select-none"
          >
            <div className="flex-1 h-px bg-ash/40" aria-hidden="true"/>

            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <ArrowDown className="w-3 h-3" aria-hidden="true"/>
          Later in this conversation · {summarize(messageCount, checkpointCount)}
        </span>

            <div className="flex-1 h-px bg-ash/40" aria-hidden="true"/>

            {onJumpToLatest && (
                <button
                    type="button"
                    onClick={onJumpToLatest}
                    className={cx(
                        'shrink-0 transition-colors',
                        'text-silver/60 hover:text-white',
                        'underline decoration-silver/30 underline-offset-4 decoration-dotted hover:decoration-silver/70',
                    )}
                >
                  Jump to latest →
                </button>
            )}
          </div>
      )
    },
)

GreyedDivider.displayName = 'GreyedDivider'

export default GreyedDivider
