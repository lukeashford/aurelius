import React, {useEffect} from 'react'
import {
  Message,
  type MessageActionsConfig,
  type MessageBranchInfo,
  type MessageProps,
  type MessageVariant,
} from '../Message'
import {composeRefs, cx} from '../../utils'
import {useScrollAnchor} from './hooks/useScrollAnchor'
import {useAdaptiveSpacer} from './hooks/useAdaptiveSpacer'
import {ThinkingIndicator} from './ThinkingIndicator'
import {Checkpoint, type CheckpointBranchInfo, type CheckpointProps} from './Checkpoint'
import {GreyedDivider, type GreyedDividerProps} from './GreyedDivider'

/**
 * One row in the chat stream. Discriminated by `kind` so ChatView can dispatch
 * to the right renderer without leaking shape into upstream types.
 */
export type ChatViewItem =
    | ChatViewMessageItem
    | ChatViewCheckpointItem
    | ChatViewDividerItem

export interface ChatViewMessageItem extends Omit<MessageProps, 'variant' | 'children'> {
  kind: 'message'
  id: string
  variant: MessageVariant
  /** Branch navigation info — chevrons render only when total > 1. */
  branchInfo?: MessageBranchInfo
  /** Actions configuration (copy / edit / retry). */
  actions?: MessageActionsConfig
  /** When true, this row is rendered in the greyed-future region. */
  muted?: boolean
  /**
   * When true, this message is the active leaf — Message will suppress its
   * `onJumpHere` click target. Mirrors `ChatViewCheckpointItem.isActive`.
   */
  isActive?: boolean
  /**
   * Click handler for the bubble. When provided, the bubble becomes a
   * navigational anchor that moves the active leaf to this node. Aurelius
   * suppresses the click for `isActive` rows, link / button targets inside
   * the bubble, and active text selections.
   */
  onJumpHere?: () => void
}

export interface ChatViewCheckpointItem extends CheckpointProps {
  kind: 'checkpoint'
  id: string
}

export interface ChatViewDividerItem extends GreyedDividerProps {
  kind: 'divider'
  id: string
}

export interface ChatViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Rows to render in the chat stream. Heterogeneous: messages, checkpoints,
   * and the greyed-future divider live in the same list, ordered top-to-bottom.
   */
  items: ChatViewItem[]
  /**
   * Index of the latest user-message row to anchor scroll to. When this index
   * changes, the corresponding row scrolls to the top. Defaults to the
   * last-found user message in `items`.
   */
  latestUserMessageIndex?: number
  /**
   * Whether the assistant is currently streaming a response. Drives the
   * streaming cursor on the last assistant message and the thinking indicator.
   */
  isStreaming?: boolean
  /**
   * Whether to show the thinking indicator (between user message and response).
   */
  isThinking?: boolean
  /**
   * When set, the thinking indicator renders this label verbatim instead of
   * its rotating phrases. Use for domain-specific waits like
   * "Analyzing uploads..." (any animated suffix is the caller's responsibility).
   */
  thinkingLabel?: string
  /**
   * Callback when the user scrolls manually.
   */
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

/**
 * Renders a heterogeneous chat stream — messages, checkpoints, and the
 * greyed-future divider — with smart scrolling behavior.
 *
 * Key behaviors:
 * - When a user message arrives, it anchors to the top of the viewport
 * - Does NOT auto-scroll during streaming (respects user's reading position)
 * - Each row's renderer is dispatched from its `kind` discriminator
 */
export const ChatView = React.forwardRef<HTMLDivElement, ChatViewProps>(
    function ChatView(
        {
          items,
          latestUserMessageIndex,
          isStreaming,
          isThinking,
          thinkingLabel,
          onScroll,
          className,
          ...rest
        },
        ref,
    ) {
      const {containerRef, anchorRef, scrollToAnchor} = useScrollAnchor({
        behavior: 'smooth',
        block: 'start',
      })

      const {contentRef, spacerRef, spacerHeight} = useAdaptiveSpacer({
        containerRef,
        anchorRef,
      })

      const latestUserIdx =
          latestUserMessageIndex ??
          items.reduceRight((found, item, idx) => {
            if (found === -1 && item.kind === 'message' && item.variant === 'user') {
              return idx
            }
            return found
          }, -1)

      useEffect(() => {
        if (latestUserMessageIndex !== undefined && latestUserMessageIndex >= 0) {
          scrollToAnchor()
        }
      }, [latestUserMessageIndex, scrollToAnchor])

      const lastMessageIdx = items.reduceRight((found, item, idx) => {
        return found === -1 && item.kind === 'message' ? idx : found
      }, -1)
      const lastMessage = lastMessageIdx >= 0 ? items[lastMessageIdx] : null
      const showThinking = isThinking
          && lastMessage?.kind === 'message'
          && lastMessage.variant === 'user'

      return (
          <div
              ref={composeRefs(containerRef, ref)}
              onScroll={onScroll}
              className={cx(
                  'flex flex-col w-full h-full overflow-y-auto scroll-smooth',
                  'px-4 py-6 overscroll-contain',
                  className,
              )}
              {...rest}
          >
            <div ref={contentRef} className="relative flex flex-col gap-3">
              {items.map((item, index) => {
                const isAnchor = index === latestUserIdx
                const wrapperRef = isAnchor ? anchorRef : undefined
                const wrapperClass = isAnchor ? 'scroll-mt-4' : undefined

                if (item.kind === 'divider') {
                  const {kind: _k, id, ...dividerProps} = item
                  return (
                      <div key={id}>
                        <GreyedDivider {...dividerProps}/>
                      </div>
                  )
                }

                if (item.kind === 'checkpoint') {
                  const {kind: _k, id, ...checkpointProps} = item
                  return (
                      <div key={id} ref={wrapperRef} className={wrapperClass}>
                        <Checkpoint {...checkpointProps}/>
                      </div>
                  )
                }

                const {
                  kind: _k,
                  id,
                  variant,
                  muted,
                  className: messageClassName,
                  branchInfo,
                  actions,
                  isStreaming: nodeIsStreaming,
                  ...messageProps
                } = item
                const isLastMessage = index === lastMessageIdx
                const showStreaming = isLastMessage && isStreaming && variant === 'assistant'
                const isMessageStreaming = showStreaming || !!nodeIsStreaming

                return (
                    <div
                        key={id}
                        ref={wrapperRef}
                        className={cx(wrapperClass, muted && 'opacity-60')}
                    >
                      <Message
                          variant={variant}
                          isStreaming={isMessageStreaming}
                          className={messageClassName}
                          branchInfo={branchInfo}
                          actions={actions}
                          hideActions={isMessageStreaming}
                          {...messageProps}
                      />
                    </div>
                )
              })}

              {showThinking && <ThinkingIndicator isVisible manualLabel={thinkingLabel}/>}
            </div>

            <div
                ref={spacerRef}
                className="shrink-0 pointer-events-none"
                style={{height: spacerHeight}}
                aria-hidden="true"
            />
          </div>
      )
    },
)

ChatView.displayName = 'ChatView'

// Re-export sub-row types for convenience
export type {CheckpointBranchInfo}

export default ChatView
