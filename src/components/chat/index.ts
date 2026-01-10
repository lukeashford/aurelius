// Main orchestrator
export {ChatInterface, type ChatInterfaceProps, type ChatMessage} from './ChatInterface'

// Core components
export {ChatView, type ChatViewProps, type ChatViewItem} from './ChatView'
export {ChatInput, type ChatInputProps, type ChatInputPosition} from './ChatInput'
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

// Hooks
export {
  useScrollAnchor,
  useArtifactParser,
  type UseScrollAnchorOptions,
  type UseScrollAnchorReturn,
  type Artifact,
  type ArtifactType,
  type UseArtifactParserReturn,
} from './hooks'
