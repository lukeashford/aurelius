// Main orchestrator
export {
  ChatInterface,
  type ChatInterfaceHandle,
  type ChatInterfaceProps,
  type Conversation
} from './ChatInterface'

// Core components
export {
  ChatView,
  type ChatViewProps,
  type ChatViewItem,
  type ChatViewMessageItem,
  type ChatViewCheckpointItem,
  type ChatViewDividerItem,
} from './ChatView'
export {
  Checkpoint,
  type CheckpointProps,
  type CheckpointBranchInfo,
  type CheckpointExecutionKind,
  type CheckpointStatus,
} from './Checkpoint'
export {GreyedDivider, type GreyedDividerProps} from './GreyedDivider'
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

// Tree types — discriminated union over message + checkpoint nodes
export {
  type NodeTopology,
  type TreeNode,
  type MessageNode,
  type CheckpointNode,
  type ChatNode,
  type ConversationTree,
  type AttachmentStatus,
  type Attachment,
  generateId,
  isImageFile,
  createPreviewUrl,
  revokePreviewUrl,
} from './types'

// Tree algorithms — generic over the node kind
export {
  createEmptyTree,
  addNodeToTree,
  type AddNodeOptions,
  getActivePath,
  findAncestor,
  getSiblingInfo,
  switchBranch,
  setActiveLeaf,
  getGreyedFuture,
  isBranchPoint,
  messagesToTree,
  updateMessageContent,
} from './tree'

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
