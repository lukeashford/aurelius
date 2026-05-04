import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {cx} from '../../utils'
import {ChatView, type ChatViewItem} from './ChatView'
import {ChatInput, type ChatInputNotice} from './ChatInput'

import {ArtifactsPanel} from './ArtifactsPanel'
import {HistoryPanel} from './HistoryPanel'
import {areAllTasksSettled, type Task, TodosList} from './TodosList'
import {
  type ExternalToolDefinition,
  type ToolDefinition,
  type ToolPanelState,
  ToolSidebar
} from './ToolSidebar'
import {ToolPanelContainer} from './ToolPanelContainer'
import {type Artifact, useResizable} from './hooks'
import type {ArtifactNode} from '../ArtifactNode'
import {
  type Attachment,
  type ChatNode,
  type CheckpointNode,
  type ConversationTree,
  type MessageNode,
  type TreeNode,
} from './types'
import {
  findAncestor,
  getActivePath,
  getGreyedFuture,
  getSiblingInfo,
  setActiveLeaf,
  switchBranch,
} from './tree'
import {ChatBubbleIcon, CheckSquareIcon, MediaIcon, SquareLoaderIcon} from '../icons'

export interface Conversation {
  /**
   * Unique identifier for the conversation
   */
  id: string
  /**
   * Title shown as the first line of the row. Editable via the rename affordance.
   */
  title: string
  /**
   * Project this conversation belongs to. Shown as the second line of the row and
   * collected into the project filter in the history panel.
   */
  project?: string
  /**
   * Timestamp used to group conversations into Today / Yesterday / Older.
   * Accepts a Date, ISO string, or millisecond epoch. Not displayed.
   */
  timestamp?: string | number | Date
  /**
   * Whether this conversation is currently active (highlighted in the list).
   */
  isActive?: boolean
}

