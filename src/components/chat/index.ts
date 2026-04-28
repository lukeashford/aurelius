// Main orchestrator
export {
  ChatInterface,
  type ChatInterfaceProps,
  type Conversation
} from './ChatInterface'

// Core components
export {ChatView, type ChatViewProps, type ChatViewItem} from './ChatView'
export {
  ChatInput,
  type ChatInputProps,
  type ChatInputPosition,
  type ChatInputNotice
} from './ChatInput'
export {
  ArtifactsPanel,
  ArtifactsPanelToggle,
  type ArtifactsPanelProps,
  type ArtifactsPanelToggleProps,
} from './ArtifactsPanel'
export {HistoryPanel, type HistoryPanelProps} from './HistoryPanel'
export {
  TodosList,
  areAllTasksSettled,
  type TodosListProps,
  type Task,
  type TaskStatus,
  TASK_STATUSES,
} from './TodosList'
export {
  ToolSidebar,
  type ToolSidebarProps,
  type ToolDefinition,
  type ExternalToolDefinition,
  type ToolPanelState,
  type ToolGroup,
} from './ToolSidebar'
export {
  ToolPanelContainer,
  type ToolPanelContainerProps,
} from './ToolPanelContainer'

export {
  MessageActions, type MessageActionsProps, type MessageActionsVariant
} from './MessageActions'
export {ThinkingIndicator, type ThinkingIndicatorProps} from './ThinkingIndicator'
export {BranchNavigator, type BranchNavigatorProps} from './BranchNavigator'

// Types for branching and attachments
export {
  type MessageNode,
  type ConversationTree,
  type AttachmentStatus,
  type Attachment,
  // Utility functions
  createEmptyTree,
  addMessageToTree,
  getActivePathMessages,
  getSiblingInfo,
  switchBranch,
  updateNodeContent,
  messagesToTree,
  isBranchPoint,
  generateId,
} from './types'

// Hooks
export {
  useScrollAnchor,
  useResizable,
  useArtifactTreeNavigation,
  type UseScrollAnchorOptions,
  type UseScrollAnchorReturn,
  type Artifact,
  type ArtifactType,
  type BreadcrumbEntry,
  type UseArtifactTreeNavigationReturn,
} from './hooks'
