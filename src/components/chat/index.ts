// Main orchestrator
export {ChatInterface, type ChatInterfaceProps, type ChatMessage} from './ChatInterface'

// Core components
export {ChatView, type ChatViewProps, type ChatViewItem} from './ChatView'
export {
  ChatInput,
  type ChatInputProps,
  type ChatInputPosition,
  type Attachment,
  type AttachmentStatus
} from './ChatInput'
export {
  ConversationSidebar,
  CollapsedSidebarToggle,
  type ConversationSidebarProps,
  type Conversation,
  type CollapsedSidebarToggleProps,
} from './ConversationSidebar'
export {
  ArtifactsPanel,
  ArtifactsPanelToggle,
  type ArtifactsPanelProps,
  type ArtifactsPanelToggleProps,
} from './ArtifactsPanel'
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
  type ToolPanelState,
} from './ToolSidebar'
export {
  ToolPanelContainer,
  type ToolPanelContainerProps,
} from './ToolPanelContainer'

// New components
export {
  MessageActions, type MessageActionsProps, type MessageActionsVariant
} from './MessageActions'
export {ThinkingIndicator, type ThinkingIndicatorProps} from './ThinkingIndicator'
export {BranchNavigator, type BranchNavigatorProps} from './BranchNavigator'

// Types for branching
export {
  type MessageNode,
  type ConversationTree,
  type AttachmentStatus as TreeAttachmentStatus,
  type Attachment as TreeAttachment,
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
  isImageFile,
  createPreviewUrl,
  revokePreviewUrl,
} from './types'

// Hooks
export {
  useScrollAnchor,
  useArtifacts,
  useResizable,
  useArtifactTreeNavigation,
  type UseScrollAnchorOptions,
  type UseScrollAnchorReturn,
  type Artifact,
  type ArtifactType,
  type UseArtifactsReturn,
  type BreadcrumbEntry,
  type UseArtifactTreeNavigationReturn,
} from './hooks'