export interface ChatInterfaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /**
   * Array of messages in the conversation (flat mode)
   * Use this OR conversationTree, not both
   */
  messages?: MessageNode[]
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
   * Called when the user clicks a non-active node — checkpoint or message —
   * to move the active leaf there. Receives the node id; the consumer should
   * move the active leaf without forking so the artifacts panel and chat
   * re-anchor. Mirrors the per-component `onJumpHere`. In tree mode only.
   */
  onJumpHere?: (nodeId: string) => void
  /**
   * Called when the user clicks "Jump to latest" on the greyed-future divider
   * or otherwise asks to return to the deepest leaf they had reached.
   * In tree mode only.
   */
  onJumpToLatest?: () => void
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
   * Called when a conversation's title is renamed from the history panel.
   * Receives the conversation id and the new, trimmed title.
   */
  onRenameConversation?: (id: string, newTitle: string) => void
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
   * Optional verbatim label for the thinking indicator. When set, the indicator
   * suppresses its rotating phrases and renders this string as-is. Use for
   * domain-specific waits like "Analyzing uploads..." — any animated suffix
   * (e.g. cycling dots) is the caller's responsibility.
   */
  thinkingLabel?: string
  /**
   * Placeholder text for the main chat input.
   */
  placeholder?: string
  /**
   * Helper text shown in the empty state (when there are no messages).
   */
  emptyStateHelper?: React.ReactNode
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
   * Called when an attachment is removed by the user (clicking the "x")
   */
  onAttachmentRemove?: (attachment: Attachment) => void
  /**
   * Called when a chip above a sent message is clicked. Receives the
   * `artifactId` carried by the chip; wire to open the artifact-card modal.
   * Without this, above-message chips are not clickable.
   */
  onAttachmentOpen?: (artifactId: string) => void
  /**
   * Top-level artifact tree nodes for the artifacts panel.
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
   * Resolves the floating action cluster shown over the artifact lightbox.
   * The host switches on `artifact.type` and returns the right buttons for
   * that kind (e.g. Share + Download for deliverables, Download for images).
   * Aurelius ships the close affordance itself; return only the kind-specific
   * actions, or `null` when none. Use `ctx.onClose` to dismiss the lightbox
   * after a successful operation.
   */
  getArtifactActions?: (
      artifact: Artifact,
      ctx: {onClose: () => void},
  ) => React.ReactNode
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
  /**
   * Called when the "Stop All Tasks" button is clicked in the tasks panel.
   * Only shown when at least one task has in_progress status.
   * The consumer app decides what stopping means (cancel API calls, mark tasks cancelled, etc.).
   *
   * May return a Promise. While the Promise is pending, the button becomes
   * disabled and displays a spinner with "Stopping tasks" so the user knows
   * the stop request is in flight.
   */
  onStopAllTasks?: () => void | Promise<void>
  /**
   * Optional notice displayed above the chat input (e.g. credit warnings or exhaustion messages).
   * Pass `{ variant: 'warning', content: '...', dismissible: true, onDismiss: () => ... }` for
   * soft warnings, or `{ variant: 'error', content: <ReactNode> }` for hard blocks.
   */
  inputNotice?: ChatInputNotice
  /**
   * Called whenever the chat input value changes, giving the consumer access to the current text.
   */
  onInputChange?: (value: string) => void
  /**
   * Initial value for the input, used for state restoration (e.g. from DB or localStorage)
   */
  initialInputValue?: string
  /**
   * Additional tools to add to the tool sidebars. Each ExternalToolDefinition provides
   * an id, icon, label, group ('top-left' | 'bottom-left' | 'top-right' | 'bottom-right'),
   * and content (ReactNode) to render when opened. Tools in the same group are mutually
   * exclusive. Built-in tools occupy: History (top-left), Artifacts (top-right), Tasks
   * (bottom-right). Consumer tools are added alongside these.
   */
  tools?: ExternalToolDefinition[]
  /**
   * Whether to automatically focus the chat input when it becomes enabled.
   * Defaults to true.
   */
  autoFocus?: boolean
  /**
   * Forwarded to the underlying chat-input `<textarea>`. Use to drive an
   * inline autocomplete (e.g. an `@`-mention picker) — read selection/caret
   * position, mirror the textarea for caret coordinates, or imperatively
   * update its value.
   */
  textareaRef?: React.Ref<HTMLTextAreaElement>
  /**
   * Forwarded to the underlying chat-input. Runs before the input's own
   * keydown handling; calling `e.preventDefault()` opts that event out of
   * default behaviour (submit-on-Enter, newline) — typical use is to claim
   * Arrow / Enter / Escape while an autocomplete panel is open.
   */
  onTextareaKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

