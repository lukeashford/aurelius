import React, {useCallback, useMemo, useState} from 'react'
import {cx} from '../../utils'
import {ChatView, type ChatViewItem} from './ChatView'
import {type Attachment, ChatInput} from './ChatInput'
import {type Conversation, ConversationSidebar} from './ConversationSidebar'
import {ArtifactsPanel} from './ArtifactsPanel'
import {TodosList, type Task} from './TodosList'
import type {Artifact} from './hooks'
import {type ConversationTree, getActivePathMessages, getSiblingInfo, switchBranch,} from './types'
import {useResizable} from "./hooks/useResizable";

export interface ChatMessage {
  /**
   * Unique identifier for the message
   */
  id: string
  /**
   * Whether the message is from the user or the assistant
   */
  variant: 'user' | 'assistant'
  /**
   * Message content (Markdown supported)
   */
  content: string
  /**
   * Whether the message is currently streaming
   */
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
   * Called when a message is submitted from the input.
   * Provides the text content and any files attached.
   */
  onMessageSubmit?: (message: string, attachments?: Attachment[]) => void
  /**
   * Called when a user message is edited.
   * In tree mode, this creates a new branch.
   */
  onEditMessage?: (messageId: string, newContent: string) => void
  /**
   * Called when an assistant message is retried.
   * In tree mode, this creates a new branch.
   */
  onRetryMessage?: (messageId: string) => void
  /**
   * Called when the Stop button is clicked during assistant streaming.
   */
  onStop?: () => void
  /**
   * Called when a conversation is selected from the sidebar.
   */
  onSelectConversation?: (id: string) => void
  /**
   * Called when the "New Chat" button is clicked in the sidebar.
   */
  onNewChat?: () => void
  /**
   * Whether the assistant is currently streaming a response.
   * Shows a stop button and disables certain actions.
   */
  isStreaming?: boolean
  /**
   * Whether to show the thinking indicator.
   * Typically shown after a user message but before the first streaming token.
   */
  isThinking?: boolean
  /**
   * Placeholder text for the main chat input.
   */
  placeholder?: string
  /**
   * Helper text shown in the empty state (when there are no messages).
   */
  emptyStateHelper?: React.ReactNode
  /**
   * Whether the sidebar should be initially collapsed.
   */
  initialSidebarCollapsed?: boolean
  /**
   * Custom content to show when the conversation is empty.
   * Overrides the default centered input and helper text.
   */
  emptyState?: React.ReactNode
  /**
   * Whether to show the attachment (paperclip) button in the input.
   */
  showAttachmentButton?: boolean
  /**
   * Whether to enable message-level actions (copy, edit, retry).
   */
  enableMessageActions?: boolean
  /**
   * Current attachments for the chat input (controlled).
   */
  attachments?: Attachment[]
  /**
   * Called when attachments are added or removed in the chat input.
   */
  onAttachmentsChange?: (attachments: Attachment[]) => void
  /**
   * Artifacts to display in the side panel.
   * Best managed via the useArtifacts hook and passed here.
   */
  artifacts?: Artifact[]
  /**
   * Whether the artifacts panel is currently open (controlled).
   */
  isArtifactsPanelOpen?: boolean
  /**
   * Called when the artifacts panel is opened or closed (controlled).
   */
  onArtifactsPanelOpenChange?: (open: boolean) => void
  /**
   * Tasks to display in the todos list below the artifacts panel.
   * Shows a list of tasks with status indicators.
   */
  tasks?: Task[]
  /**
   * Title for the todos list
   * @default "Tasks"
   */
  tasksTitle?: string
}

