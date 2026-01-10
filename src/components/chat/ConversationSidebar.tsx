import React from 'react'
import {cx} from '../../utils/cx'

export interface Conversation {
  id: string
  title: string
  preview?: string
  timestamp?: string
  isActive?: boolean
}

export interface ConversationSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * List of conversations to display
   */
  conversations: Conversation[]
  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed?: boolean
  /**
   * Callback when a conversation is selected
   */
  onSelectConversation?: (id: string) => void
  /**
   * Callback when "New Chat" is clicked
   */
  onNewChat?: () => void
  /**
   * Callback to toggle collapse state
   */
  onToggleCollapse?: () => void
}

/**
 * ConversationSidebar displays a collapsible list of past conversations.
 *
 * When collapsed, shows a thin strip with hamburger toggle.
 * The hamburger is integrated into the sidebar itself, not requiring parent to render it.
 */
export const ConversationSidebar = React.forwardRef<HTMLDivElement, ConversationSidebarProps>(
  (
    {
      conversations,
      isCollapsed = false,
      onSelectConversation,
      onNewChat,
      onToggleCollapse,
      className,
      ...rest
    },
    ref
  ) => {
    // Collapsed state: thin strip with hamburger
    if (isCollapsed) {
      return (
        <div
          ref={ref}
          className={cx(
            'h-full bg-charcoal/80 border-r border-ash/40 flex flex-col items-center py-3',
            'w-12 flex-shrink-0',
            className
          )}
          {...rest}
        >
          <button
            onClick={onToggleCollapse}
            className={cx(
              'p-2',
              'text-silver hover:text-white hover:bg-ash/20',
              'transition-colors duration-150'
            )}
            aria-label="Expand sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )
    }

    // Expanded state: full sidebar
    return (
      <div
        ref={ref}
        className={cx(
          'h-full bg-charcoal/80 border-r border-ash/40 flex flex-col',
          'w-64 flex-shrink-0',
          className
        )}
        {...rest}
      >
        {/* Header with New Chat button */}
        <div className="p-3 border-b border-ash/40 flex-shrink-0">
          <button
            onClick={onNewChat}
            className={cx(
              'w-full px-3 py-2',
              'bg-gold/10 hover:bg-gold/20 text-gold',
              'border border-gold/30',
              'flex items-center gap-2',
              'transition-colors duration-200'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <p className="px-4 py-2 text-sm text-silver/60">No conversations yet</p>
          ) : (
            <div className="space-y-1 px-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation?.(conversation.id)}
                  className={cx(
                    'w-full px-3 py-2 text-left',
                    'transition-colors duration-150',
                    conversation.isActive
                      ? 'bg-ash/40 text-white'
                      : 'text-silver hover:bg-ash/20 hover:text-white'
                  )}
                >
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                  {conversation.preview && (
                    <p className="text-xs text-silver/60 truncate mt-0.5">
                      {conversation.preview}
                    </p>
                  )}
                  {conversation.timestamp && (
                    <p className="text-xs text-silver/40 mt-1">{conversation.timestamp}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-ash/40 flex-shrink-0">
          <button
            onClick={onToggleCollapse}
            className="w-full px-3 py-1.5 text-silver hover:text-white hover:bg-ash/20 transition-colors duration-150 flex items-center gap-2 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
            <span>Collapse</span>
          </button>
        </div>
      </div>
    )
  }
)

ConversationSidebar.displayName = 'ConversationSidebar'

/**
 * Collapsed sidebar toggle button (for external use if needed)
 */
export interface CollapsedSidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onExpand?: () => void
}

export const CollapsedSidebarToggle = React.forwardRef<
  HTMLButtonElement,
  CollapsedSidebarToggleProps
>(({onExpand, className, ...rest}, ref) => {
  return (
    <button
      ref={ref}
      onClick={onExpand}
      className={cx(
        'p-2',
        'bg-charcoal/80 border border-ash/40',
        'text-silver hover:text-white hover:bg-ash/20',
        'transition-colors duration-150',
        className
      )}
      aria-label="Expand sidebar"
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
})

CollapsedSidebarToggle.displayName = 'CollapsedSidebarToggle'

export default ConversationSidebar