/**
 * ChatInterface is the main orchestrator for a full-featured chat experience.
 *
 * Features:
 * - ChatView (center) — main conversation area with smart scrolling
 * - Dual tool sidebar system — IntelliJ-style tool sidebars on left and right:
 *   - Left sidebar: History (top-left, conversation list + new chat) + consumer tools (bottom-left)
 *   - Right sidebar: Artifacts (top-right) + Tasks (bottom-right) + consumer tools
 *   - Tools in the same group are mutually exclusive
 *   - Both panels can be open simultaneously — chat area shrinks to accommodate
 *   - Each panel is independently width-resizable
 *   - Vertical split with draggable divider when both slots in a panel are active
 * - Consumer tools via `tools` prop — provide icon, label, group, and content
 * - ChatInput — position-aware input that centers in empty state
 * - Branching — support for conversation tree with branch navigation
 * - Message Actions — copy, edit, retry
 * - Thinking Indicator — shown between user message and response
 *
 * Artifacts are supplied as a tree of ArtifactNode objects via the
 * artifactNodes prop.
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
          onJumpHere,
          onJumpToLatest,
          onStop,
          onSelectConversation,
          onNewChat,
          onRenameConversation,
          isStreaming = false,
          isThinking = false,
          thinkingLabel,
          placeholder = 'Send a message...',
          emptyStateHelper = "Let's talk.",
          emptyState,
          showAttachmentButton = true,
          enableMessageActions = true,
          attachments: propsAttachments,
          onAttachmentsChange,
          onAttachmentRemove,
          onAttachmentOpen,
          artifactNodes,
          isArtifactsPanelOpen,
          onArtifactsPanelOpenChange,
          getArtifactActions,
          tasks = [],
          tasksTitle,
          onStopAllTasks,
          inputNotice,
          onInputChange,
          initialInputValue = '',
          tools: externalTools = [],
          autoFocus = true,
          textareaRef,
          onTextareaKeyDown,
          className,
          ...rest
        },
        ref
    ) => {
      const prevArtifactNodesRef = useRef<ArtifactNode[]>([])
      const prevTasksRef = useRef<Task[]>([])

      // Drives the artifacts-panel modal when the user clicks an above-message
      // chip. Round-trips with `onArtifactClosed` so re-clicking the same chip
      // after a manual dismiss reopens the modal.
      const [panelOpenArtifactId, setPanelOpenArtifactId] = useState<string | null>(null)

      const handleAttachmentOpen = useCallback((artifactId: string) => {
        setPanelOpenArtifactId(artifactId)
        onAttachmentOpen?.(artifactId)
      }, [onAttachmentOpen])

      const handleArtifactPanelClosed = useCallback(() => {
        setPanelOpenArtifactId(null)
      }, [])

      // ── Tool panel state ──────────────────────────────────────────
      const [internalTools, setInternalTools] = useState<ToolPanelState>({
        'top-left': 'history',
        'bottom-left': null,
        'top-right': null,
        'bottom-right': null,
      })

      // Track tools the user has actively dismissed — auto-open won't reopen these
      const dismissedToolsRef = useRef<Set<string>>(new Set())

      // Controlled vs uncontrolled: isArtifactsPanelOpen maps to the tool system
      const isPanelControlled = isArtifactsPanelOpen !== undefined

      // Derive effective tool state
      const activeTools: ToolPanelState = useMemo(() => {
        if (isPanelControlled) {
          return {
            ...internalTools,
            'top-right': isArtifactsPanelOpen ? 'artifacts' : internalTools['top-right'],
          }
        }
        return internalTools
      }, [isPanelControlled, isArtifactsPanelOpen, internalTools])

      const isLeftPanelOpen = activeTools['top-left'] !== null || activeTools['bottom-left']
          !== null
      const isRightPanelOpen = activeTools['top-right'] !== null || activeTools['bottom-right']
          !== null

      // ── Resizable panels ──────────────────────────────────────────
      const {
        width: rightToolsWidth,
        startResizing: startResizingRightTools
      } = useResizable({
        initialWidthPercent: 40,
        minWidthPercent: 30,
        maxWidthPercent: 80,
        direction: 'left'
      })

      const {
        width: leftToolsWidth,
        startResizing: startResizingLeftTools
      } = useResizable({
        initialWidthPercent: 25,
        minWidthPercent: 15,
        maxWidthPercent: 40,
        direction: 'right'
      })

      // ── Tool definitions ──────────────────────────────────────────
      const allSettled = tasks.length === 0 || areAllTasksSettled(tasks)

      // ── Merged tool definitions (built-in + external) ──────────────
      const allToolDefinitions: ToolDefinition[] = useMemo(() => {
        const builtIn: ToolDefinition[] = [
          {id: 'history', icon: <ChatBubbleIcon/>, label: 'History', group: 'top-left'},
          {id: 'artifacts', icon: <MediaIcon/>, label: 'Artifacts', group: 'top-right'},
          {
            id: 'todos',
            icon: allSettled ? <CheckSquareIcon/> : <SquareLoaderIcon/>,
            label: 'Tasks',
            group: 'bottom-right',
          },
        ]
        const external: ToolDefinition[] = externalTools.map(({content: _content, ...def}) => def)
        return [...builtIn, ...external]
      }, [allSettled, externalTools])

      // ── Toggle a tool ─────────────────────────────────────────────
      const toggleTool = useCallback((toolId: string) => {
        // Find the tool's group
        const toolDef = allToolDefinitions.find(t => t.id === toolId)
        if (!toolDef) {
          return
        }

        const group = toolDef.group

        // Special case: controlled artifacts panel
        if (toolId === 'artifacts' && isPanelControlled) {
          const isCurrentlyOpen = activeTools['top-right'] === 'artifacts'
          if (isCurrentlyOpen) {
            dismissedToolsRef.current.add('artifacts')
          } else {
            dismissedToolsRef.current.delete('artifacts')
          }
          onArtifactsPanelOpenChange?.(!isCurrentlyOpen)
          return
        }

        setInternalTools(prev => {
          const isCurrentlyOpen = prev[group] === toolId
          if (isCurrentlyOpen) {
            dismissedToolsRef.current.add(toolId)
          } else {
            dismissedToolsRef.current.delete(toolId)
          }
          return {
            ...prev,
            [group]: isCurrentlyOpen ? null : toolId,
          }
        })
      }, [allToolDefinitions, isPanelControlled, activeTools, onArtifactsPanelOpenChange])

      // ── Tree → rows ───────────────────────────────────────────────
      const isTreeMode = !!conversationTree

      const tree = isTreeMode
          ? (conversationTree as ConversationTree<ChatNode>)
          : null

      /** Active path nodes (root → active leaf), heterogeneous (messages + checkpoints). */
      const activePath: TreeNode<ChatNode>[] = useMemo(() => {
        if (tree) return getActivePath(tree)
        // Flat-array fallback: lift each MessageNode into a TreeNode<ChatNode> shape.
        return (messages || []).map(m => ({...m, children: [], branchIndex: 0}))
      }, [tree, messages])

      /** Greyed-future nodes (between active leaf and the previously-active deepest leaf). */
      const greyedFuture: TreeNode<ChatNode>[] = useMemo(
          () => (tree ? getGreyedFuture(tree) : []),
          [tree],
      )

      /**
       * The checkpoint currently driving the artifacts panel — the nearest
       * ancestor of the active leaf whose kind is `checkpoint`. Used to mark
       * one checkpoint row as "active" (gold accent, no jump affordance).
       */
      const activeCheckpointId: string | null = useMemo(() => {
        if (!tree) return null
        const found = findAncestor(
            tree,
            tree.activeLeafId,
            (n): n is TreeNode<CheckpointNode> => n.kind === 'checkpoint',
        )
        return found?.id ?? null
      }, [tree])

      // ── Auto-open tools when data arrives (uncontrolled mode) ─────
      // Only auto-opens a tool if the user hasn't actively dismissed it.
      useEffect(() => {
        const nodes = artifactNodes || []
        const prevNodes = prevArtifactNodesRef.current

        const hasNewOrChangedNode = nodes.length !== prevNodes.length
            || nodes.some((n, i) => n.id !== prevNodes[i]?.id)

        if (!isPanelControlled
            && hasNewOrChangedNode && nodes.length > 0
            && !dismissedToolsRef.current.has('artifacts')) {
          setInternalTools(prev => ({...prev, 'top-right': 'artifacts'}))
        }

        const hasNewOrUpdatedTask = (curr: Task[], prev: Task[]): boolean => {
          return curr.some(c => {
            const p = prev.find(x => x.id === c.id)
            if (!p) {
              return true
            }
            if (c.status !== p.status || c.label !== p.label) {
              return true
            }
            return !!(c.subtasks && hasNewOrUpdatedTask(c.subtasks, p?.subtasks || []));

          })
        }

        if (hasNewOrUpdatedTask(tasks, prevTasksRef.current)
            && !dismissedToolsRef.current.has('todos')) {
          setInternalTools(prev => ({...prev, 'bottom-right': 'todos'}))
        }

        prevArtifactNodesRef.current = nodes
        prevTasksRef.current = tasks
      }, [artifactNodes, tasks, isPanelControlled])

      // ── Branch switching ──────────────────────────────────────────
      const handleBranchSwitch = useCallback(
          (nodeId: string, direction: 'prev' | 'next') => {
            if (!tree || !onTreeChange) {
              return
            }
            onTreeChange(switchBranch(tree, nodeId, direction))
          },
          [tree, onTreeChange]
      )

      const handleJumpHere = useCallback((nodeId: string) => {
        if (!tree) return
        if (onJumpHere) {
          onJumpHere(nodeId)
          return
        }
        if (onTreeChange) {
          onTreeChange(setActiveLeaf(tree, nodeId))
        }
      }, [tree, onTreeChange, onJumpHere])

      const handleJumpToLatest = useCallback(() => {
        if (!tree) return
        if (onJumpToLatest) {
          onJumpToLatest()
          return
        }
        if (onTreeChange && tree.lastLeafId) {
          onTreeChange(setActiveLeaf(tree, tree.lastLeafId))
        }
      }, [tree, onTreeChange, onJumpToLatest])

      // ── Build the heterogeneous row list for ChatView ─────────────
      const buildItem = useCallback(
          (node: TreeNode<ChatNode>, opts: { muted?: boolean }): ChatViewItem => {
            const branchInfo = tree && getSiblingInfo(tree, node.id).total > 1
                ? {
                  ...getSiblingInfo(tree, node.id),
                  onPrevious: () => handleBranchSwitch(node.id, 'prev'),
                  onNext: () => handleBranchSwitch(node.id, 'next'),
                }
                : undefined

            if (node.kind === 'checkpoint') {
              return {
                kind: 'checkpoint',
                id: node.id,
                name: node.name,
                executionKind: node.executionKind,
                status: node.status,
                isActive: node.id === activeCheckpointId && !opts.muted,
                muted: opts.muted,
                branchInfo,
                onJumpHere: () => handleJumpHere(node.id),
              }
            }

            const actions = enableMessageActions
                ? {
                  showCopy: true,
                  onEdit: node.role === 'user' && onEditMessage
                      ? (newContent: string) => onEditMessage(node.id, newContent)
                      : undefined,
                  onRetry: node.role === 'assistant' && onRetryMessage
                      ? () => onRetryMessage(node.id)
                      : undefined,
                }
                : undefined

            const isActiveLeaf = tree?.activeLeafId === node.id

            return {
              kind: 'message',
              id: node.id,
              variant: node.role,
              content: node.content,
              isStreaming: node.isStreaming,
              muted: opts.muted,
              branchInfo,
              actions,
              attachments: node.attachments
                  ? node.attachments.map(a => ({
                    id: a.id,
                    file: {name: a.name, size: a.size ?? 0, type: a.type},
                    previewUrl: a.previewUrl,
                    artifactId: a.artifactId,
                    status: a.status ?? 'analyzed',
                  }))
                  : undefined,
              onAttachmentOpen: handleAttachmentOpen,
              isActive: isActiveLeaf,
              onJumpHere: () => handleJumpHere(node.id),
            }
          },
          [tree, activeCheckpointId, enableMessageActions, onEditMessage, onRetryMessage,
            handleBranchSwitch, handleJumpHere, handleAttachmentOpen],
      )

      const displayItems: ChatViewItem[] = useMemo(() => {
        const items: ChatViewItem[] = activePath.map(n => buildItem(n, {muted: false}))
        if (greyedFuture.length > 0) {
          const messageCount = greyedFuture.filter(n => n.kind === 'message').length
          const checkpointCount = greyedFuture.filter(n => n.kind === 'checkpoint').length
          items.push({
            kind: 'divider',
            id: '__greyed_divider__',
            messageCount,
            checkpointCount,
            onJumpToLatest: handleJumpToLatest,
          })
          for (const n of greyedFuture) {
            items.push(buildItem(n, {muted: true}))
          }
        }
        return items
      }, [activePath, greyedFuture, buildItem, handleJumpToLatest])

      const latestUserMessageIndex = useMemo(() => {
        for (let i = displayItems.length - 1; i >= 0; i--) {
          const item = displayItems[i]
          if (item.kind === 'message' && item.variant === 'user' && !item.muted) {
            return i
          }
        }
        return -1
      }, [displayItems])

      const handleSubmit = useCallback(
          (message: string, attachments?: Attachment[]) => {
            onMessageSubmit?.(message, attachments)
          },
          [onMessageSubmit]
      )

      const isEmpty = displayItems.length === 0

      // ── Derived: which sides have tools ─────────────────────────
      const leftToolDefs = useMemo(
          () => allToolDefinitions.filter(t => t.group === 'top-left' || t.group === 'bottom-left'),
          [allToolDefinitions]
      )
      const rightToolDefs = useMemo(
          () => allToolDefinitions.filter(
              t => t.group === 'top-right' || t.group === 'bottom-right'),
          [allToolDefinitions]
      )
      const hasLeftTools = leftToolDefs.length > 0
      const hasRightTools = rightToolDefs.length > 0

      // ── Render tool content for a given slot ──────────────────────
      const renderToolContent = (toolId: string | null) => {
        if (!toolId) {
          return null
        }

        switch (toolId) {
          case 'history':
            return (
                <HistoryPanel
                    conversations={conversations}
                    onSelectConversation={onSelectConversation}
                    onNewChat={onNewChat}
                    onRenameConversation={onRenameConversation}
                />
            )

          case 'artifacts':
            return (
                <ArtifactsPanel
                    nodes={artifactNodes}
                    openArtifactId={panelOpenArtifactId}
                    onArtifactClosed={handleArtifactPanelClosed}
                    getArtifactActions={getArtifactActions}
                    className="h-full"
                />
            )

          case 'todos':
            return tasks.length > 0
                ? <TodosList tasks={tasks} title={tasksTitle} onStopAllTasks={onStopAllTasks}
                             className="h-full"/>
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

          default: {
            // External tool — render its content
            const externalTool = externalTools.find(t => t.id === toolId)
            return externalTool?.content ?? null
          }
        }
      }

      return (
          <div
              ref={ref}
              className={cx('flex h-full w-full bg-obsidian overflow-hidden', className)}
              {...rest}
          >
            {/* Left tool sidebar */}
            {hasLeftTools && (
                <ToolSidebar
                    tools={leftToolDefs}
                    activeTools={activeTools}
                    onToggleTool={toggleTool}
                    side="left"
                />
            )}

            {/* Left tool panel */}
            {isLeftPanelOpen && (
                <ToolPanelContainer
                    topContent={renderToolContent(activeTools['top-left'])}
                    bottomContent={renderToolContent(activeTools['bottom-left'])}
                    width={leftToolsWidth}
                    onResizeStart={startResizingLeftTools}
                    side="left"
                    initialTopPercent={30}
                />
            )}

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
                      items={displayItems}
                      latestUserMessageIndex={latestUserMessageIndex}
                      isThinking={isThinking}
                      thinkingLabel={thinkingLabel}
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
                      onAttachmentRemove={onAttachmentRemove}
                      notice={inputNotice}
                      onInputChange={onInputChange}
                      initialInputValue={initialInputValue}
                      autoFocus={autoFocus}
                      textareaRef={textareaRef}
                      onTextareaKeyDown={onTextareaKeyDown}
                  />
                </div>

                {/* Bottom spacer for centering in empty state */}
                <div className={cx(
                    "transition-all duration-500 ease-in-out",
                    isEmpty ? "flex-1" : "flex-zero"
                )}/>
              </div>
            </div>

            {/* Right tool panel */}
            {isRightPanelOpen && (
                <ToolPanelContainer
                    topContent={renderToolContent(activeTools['top-right'])}
                    bottomContent={renderToolContent(activeTools['bottom-right'])}
                    width={rightToolsWidth}
                    onResizeStart={startResizingRightTools}
                    side="right"
                    initialTopPercent={70}
                />
            )}

            {/* Right tool sidebar */}
            {hasRightTools && (
                <ToolSidebar
                    tools={rightToolDefs}
                    activeTools={activeTools}
                    onToggleTool={toggleTool}
                    side="right"
                />
            )}
          </div>
      )
    }
)

ChatInterface.displayName = 'ChatInterface'
