import React from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  GitCommitVertical,
  GitMerge,
  PencilLine,
  Upload,
} from 'lucide-react'
import {cx} from '../../utils'

/**
 * What kind of project mutation produced this checkpoint. Drives the icon and
 * visual emphasis. The label and underlying state are unchanged.
 */
export type CheckpointExecutionKind = 'task' | 'submit' | 'rename' | 'init' | 'ingest'

/**
 * Terminal state of the underlying execution. `failed` and `cancelled` render
 * with status text and muted accents but stay clickable so the user can still
 * inspect the partial state.
 */
export type CheckpointStatus = 'completed' | 'failed' | 'cancelled'

export interface CheckpointBranchInfo {
  /** 1-based index of this checkpoint among its siblings. */
  current: number
  /** Total sibling count at this fork point. */
  total: number
  onPrevious?: () => void
  onNext?: () => void
}

export interface CheckpointProps {
  /** Human-readable label, ≤ 50 chars. Comes from the underlying execution name. */
  name: string
  /** What produced the checkpoint — drives the leading icon. */
  executionKind: CheckpointExecutionKind
  /**
   * Terminal status of the execution.
   * @default 'completed'
   */
  status?: CheckpointStatus
  /**
   * When true, this checkpoint is the active leaf — the artifacts panel is
   * already showing this state. Renders without underline or jump affordance.
   */
  isActive?: boolean
  /**
   * When true, this checkpoint sits in the greyed-future region (the timeline
   * the user rewound away from). Lower opacity; still clickable to jump back.
   */
  muted?: boolean
  /**
   * Sibling info for the BranchNavigator chevrons. Chevrons render only when
   * `total > 1`.
   */
  branchInfo?: CheckpointBranchInfo
  /**
   * Click handler for the row. Called when the user wants to jump to this
   * checkpoint (rewind the artifacts panel and active leaf to here).
   */
  onJumpHere?: () => void
}

const KIND_ICONS: Record<CheckpointExecutionKind, React.ComponentType<{ className?: string }>> = {
  task: GitBranch,
  submit: GitMerge,
  rename: PencilLine,
  init: GitCommitVertical,
  ingest: Upload,
}

const KIND_ARIA_LABELS: Record<CheckpointExecutionKind, string> = {
  task: 'Task checkpoint',
  submit: 'Submit checkpoint',
  rename: 'Rename checkpoint',
  init: 'Project head checkpoint',
  ingest: 'Upload batch checkpoint',
}

/**
 * A single-line marker in the chat stream that anchors a chat position to a
 * project state. Clicking the underlined name rewinds the artifacts panel and
 * the active leaf to this checkpoint without forking. Chevrons switch between
 * sibling forks (e.g. parallel task attempts, alternative submits).
 *
 * Visual variants:
 * - active: gold accent, no underline (the user is already here)
 * - muted: greyed-future row, lower opacity, still clickable
 * - failed/cancelled: status suffix in muted error/silver, still clickable
 */
export const Checkpoint = React.forwardRef<HTMLDivElement, CheckpointProps>(
    function Checkpoint(
        {name, executionKind, status = 'completed', isActive, muted, branchInfo, onJumpHere},
        ref,
    ) {
      const KindIcon = KIND_ICONS[executionKind]
      const isFailed = status === 'failed'
      const isCancelled = status === 'cancelled'
      const isInteractive = !isActive && !!onJumpHere

      const iconColor = isActive
          ? 'text-gold'
          : isFailed
              ? 'text-error-muted'
              : 'text-silver/50'

      const nameClasses = cx(
          'transition-colors text-xs',
          isActive
              ? 'text-silver font-medium'
              : isInteractive
                  ? 'text-silver/70 hover:text-white underline decoration-silver/30 underline-offset-4 decoration-dotted hover:decoration-silver/70'
                  : 'text-silver/50',
      )

      return (
          <div
              ref={ref}
              role="group"
              aria-label={KIND_ARIA_LABELS[executionKind]}
              className={cx(
                  'group/checkpoint flex items-center gap-2 py-1.5 select-none',
                  muted && 'opacity-60',
              )}
          >
            <KindIcon className={cx('w-3.5 h-3.5 shrink-0', iconColor)} aria-hidden="true"/>

            <button
                type="button"
                onClick={isInteractive ? onJumpHere : undefined}
                disabled={!isInteractive}
                className={cx(nameClasses, 'truncate text-left',
                    !isInteractive && 'cursor-default')}
                aria-label={isInteractive ? `Jump to checkpoint ${name}` : name}
            >
              <span className="truncate">{name}</span>
              {isFailed && (
                  <span className="ml-1.5 text-error-muted">· failed</span>
              )}
              {isCancelled && (
                  <span className="ml-1.5 text-silver/40">· cancelled</span>
              )}
            </button>

            {isInteractive && (
                <span
                    className={cx(
                        'ml-1 inline-flex items-center gap-1 text-xs text-silver/40',
                        'opacity-0 group-hover/checkpoint:opacity-100 transition-opacity',
                        'pointer-events-none',
                    )}
                    aria-hidden="true"
                >
              <ArrowLeft className="w-3 h-3"/>
              Jump here
            </span>
            )}

            {branchInfo && branchInfo.total > 1 && (
                <div
                    className="ml-auto inline-flex items-center gap-0.5 text-silver/70 text-xs"
                    role="navigation"
                    aria-label="Switch sibling checkpoint"
                >
                  <button
                      type="button"
                      onClick={branchInfo.onPrevious}
                      disabled={branchInfo.current <= 1}
                      className={cx(
                          'p-0.5 hover:text-white hover:bg-white/10 transition-colors',
                          'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70',
                      )}
                      aria-label="Previous sibling checkpoint"
                  >
                    <ChevronLeft className="w-3 h-3"/>
                  </button>
                  <span className="tabular-nums min-w-6 text-center">
                {branchInfo.current}/{branchInfo.total}
              </span>
                  <button
                      type="button"
                      onClick={branchInfo.onNext}
                      disabled={branchInfo.current >= branchInfo.total}
                      className={cx(
                          'p-0.5 hover:text-white hover:bg-white/10 transition-colors',
                          'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70',
                      )}
                      aria-label="Next sibling checkpoint"
                  >
                    <ChevronRight className="w-3 h-3"/>
                  </button>
                </div>
            )}
          </div>
      )
    },
)

Checkpoint.displayName = 'Checkpoint'

export default Checkpoint
