import React, {useEffect} from 'react'
import {Message, type MessageProps, type MessageVariant, type MessageBranchInfo, type MessageActionsConfig} from '../Message'
import {cx} from '../../utils/cx'
import {useScrollAnchor} from './hooks/useScrollAnchor'
import {useAdaptiveSpacer} from './hooks/useAdaptiveSpacer'
import {ThinkingIndicator} from './ThinkingIndicator'

export interface ChatViewItem extends Omit<MessageProps, 'variant' | 'children'> {
  id?: string
  variant?: MessageVariant
  /**
   * Branch navigation info for this message
   */
  branchInfo?: MessageBranchInfo
  /**
   * Actions configuration for this message
   */
  actions?: MessageActionsConfig
}

export interface ChatViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of chat messages to display
   */
  messages: ChatViewItem[]
  /**
   * Index of the latest user message to anchor scroll to.
   * When this changes, the component scrolls that message to the top.
   */
  latestUserMessageIndex?: number
  /**
   * Whether the assistant is currently streaming a response
   */
  isStreaming?: boolean
  /**
   * Whether to show the thinking indicator (between user message and response)
   */
  isThinking?: boolean
  /**
   * Callback when the user scrolls manually
   */
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

/**
 * ChatView displays a conversation thread with smart scrolling behavior.
 *
 * Key behaviors:
 * - When a user message is sent, it anchors to the top of the viewport
 * - Does NOT auto-scroll during streaming (respects user's reading position)
 * - Smooth transitions and animations
 */
export const ChatView = React.forwardRef<HTMLDivElement, ChatViewProps>(
  ({messages, latestUserMessageIndex, isStreaming, isThinking, onScroll, className, ...rest}, ref) => {
    const {containerRef, anchorRef, scrollToAnchor} = useScrollAnchor({
      behavior: 'smooth',
      block: 'start',
    })

    const {contentRef, spacerHeight} = useAdaptiveSpacer({
      containerRef,
    })

    // Scroll to anchor when latest user message index changes
    useEffect(() => {
      if (latestUserMessageIndex !== undefined && latestUserMessageIndex >= 0) {
        scrollToAnchor()
      }
    }, [latestUserMessageIndex, scrollToAnchor])

    // Find the latest user message for anchoring
    const latestUserIdx =
      latestUserMessageIndex ??
      messages.reduceRight((found, msg, idx) => {
        if (found === -1 && msg.variant === 'user') return idx
        return found
      }, -1)

    // Determine if we should show thinking indicator
    // Show when isThinking is true AND there are messages AND the last message is from user
    const showThinking = isThinking && messages.length > 0 && messages[messages.length - 1]?.variant === 'user'

    return (
      <div
        ref={(node) => {
          // Handle both refs
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        onScroll={onScroll}
        className={cx(
          'flex flex-col w-full h-full overflow-y-auto scroll-smooth',
          'px-4 py-6 overscroll-contain',
          className
        )}
        {...rest}
      >
        {/* Content wrapper for adaptive spacer measurement */}
        <div ref={contentRef} className="flex flex-col gap-3">
          {messages.map(({id, variant, className: messageClassName, branchInfo, actions, isStreaming: _nodeIsStreaming, ...messageProps}, index) => {
            const isAnchor = index === latestUserIdx
            const isLastMessage = index === messages.length - 1
            const showStreaming = isLastMessage && isStreaming && variant === 'assistant'
            // Hide actions during streaming
            const hideActions = isStreaming

            return (
              <div
                key={id ?? `msg-${index}`}
                ref={isAnchor ? anchorRef : undefined}
                className={isAnchor ? 'scroll-mt-4' : undefined}
              >
                <Message
                  variant={variant}
                  isStreaming={showStreaming}
                  className={messageClassName}
                  branchInfo={branchInfo}
                  actions={actions}
                  hideActions={hideActions}
                  {...messageProps}
                />
              </div>
            )
          })}

          {/* Thinking indicator */}
          {showThinking && (
            <ThinkingIndicator isVisible />
          )}
        </div>

        {/* Adaptive bottom spacer - fills remaining space exactly */}
        <div
          className="flex-shrink-0 pointer-events-none"
          style={{height: spacerHeight}}
          aria-hidden="true"
        />
      </div>
    )
  }
)

ChatView.displayName = 'ChatView'

export default ChatView
