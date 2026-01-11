import React, {useCallback, useMemo, useState} from 'react'
import {cx} from '../../utils/cx'
import {ChatView, type ChatViewItem} from './ChatView'
import {type Attachment, ChatInput} from './ChatInput'
import {type Conversation, ConversationSidebar} from './ConversationSidebar'
import {ArtifactsPanel} from './ArtifactsPanel'
import {type Artifact, useArtifactParser} from './hooks/useArtifactParser'
import {type ConversationTree, getActivePathMessages, getSiblingInfo, switchBranch,} from './types'

export interface ChatMessage {
  id: string
  variant: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export interface ChatInterfaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /**
   * Array of messages in the conversation (flat mode)
   * Use this OR conversationTree, not both
   */
  messages?: ChatMessage[]
  /**
   * Conversation tree for branching support
   * Use this OR messages, not both
   */
  conversationTree?: ConversationTree
  /**
   * Called when the conversation tree changes (for tree mode)
   */
  onTreeChange?: (tree: ConversationTree) => void
  /**
   * List of past conversations for the sidebar
   */
  conversations?: Conversation[]
  /**
   * Called when a message is submitted
   */
  onMessageSubmit?: (message: string, attachments?: Attachment[]) => void
  /**
   * Called when a user message is edited (creates a branch)
   */
  onEditMessage?: (messageId: string, newContent: string) => void
  /**
   * Called when an assistant message is retried (creates a branch)
   */
  onRetryMessage?: (messageId: string) => void
  /**
   * Called when Stop button is clicked during streaming
   */
  onStop?: () => void
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
   * Whether to show the thinking indicator (before first response token)
   */
  isThinking?: boolean
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
  /**
   * Whether to show attachment button
   */
  showAttachmentButton?: boolean
  /**
   * Whether to enable message actions (copy, edit, retry)
   */
  enableMessageActions?: boolean
  /**
   * Current attachments for the input
   */
  attachments?: Attachment[]
  /**
   * Called when attachments change in the input
   */
  onAttachmentsChange?: (attachments: Attachment[]) => void
}

/**
 * ChatInterface is the main orchestrator for a full-featured chat experience.
 *
 * Features:
 * - ConversationSidebar (left) — collapsible list of past conversations
 * - ChatView (center) — main conversation area with smart scrolling
 * - ArtifactsPanel (right) — agent-controlled panel for rich content
 * - ChatInput — position-aware input that centers in empty state
 * - Branching — support for conversation tree with branch navigation
 * - Message Actions — copy, edit, retry
 * - Thinking Indicator — shown between user message and response
 */
