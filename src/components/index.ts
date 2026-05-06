// Core
export {Button, type ButtonProps, type ButtonVariant, type ButtonSize} from './Button'
export {Input, type InputProps} from './Input'
export {
  Card,
  type CardProps,
  type CardVariant,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
  type CardMediaProps,
} from './Card'

// Layout
export {Container, type ContainerProps, type ContainerSize} from './Container'
export {Row, type RowProps, type RowGutter, type RowJustify, type RowAlign} from './Row'
export {Col, type ColProps, type ColSpan, type ColOffset, type ColOrder} from './Col'
export {Stack, type StackProps, type StackDirection, type StackGap} from './Stack'
export {Divider, type DividerProps} from './Divider'

// Data Display
export {Avatar, type AvatarProps, type AvatarSize} from './Avatar'
export {Badge, type BadgeProps, type BadgeVariant} from './Badge'
export {Tooltip, type TooltipProps} from './Tooltip'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
} from './Table'
export {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  type ListProps,
  type ListItemProps,
  type ListItemTextProps,
  type ListSubheaderProps,
} from './List'
export {FileChip, type FileChipProps, type FileChipStatus} from './FileChip'
export {MentionChip, type MentionChipProps} from './MentionChip'
export {
  Combobox,
  useComboboxNav,
  type ComboboxProps,
  type ComboboxNav,
  type UseComboboxNavOptions,
} from './Combobox'
export {
  AttachmentPreview, type AttachmentPreviewProps, type AttachmentItem
} from './AttachmentPreview'

// Forms
export {Label, type LabelProps} from './Label'
export {HelperText, type HelperTextProps} from './HelperText'
export {Textarea, type TextareaProps} from './Textarea'
export {Select, type SelectProps, type SelectOption} from './Select'
export {Checkbox, type CheckboxProps} from './Checkbox'
export {Radio, type RadioProps} from './Radio'
export {Switch, type SwitchProps} from './Switch'
export {Slider, type SliderProps} from './Slider'
export {
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  InputWrapper,
  type InputGroupProps,
  type InputAddonProps,
  type InputElementProps,
  type InputWrapperProps,
} from './InputGroup'

// Feedback
export {Alert, type AlertProps, type AlertVariant} from './Alert'
export {Spinner, type SpinnerProps} from './Spinner'
export {Skeleton, type SkeletonProps} from './Skeleton'
export {Progress, type ProgressProps} from './Progress'
export {
  BusyOverlay,
  type BusyOverlayProps,
  type BusyOverlayTone,
  type BusyOverlayBlurStrength,
} from './BusyOverlay'
export {
  ToastProvider,
  useToast,
  type ToastProviderProps,
  type ToastData,
  type ToastVariant,
  type ToastPosition,
} from './Toast'

// Overlays
export {Modal, type ModalProps} from './Modal'
export {Lightbox, type LightboxProps} from './Lightbox'
export {Drawer, type DrawerProps, type DrawerPosition} from './Drawer'
export {Popover, type PopoverProps, type PopoverPosition, type PopoverAlign} from './Popover'
export {
  ConfirmDialog,
  AlertDialog,
  PromptDialog,
  type ConfirmDialogProps,
  type AlertDialogProps,
  type PromptDialogProps,
} from './Dialog'

// Navigation
export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TabsProps,
  type TabListProps,
  type TabProps,
  type TabPanelProps,
} from './Tabs'
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './Accordion'
export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  type MenuProps,
  type MenuTriggerProps,
  type MenuContentProps,
  type MenuItemProps,
} from './Menu'
export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarLink,
  NavbarDivider,
  type NavbarProps,
  type NavbarBrandProps,
  type NavbarContentProps,
  type NavbarItemProps,
  type NavbarLinkProps,
} from './Navbar'
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  type BreadcrumbProps,
  type BreadcrumbItemProps,
  type BreadcrumbLinkProps,
} from './Breadcrumb'
export {Pagination, type PaginationProps} from './Pagination'
export {Stepper, type StepperProps, type Step, type StepStatus} from './Stepper'

// Icons
export {
  ChatBubbleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
  HistoryIcon,
  LayersIcon,
  MediaIcon,
  PlusIcon,
  CheckSquareIcon,
  EmptySquareIcon,
  CrossSquareIcon,
  SquareLoaderIcon,
  type IconProps,
} from './icons'

// Chat/AI
export {
  Message,
  type MessageProps,
  type MessageVariant,
  type MessageBranchInfo,
  type MessageActionsConfig
} from './Message'
export {StreamingCursor, type StreamingCursorProps} from './StreamingCursor'
export {MarkdownContent, type MarkdownContentProps} from './MarkdownContent'

