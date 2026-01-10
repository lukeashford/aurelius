import React, {useState, useCallback, useMemo} from 'react'
import {cx} from '../../utils/cx'
import {ChatView, type ChatViewItem} from './ChatView'
import {ChatInput} from './ChatInput'
import {ConversationSidebar, type Conversation} from './ConversationSidebar'
import {ArtifactsPanel, ArtifactsPanelToggle} from './ArtifactsPanel'
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

    // Get the current streaming content (last assistant message if streaming)
    const currentStreamingContent = useMemo(() => {
      if (!isStreaming || messages.length === 0) return ''
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.variant === 'assistant') {
        return lastMessage.content
      }
      return ''
    }, [messages, isStreaming])

    // Parse artifacts from the current streaming content
    const {cleanContent, artifacts, hasPendingArtifact} = useArtifactParser(currentStreamingContent)

    // Auto-open artifacts panel when artifacts are found (including pending)
    React.useEffect(() => {
      if ((artifacts.length > 0 || hasPendingArtifact) && !artifactsPanelOpen) {
        setArtifactsPanelOpen(true)
      }
    }, [artifacts.length, hasPendingArtifact, artifactsPanelOpen])

    // Build the messages array with cleaned content for the streaming message
    const displayMessages: ChatViewItem[] = useMemo(() => {
      return messages.map((msg, idx) => {
        // If this is the streaming assistant message, use cleaned content
        if (
          isStreaming &&
          idx === messages.length - 1 &&
          msg.variant === 'assistant' &&
          cleanContent !== msg.content
        ) {
          return {
            ...msg,
            content: cleanContent || msg.content,
          }
        }
        return msg
      })
    }, [messages, isStreaming, cleanContent])

    // All artifacts from all assistant messages (for now, just current streaming)
    const allArtifacts: Artifact[] = useMemo(() => {
      // In a real implementation, you'd collect artifacts from all messages
      // For demo purposes, we just use the current streaming artifacts
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
          {/* Collapsed artifacts panel toggle */}
          {!artifactsPanelOpen && allArtifacts.length > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <ArtifactsPanelToggle
                artifactCount={allArtifacts.length}
                onExpand={toggleArtifactsPanel}
              />
            </div>
          )}

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
          isLoading={isStreaming && allArtifacts.length > 0}
        />
      </div>
    )
  }
)

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