/**
 * ChatInterface is the main orchestrator for a full-featured chat experience.
 *
 * Features:
 * - ConversationSidebar (left) — collapsible list of past conversations
 * - ChatView (center) — main conversation area with smart scrolling
 * - ArtifactsPanel (right) — controlled via useArtifacts hook
 * - ChatInput — position-aware input that centers in empty state
 * - Branching — support for conversation tree with branch navigation
 * - Message Actions — copy, edit, retry
 * - Thinking Indicator — shown between user message and response
 *
 * Artifacts are controlled externally via the useArtifacts hook:
 * - scheduleArtifact() — adds artifact with loading skeleton
 * - showArtifact() — reveals artifact content
 * - removeArtifact() — removes artifact on failure
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
          artifacts = [],
          isArtifactsPanelOpen,
          onArtifactsPanelOpenChange,
          tasks = [],
          tasksTitle,
          className,
          ...rest
        },
        ref
    ) => {
      const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed)
      const [internalPanelOpen, setInternalPanelOpen] = useState(false)

      const {
        width: sidebarWidth,
        startResizing: startResizingSidebar
      } = useResizable({
        initialWidth: 256, // w-64
        minWidth: 200,
        maxWidth: 500,
        direction: 'right'
      })

      const {
        width: artifactsWidth,
        startResizing: startResizingArtifacts
      } = useResizable({
        initialWidth: 384, // w-96
        minWidth: 300,
        maxWidth: 1200,
        direction: 'left'
      })

      // Controlled vs uncontrolled artifacts panel
      const isPanelControlled = isArtifactsPanelOpen !== undefined
      const artifactsPanelOpen = isPanelControlled ? isArtifactsPanelOpen : internalPanelOpen

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

      // Check if any artifact is pending (for loading state)
      const hasPendingArtifact = useMemo(() => {
        return artifacts.some((a) => a.isPending)
      }, [artifacts])

      // Auto-open artifacts panel when artifacts are added (uncontrolled mode only)
      React.useEffect(() => {
        if (!isPanelControlled && artifacts.length > 0) {
          setInternalPanelOpen(true)
        }
      }, [artifacts.length, isPanelControlled])

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

      // Build the messages array for display
      const displayMessages: ChatViewItem[] = useMemo(() => {
        return effectiveMessages.map((msg) => {
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
            branchInfo,
            actions,
          }
        })
      }, [effectiveMessages, isTreeMode, conversationTree, enableMessageActions,
        onEditMessage, onRetryMessage, handleBranchSwitch])

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
        if (isPanelControlled) {
          onArtifactsPanelOpenChange?.(!artifactsPanelOpen)
        } else {
          setInternalPanelOpen((prev) => !prev)
        }
      }, [isPanelControlled, artifactsPanelOpen, onArtifactsPanelOpenChange])

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
                width={sidebarWidth}
                onResizeStart={startResizingSidebar}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
              <div className={cx(
                  "flex-1 flex flex-col min-h-0 relative",
                  isEmpty ? "justify-center" : "justify-start"
              )}>
                {/* Top spacer for centering in empty state */}
                <div className={cx(
                    "transition-all duration-500 ease-in-out",
                    isEmpty ? "flex-1" : "flex-zero"
                )}/>

                {/* Messages Area */}
                <div className={cx(
                    "transition-all duration-500 ease-in-out overflow-hidden flex flex-col",
                    isEmpty ? "flex-zero opacity-0" : "flex-1 opacity-100"
                )}>
                  <ChatView
                      messages={displayMessages}
                      latestUserMessageIndex={latestUserMessageIndex}
                      isStreaming={isStreaming}
                      isThinking={isThinking}
                      className="flex-1"
                  />
                </div>

                {/* Input Area */}
                <div className={cx(
                    "transition-all duration-500 ease-in-out z-10 w-full",
                    isEmpty ? "p-4" : "shrink-0 p-4 border-t border-ash/40 bg-obsidian"
                )}>
                  {isEmpty && emptyState ? (
                      <div className="flex justify-center">
                        {emptyState}
                      </div>
                  ) : (
                      <ChatInput
                          position={isEmpty ? "centered" : "bottom"}
                          placeholder={placeholder}
                          helperText={isEmpty ? emptyStateHelper : undefined}
                          onSubmit={handleSubmit}
                          disabled={isEmpty ? isStreaming : (isStreaming && !onStop)}
                          isStreaming={isStreaming}
                          onStop={onStop}
                          showAttachmentButton={showAttachmentButton}
                          attachments={propsAttachments}
                          onAttachmentsChange={onAttachmentsChange}
                      />
                  )}
                </div>

                {/* Bottom spacer for centering in empty state */}
                <div className={cx(
                    "transition-all duration-500 ease-in-out",
                    isEmpty ? "flex-1" : "flex-zero"
                )}/>
              </div>
            </div>

            {/* Right panel: Artifacts and Tasks */}
            <div className="h-full flex flex-col flex-shrink-0">
              {/* Artifacts panel - takes remaining space */}
              <div className="flex-1 min-h-0">
                <ArtifactsPanel
                    artifacts={artifacts}
                    isOpen={artifactsPanelOpen}
                    onClose={toggleArtifactsPanel}
                    isLoading={isStreaming && hasPendingArtifact}
                    width={artifactsWidth}
                    onResizeStart={startResizingArtifacts}
                    className="h-full"
                />
              </div>

              {/* Tasks list - below artifacts, max 1/4 screen height */}
              {tasks.length > 0 && artifactsPanelOpen && (
                <TodosList
                    tasks={tasks}
                    title={tasksTitle}
                    style={{width: artifactsWidth ? `${artifactsWidth}px` : undefined}}
                />
              )}
            </div>
          </div>
      )
    }
)

ChatInterface.displayName = 'ChatInterface'
