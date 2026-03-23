import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {cx} from '../../utils'
import {ChatView, type ChatViewItem} from './ChatView'
import {type Attachment, ChatInput} from './ChatInput'
import {type Conversation, ConversationSidebar} from './ConversationSidebar'
import {ArtifactsPanel} from './ArtifactsPanel'
import {type Task, TodosList, areAllTasksSettled} from './TodosList'
import {ToolSidebar, type ToolDefinition, type ToolPanelState} from './ToolSidebar'
import {ToolPanelContainer} from './ToolPanelContainer'
import type {Artifact} from './hooks'
import {useResizable} from './hooks'
import type {ArtifactNode} from '../ArtifactNode'
import {type ConversationTree, getActivePathMessages, getSiblingInfo, switchBranch} from './types'
import {HistoryIcon, MediaIcon, CheckSquareIcon, SquareLoaderIcon} from '../icons'

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
   * Top-level artifact tree nodes for tree-aware navigation.
   * When provided, the panel renders a navigable tree instead of a flat list.
   */
  artifactNodes?: ArtifactNode[]
  /**
   * Whether the artifacts panel is currently open (controlled).
   * When set, maps to the tool panel system — opens the artifacts tool.
   */
  isArtifactsPanelOpen?: boolean
  /**
   * Called when the artifacts panel is opened or closed (controlled).
   */
  onArtifactsPanelOpenChange?: (open: boolean) => void
  /**
   * Tasks to display in the todos list tool panel.
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
 * - Tool panel system (right) — IntelliJ-style tool sidebar with:
 *   - Top group: Chat History, Artifacts Panel (mutually exclusive)
 *   - Bottom group: Todo List
 *   - Vertical split with draggable divider when both groups are active
 *   - Width-resizable tool content area
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
          emptyStateHelper = "Let's talk.",
          initialSidebarCollapsed = false,
          emptyState,
          showAttachmentButton = true,
          enableMessageActions = true,
          attachments: propsAttachments,
          onAttachmentsChange,
          artifacts = [],
          artifactNodes,
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
      const prevArtifactsRef = useRef<Artifact[]>([])
      const prevTasksRef = useRef<Task[]>([])

      // ── Tool panel state ──────────────────────────────────────────
      const [internalTools, setInternalTools] = useState<ToolPanelState>({
        top: null,
        bottom: null,
      })

      // Controlled vs uncontrolled: isArtifactsPanelOpen maps to the tool system
      const isPanelControlled = isArtifactsPanelOpen !== undefined

      // Derive effective tool state
      const activeTools: ToolPanelState = useMemo(() => {
        if (isPanelControlled) {
          return {
            top: isArtifactsPanelOpen ? 'artifacts' : internalTools.top,
            bottom: internalTools.bottom,
          }
        }
        return internalTools
      }, [isPanelControlled, isArtifactsPanelOpen, internalTools])

      const isAnyToolOpen = activeTools.top !== null || activeTools.bottom !== null

      // ── Resizable panels ──────────────────────────────────────────
      const {
        width: sidebarWidth,
        startResizing: startResizingSidebar
      } = useResizable({
        initialWidthPercent: 15,
        minWidthPercent: 12,
        maxWidthPercent: 25,
        direction: 'right'
      })

      const {
        width: toolsWidth,
        widthPercent: toolsWidthPercent,
        startResizing: startResizingTools
      } = useResizable({
        initialWidthPercent: 50,
        minWidthPercent: 25,
        maxWidthPercent: 70,
        direction: 'left'
      })

      // ── Toggle a tool ─────────────────────────────────────────────
      const toggleTool = useCallback((toolId: string) => {
        // Find the tool's group
        const toolDef = TOOL_DEFINITIONS.find(t => t.id === toolId)
        if (!toolDef) return

        const group = toolDef.group

        // Special case: controlled artifacts panel
        if (toolId === 'artifacts' && isPanelControlled) {
          const isCurrentlyOpen = activeTools.top === 'artifacts'
          onArtifactsPanelOpenChange?.(!isCurrentlyOpen)
          return
        }

        setInternalTools(prev => {
          const isCurrentlyOpen = prev[group] === toolId
          return {
            ...prev,
            [group]: isCurrentlyOpen ? null : toolId,
          }
        })
      }, [isPanelControlled, activeTools.top, onArtifactsPanelOpenChange])

      // ── Messages ──────────────────────────────────────────────────
      const isTreeMode = !!conversationTree

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

      const latestUserMessageIndex = useMemo(() => {
        for (let i = effectiveMessages.length - 1; i >= 0; i--) {
          if (effectiveMessages[i].variant === 'user') return i
        }
        return -1
      }, [effectiveMessages])

      // ── Auto-open tools when data arrives (uncontrolled mode) ─────
      useEffect(() => {
        const hasNewOrSignificantArtifact = artifacts.some(a => {
          const p = prevArtifactsRef.current.find(prev => prev.id === a.id)
          if (!p) return true
          if (p.isPending && !a.isPending) return true
          if (p.title !== a.title || p.type !== a.type) return true
          return false
        })

        const hasNodes = artifactNodes && artifactNodes.length > 0

        if (!isPanelControlled && (hasNewOrSignificantArtifact || hasNodes)) {
          setInternalTools(prev => ({...prev, top: 'artifacts'}))
        }

        const hasNewOrUpdatedTask = (curr: Task[], prev: Task[]): boolean => {
          return curr.some(c => {
            const p = prev.find(x => x.id === c.id)
            if (!p) return true
            if (c.status !== p.status || c.label !== p.label) return true
            if (c.subtasks && hasNewOrUpdatedTask(c.subtasks, p?.subtasks || [])) return true
            return false
          })
        }

        if (hasNewOrUpdatedTask(tasks, prevTasksRef.current)) {
          setInternalTools(prev => ({...prev, bottom: 'todos'}))
        }

        prevArtifactsRef.current = artifacts
        prevTasksRef.current = tasks
      }, [artifacts, artifactNodes, tasks, isPanelControlled])

      // ── Branch switching ──────────────────────────────────────────
      const handleBranchSwitch = useCallback(
          (nodeId: string, direction: 'prev' | 'next') => {
            if (!isTreeMode || !conversationTree || !onTreeChange) return
            const newTree = switchBranch(conversationTree, nodeId, direction)
            onTreeChange(newTree)
          },
          [isTreeMode, conversationTree, onTreeChange]
      )

      // ── Display messages ──────────────────────────────────────────
      const displayMessages: ChatViewItem[] = useMemo(() => {
        return effectiveMessages.map((msg) => {
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

          return {...msg, branchInfo, actions}
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
        setSidebarCollapsed(prev => !prev)
      }, [])

      const isEmpty = effectiveMessages.length === 0

      // ── Tool definitions ──────────────────────────────────────────
      const allSettled = tasks.length === 0 || areAllTasksSettled(tasks)

      const toolDefinitions: ToolDefinition[] = useMemo(() => [
        {
          id: 'history',
          icon: <HistoryIcon/>,
          label: 'Chat History',
          group: 'top' as const,
        },
        {
          id: 'artifacts',
          icon: <MediaIcon/>,
          label: 'Artifacts',
          group: 'top' as const,
        },
        {
          id: 'todos',
          icon: allSettled ? <CheckSquareIcon/> : <SquareLoaderIcon/>,
          label: 'Tasks',
          group: 'bottom' as const,
        },
      ], [allSettled])

      // ── Render tool content for a given slot ──────────────────────
      const renderToolContent = (toolId: string | null) => {
        if (!toolId) return null

        switch (toolId) {
          case 'history':
            return (
                <div className="h-full flex flex-col">
                  <div className="flex items-center p-4 border-b border-ash/40 shrink-0">
                    <h3 className="text-sm font-semibold text-white">Chat History</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <p className="text-xs text-silver/60 text-center py-8">
                      History view coming soon
                    </p>
                  </div>
                </div>
            )

          case 'artifacts':
            return (
                <ArtifactsPanel
                    artifacts={artifacts}
                    nodes={artifactNodes}
                    widthPercent={toolsWidthPercent}
                    className="h-full"
                />
            )

          case 'todos':
            return tasks.length > 0
                ? <TodosList tasks={tasks} title={tasksTitle} className="h-full"/>
                : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center p-4 border-b border-ash/40 shrink-0">
                        <h3 className="text-xs font-medium text-white">Tasks</h3>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-xs text-silver/60">No tasks</p>
                      </div>
                    </div>
                )

          default:
            return null
        }
      }

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
                    "transition-all duration-500 ease-in-out z-10 w-full flex flex-col items-center",
                    isEmpty ? "p-4" : "shrink-0 p-4 border-t border-ash/40 bg-obsidian"
                )}>
                  {isEmpty && (
                      <div className="mb-8 text-center animate-fade-in duration-500">
                        {emptyState ? (
                            emptyState
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-heading text-gold mb-2 tracking-tight">
                              Welcome!
                            </h1>
                        )}
                      </div>
                  )}

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
                </div>

                {/* Bottom spacer for centering in empty state */}
                <div className={cx(
                    "transition-all duration-500 ease-in-out",
                    isEmpty ? "flex-1" : "flex-zero"
                )}/>
              </div>
            </div>

            {/* Right panel: Tool content + Tool sidebar */}
            {isAnyToolOpen && (
                <ToolPanelContainer
                    topContent={renderToolContent(activeTools.top)}
                    bottomContent={renderToolContent(activeTools.bottom)}
                    width={toolsWidth}
                    onResizeStart={startResizingTools}
                />
            )}

            <ToolSidebar
                tools={toolDefinitions}
                activeTools={activeTools}
                onToggleTool={toggleTool}
                isAnyToolOpen={isAnyToolOpen}
            />
          </div>
      )
    }
)

ChatInterface.displayName = 'ChatInterface'

// Static tool definitions used for group lookup in toggleTool
const TOOL_DEFINITIONS: ToolDefinition[] = [
  {id: 'history', icon: null, label: 'Chat History', group: 'top'},
  {id: 'artifacts', icon: null, label: 'Artifacts', group: 'top'},
  {id: 'todos', icon: null, label: 'Tasks', group: 'bottom'},
]