export const ChatInterface = React.forwardRef<HTMLDivElement, ChatInterfaceProps>(
    (
        {
          messages = [],
          conversationTree,
          onTreeChange,
          conversations = [],
          onMessageSubmit,
          onEditMessage,
          onRetryMessage,
          onStop,
          onSelectConversation,
          onNewChat,
          isStreaming = false,
          isThinking = false,
          placeholder = 'Send a message...',
          emptyStateHelper = 'Type anything to start a conversation',
          initialSidebarCollapsed = false,
          emptyState,
          showAttachmentButton = true,
          enableMessageActions = true,
          attachments: propsAttachments,
          onAttachmentsChange,
          className,
          ...rest
        },
        ref
    ) => {
      const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed)
      const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(false)

      // Determine if we're using tree mode or flat mode
      const isTreeMode = !!conversationTree

      // Get messages from tree or use flat array
      const effectiveMessages: ChatMessage[] = useMemo(() => {
        if (isTreeMode && conversationTree) {
          const pathNodes = getActivePathMessages(conversationTree)
          return pathNodes.map((node) => ({
            id: node.id,
            variant: node.role,
            content: node.content,
            isStreaming: node.isStreaming,
          }))
        }
        return messages
      }, [isTreeMode, conversationTree, messages])

      // Track the latest user message index for scroll anchoring
      const latestUserMessageIndex = useMemo(() => {
        for (let i = effectiveMessages.length - 1; i >= 0; i--) {
          if (effectiveMessages[i].variant === 'user') {
            return i
          }
        }
        return -1
      }, [effectiveMessages])

      // Get all assistant message contents for artifact parsing
      const allAssistantContent = useMemo(() => {
        return effectiveMessages
        .filter((msg) => msg.variant === 'assistant')
        .map((msg) => msg.content)
        .join('\n\n')
      }, [effectiveMessages])

      // Parse artifacts from all assistant messages
      const {artifacts, hasPendingArtifact} = useArtifactParser(allAssistantContent)

      // Get clean content for just the currently streaming message (if any)
      const currentStreamingCleanContent = useMemo(() => {
        if (!isStreaming || effectiveMessages.length === 0) {
          return null
        }
        const lastMessage = effectiveMessages[effectiveMessages.length - 1]
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
      }, [effectiveMessages, isStreaming])

      // Auto-open artifacts panel when artifacts are found (including pending)
      React.useEffect(() => {
        if ((artifacts.length > 0 || hasPendingArtifact) && !artifactsPanelOpen) {
          setArtifactsPanelOpen(true)
        }
      }, [artifacts.length, hasPendingArtifact, artifactsPanelOpen])

      // Handle branch switching
      const handleBranchSwitch = useCallback(
          (nodeId: string, direction: 'prev' | 'next') => {
            if (!isTreeMode || !conversationTree || !onTreeChange) {
              return
            }
            const newTree = switchBranch(conversationTree, nodeId, direction)
            onTreeChange(newTree)
          },
          [isTreeMode, conversationTree, onTreeChange]
      )

      // Build the messages array with cleaned content (artifact syntax stripped)
      const displayMessages: ChatViewItem[] = useMemo(() => {
        return effectiveMessages.map((msg, idx) => {
          let cleanContent = msg.content

          if (msg.variant === 'assistant') {
            // For the currently streaming message, use the streaming-specific clean content
            if (isStreaming && idx === effectiveMessages.length - 1 && currentStreamingCleanContent
                !== null) {
              cleanContent = currentStreamingCleanContent
            } else {
              // For completed assistant messages, strip artifact syntax
              let clean = msg.content.replace(/:::artifact\{[^}]+\}(?:[^:]*?)?:::/gs, '')
              const startMatch = clean.match(/:::artifact\{/)
              if (startMatch && startMatch.index !== undefined) {
                clean = clean.substring(0, startMatch.index)
              }
              cleanContent = clean.trim()
            }
          }

          // Get branch info if in tree mode
          let branchInfo = undefined
          if (isTreeMode && conversationTree) {
            const siblingInfo = getSiblingInfo(conversationTree, msg.id)
            if (siblingInfo.total > 1) {
              branchInfo = {
                current: siblingInfo.current,
                total: siblingInfo.total,
                onPrevious: () => handleBranchSwitch(msg.id, 'prev'),
                onNext: () => handleBranchSwitch(msg.id, 'next'),
              }
            }
          }

          // Build actions config
          const actions = enableMessageActions
              ? {
                showCopy: true,
                onEdit: msg.variant === 'user' && onEditMessage
                    ? (newContent: string) => onEditMessage(msg.id, newContent)
                    : undefined,
                onRetry: msg.variant === 'assistant' && onRetryMessage
                    ? () => onRetryMessage(msg.id)
                    : undefined,
              }
              : undefined

          return {
            ...msg,
            content: cleanContent,
            branchInfo,
            actions,
          }
        })
      }, [effectiveMessages, isStreaming, currentStreamingCleanContent, isTreeMode,
        conversationTree, enableMessageActions, onEditMessage, onRetryMessage, handleBranchSwitch])

      // All artifacts parsed from all assistant messages via useArtifactParser
      const allArtifacts: Artifact[] = useMemo(() => {
        return artifacts
      }, [artifacts])

      const handleSubmit = useCallback(
          (message: string, attachments?: Attachment[]) => {
            onMessageSubmit?.(message, attachments)
          },
          [onMessageSubmit]
      )

      const toggleSidebar = useCallback(() => {
        setSidebarCollapsed((prev) => !prev)
      }, [])

      const toggleArtifactsPanel = useCallback(() => {
        setArtifactsPanelOpen((prev) => !prev)
      }, [])

      const isEmpty = effectiveMessages.length === 0

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
                            showAttachmentButton={showAttachmentButton}
                            attachments={propsAttachments}
                            onAttachmentsChange={onAttachmentsChange}
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
                        isThinking={isThinking}
                        className="flex-1"
                    />

                    {/* Input at bottom */}
                    <div className="flex-shrink-0 p-4 border-t border-ash/40 bg-obsidian">
                      <ChatInput
                          position="bottom"
                          placeholder={placeholder}
                          onSubmit={handleSubmit}
                          disabled={isStreaming && !onStop}
                          isStreaming={isStreaming}
                          onStop={onStop}
                          showAttachmentButton={showAttachmentButton}
                          attachments={propsAttachments}
                          onAttachmentsChange={onAttachmentsChange}
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
