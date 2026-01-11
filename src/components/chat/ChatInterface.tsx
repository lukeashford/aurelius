import React, {useState, useCallback, useMemo} from 'react'
import {cx} from '../../utils/cx'
import {ChatView, type ChatViewItem} from './ChatView'
import {ChatInput} from './ChatInput'
import {ConversationSidebar, type Conversation} from './ConversationSidebar'
import {ArtifactsPanel} from './ArtifactsPanel'
import {useArtifactParser, type Artifact} from './hooks/useArtifactParser'

export interface ChatMessage {
  id: string
  variant: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export interface ChatInterfaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /**
   * Array of messages in the conversation
   */
  messages?: ChatMessage[]
  /**
   * List of past conversations for the sidebar
   */
  conversations?: Conversation[]
  /**
   * Called when a message is submitted
   */
  onMessageSubmit?: (message: string) => void
  /**
   * Called when a conversation is selected from sidebar
   */
  onSelectConversation?: (id: string) => void
  /**
   * Called when "New Chat" is clicked
   */
  onNewChat?: () => void
  /**
   * Whether the assistant is currently streaming a response
   */
  isStreaming?: boolean
  /**
   * Input placeholder text
   */
  placeholder?: string
  /**
   * Helper text shown in empty state
   */
  emptyStateHelper?: React.ReactNode
  /**
   * Initial sidebar collapsed state
   */
  initialSidebarCollapsed?: boolean
  /**
   * Custom empty state content
   */
  emptyState?: React.ReactNode
}

/**
 * ChatInterface is the main orchestrator for a full-featured chat experience.
 *
 * Features:
 * - ConversationSidebar (left) — collapsible list of past conversations
 * - ChatView (center) — main conversation area with smart scrolling
 * - ArtifactsPanel (right) — agent-controlled panel for rich content
 * - ChatInput — position-aware input that centers in empty state
 */
export const ChatInterface = React.forwardRef<HTMLDivElement, ChatInterfaceProps>(
  (
    {
      messages = [],
      conversations = [],
      onMessageSubmit,
      onSelectConversation,
      onNewChat,
      isStreaming = false,
      placeholder = 'Send a message...',
      emptyStateHelper = 'Type anything to start a conversation',
      initialSidebarCollapsed = false,
      emptyState,
      className,
      ...rest
    },
    ref
  ) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed)
    const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(false)

    // Track the latest user message index for scroll anchoring
    const latestUserMessageIndex = useMemo(() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].variant === 'user') {
          return i
        }
      }
      return -1
    }, [messages])

    // Get all assistant message contents for artifact parsing
    const allAssistantContent = useMemo(() => {
      return messages
        .filter((msg) => msg.variant === 'assistant')
        .map((msg) => msg.content)
        .join('\n\n')
    }, [messages])

    // Parse artifacts from all assistant messages
    const {cleanContent: parsedCleanContent, artifacts, hasPendingArtifact} = useArtifactParser(allAssistantContent)

    // Get clean content for just the currently streaming message (if any)
    const currentStreamingCleanContent = useMemo(() => {
      if (!isStreaming || messages.length === 0) return null
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.variant === 'assistant') {
        // Strip artifact syntax from the streaming message
        const content = lastMessage.content
        // Remove complete artifacts
        let clean = content.replace(/:::artifact\{[^}]+\}(?:[^:]*?)?:::/gs, '')
        // Remove incomplete artifacts (still streaming)
        const startMatch = clean.match(/:::artifact\{/)
        if (startMatch && startMatch.index !== undefined) {
          clean = clean.substring(0, startMatch.index)
        }
        return clean.trim()
      }
      return null
    }, [messages, isStreaming])

    // Auto-open artifacts panel when artifacts are found (including pending)
    React.useEffect(() => {
      if ((artifacts.length > 0 || hasPendingArtifact) && !artifactsPanelOpen) {
        setArtifactsPanelOpen(true)
      }
    }, [artifacts.length, hasPendingArtifact, artifactsPanelOpen])

    // Build the messages array with cleaned content (artifact syntax stripped)
    const displayMessages: ChatViewItem[] = useMemo(() => {
      return messages.map((msg, idx) => {
        if (msg.variant === 'assistant') {
          // For the currently streaming message, use the streaming-specific clean content
          if (isStreaming && idx === messages.length - 1 && currentStreamingCleanContent !== null) {
            return {
              ...msg,
              content: currentStreamingCleanContent,
            }
          }
          // For completed assistant messages, strip artifact syntax
          const content = msg.content
          let clean = content.replace(/:::artifact\{[^}]+\}(?:[^:]*?)?:::/gs, '')
          // Also strip any incomplete artifact syntax (shouldn't happen for completed messages)
          const startMatch = clean.match(/:::artifact\{/)
          if (startMatch && startMatch.index !== undefined) {
            clean = clean.substring(0, startMatch.index)
          }
          const trimmed = clean.trim()
          if (trimmed !== content) {
            return {...msg, content: trimmed}
          }
        }
        return msg
      })
    }, [messages, isStreaming, currentStreamingCleanContent])

    // All artifacts parsed from all assistant messages via useArtifactParser
    const allArtifacts: Artifact[] = useMemo(() => {
      return artifacts
    }, [artifacts])

    const handleSubmit = useCallback(
      (message: string) => {
        onMessageSubmit?.(message)
      },
      [onMessageSubmit]
    )

    const toggleSidebar = useCallback(() => {
      setSidebarCollapsed((prev) => !prev)
    }, [])

    const toggleArtifactsPanel = useCallback(() => {
      setArtifactsPanelOpen((prev) => !prev)
    }, [])

    const isEmpty = messages.length === 0

    return (
      <div
        ref={ref}
        className={cx('flex h-full w-full bg-obsidian overflow-hidden', className)}
        {...rest}
      >
        {/* Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          isCollapsed={sidebarCollapsed}
          onSelectConversation={onSelectConversation}
          onNewChat={onNewChat}
          onToggleCollapse={toggleSidebar}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Empty state with centered input */}
          {isEmpty ? (
            <div className="flex-1 flex items-center justify-center p-4">
              {emptyState || (
                <ChatInput
                  position="centered"
                  placeholder={placeholder}
                  helperText={emptyStateHelper}
                  onSubmit={handleSubmit}
                  disabled={isStreaming}
                />
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <ChatView
                messages={displayMessages}
                latestUserMessageIndex={latestUserMessageIndex}
                isStreaming={isStreaming}
                className="flex-1"
              />

              {/* Input at bottom */}
              <div className="flex-shrink-0 p-4 border-t border-ash/40 bg-obsidian">
                <ChatInput
                  position="bottom"
                  placeholder={placeholder}
                  onSubmit={handleSubmit}
                  disabled={isStreaming}
                />
              </div>
            </>
          )}
        </div>

        {/* Artifacts panel */}
        <ArtifactsPanel
          artifacts={allArtifacts}
          isOpen={artifactsPanelOpen}
          onClose={toggleArtifactsPanel}
          isLoading={isStreaming && hasPendingArtifact}
        />
      </div>
    )
  }
)

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