// Chat Interface (Production-grade chat experience)
export {
  ChatInterface,
  ChatView,
  ChatInput,
  ArtifactsPanel,
  ArtifactsPanelToggle,
  HistoryPanel,
  TodosList,
  areAllTasksSettled,
  ToolSidebar,
  ToolPanelContainer,
  MessageActions,
  ThinkingIndicator,
  BranchNavigator,
  Checkpoint,
  GreyedDivider,
  useScrollAnchor,
  useResizable,
  useArtifactTreeNavigation,
  // Types
  type ChatInterfaceHandle,
  type ChatInterfaceProps,
  type ChatViewProps,
  type ChatViewItem,
  type ChatViewMessageItem,
  type ChatViewCheckpointItem,
  type ChatViewDividerItem,
  type CheckpointProps,
  type CheckpointBranchInfo,
  type CheckpointExecutionKind,
  type CheckpointStatus,
  type GreyedDividerProps,
  type ChatInputProps,
  type ChatInputPosition,
  type ChatInputNotice,
  type ChatInputNoticeVariant,
  type Attachment,
  type AttachmentStatus,
  type Conversation,
  type ArtifactsPanelProps,
  type ArtifactsPanelToggleProps,
  type HistoryPanelProps,
  type TodosListProps,
  type Task,
  type TaskStatus,
  TASK_STATUSES,
  type ToolSidebarProps,
  type ToolDefinition,
  type ExternalToolDefinition,
  type ToolPanelState,
  type ToolGroup,
  type ToolPanelContainerProps,
  type MessageActionsProps,
  type MessageActionsVariant,
  type ThinkingIndicatorProps,
  type BranchNavigatorProps,
  type NodeTopology,
  type TreeNode,
  type MessageNode,
  type CheckpointNode,
  type ChatNode,
  type ConversationTree,
  type UseScrollAnchorOptions,
  type UseScrollAnchorReturn,
  type BreadcrumbEntry,
  type UseArtifactTreeNavigationReturn,
  // Tree algorithms (generic over the node kind)
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
  // Utility functions
  generateId,
  isImageFile,
  createPreviewUrl,
  revokePreviewUrl,
} from './chat'

// Brand
export {
  BrandIcon,
  type BrandIconProps,
  type BrandIconSize,
  type BrandIconVariant,
} from './BrandIcon'
export {ColorSwatch, type ColorSwatchProps} from './ColorSwatch'
export {
  ImageCard,
  type ImageCardProps,
  type AspectRatio,
  type AspectRatioPreset,
} from './ImageCard'
export {
  VideoCard,
  type VideoCardProps,
  type VideoAspectRatio,
  type VideoAspectRatioPreset,
} from './VideoCard'
export {
  AudioCard,
  type AudioCardProps,
} from './AudioCard'
export {
  PdfCard,
  type PdfCardProps,
} from './PdfCard'
export {
  TextCard,
  type TextCardProps,
} from './TextCard'
export {
  DeliverableCard,
  type DeliverableCardProps,
} from './DeliverableCard'
export {
  ArtifactCard,
  type ArtifactCardProps,
  ARTIFACT_TYPES,
  type ArtifactType,
  type Artifact,
} from './ArtifactCard'
export {
  SectionHeading, type SectionHeadingProps, type SectionHeadingLevel
} from './SectionHeading'

// Artifact Tree
export {
  NODE_TYPES,
  type NodeType,
  type ArtifactNode,
} from './ArtifactNode'
export {
  ArtifactGroup,
  type ArtifactGroupProps,
} from './ArtifactGroup'
export {
  ArtifactVariantStack,
  type ArtifactVariantStackProps,
} from './ArtifactVariantStack'
export {
  ScriptCard,
  type ScriptCardProps,
  type ScriptElement,
  type ScriptElementType,
  SCRIPT_ELEMENT_TYPES,
} from './ScriptCard'

// Deliverables (presentable moodboards / pitch decks)
export {
  DeliverableRenderer,
  CoverSection,
  ArtifactImageGridSection,
  ArtifactSpotlightSection,
  TextBlockSection,
  ColorPaletteSection,
  QuoteBlockSection,
  type DeliverableRendererProps,
  type CoverSectionProps,
  type ArtifactImageGridSectionProps,
  type ArtifactSpotlightSectionProps,
  type TextBlockSectionProps,
  type ColorPaletteSectionProps,
  type QuoteBlockSectionProps,
  type Deliverable,
  type DeliverableSection,
  type DeliverableImageItem,
  type DeliverableSwatch,
  type DeliverableArtifactRef,
  type DeliverableTheme,
  type ImageGridAspectRatio,
  type SpotlightVariant,
} from './deliverable'
