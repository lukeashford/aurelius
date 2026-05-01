/**
 * Conversation tree types.
 *
 * The chat is rendered from a tree where every fork point — user-edits,
 * retries, parallel task attempts, rewinds — produces siblings under a shared
 * parent. The tree is generic over its node type so that the topology
 * algorithms in `./tree.ts` stay free of any kind-specific branching.
 *
 * Two concrete node kinds live here today: `MessageNode` (a user or assistant
 * turn) and `CheckpointNode` (a marker anchored to a hypocaust task execution
 * that the user can rewind to). New kinds plug in by extending `NodeTopology`
 * and joining the `ChatNode` union.
 */

import {ReactNode} from 'react'

// ───────────────────────────────────────────────────────────────
//  Topology
// ───────────────────────────────────────────────────────────────

/**
 * The minimal contract every tree node must satisfy. The tree algorithms only
 * ever read these fields; everything else is opaque to them.
 */
export interface NodeTopology {
  id: string
  parentId: string | null
  createdAt?: number
}

/**
 * A node as actually stored in the tree: the caller's data plus the adjacency
 * info the tree maintains. `children` and `branchIndex` are owned by the tree
 * and must never be set by callers — pass a plain `T` to `addNodeToTree`.
 */
export type TreeNode<T extends NodeTopology> = T & {
  children: string[]
  branchIndex?: number
}

// ───────────────────────────────────────────────────────────────
//  Concrete chat node kinds
// ───────────────────────────────────────────────────────────────

/**
 * A user or assistant message in the conversation.
 */
export interface MessageNode extends NodeTopology {
  kind: 'message'
  role: 'user' | 'assistant'
  /** Rendered content. Strings, React nodes, or anything ChatView can display. */
  content: ReactNode
  /** Whether this message is currently being streamed. */
  isStreaming?: boolean
  /**
   * Files that were attached to this message turn. Rendered as a chip strip
   * above the bubble. Empty/undefined renders nothing. The `artifactId` field
   * on each item, paired with the host's `onAttachmentOpen`, drives
   * click-through to the artifact-card modal.
   */
  attachments?: import('./types').MessageAttachmentItem[]
}

/**
 * One attachment row above a sent user message. Mirrors `AttachmentItem` but
 * carries the persisted `artifactId` instead of an in-memory File reference,
 * since these refer to artifacts that already live in the project tree.
 */
export interface MessageAttachmentItem {
  /** Stable identifier for the chip (typically the upload or artifact id). */
  id: string
  /** Display name (filename from the original upload). */
  name: string
  /** MIME type — drives the chip icon and image-preview branch. */
  type: string
  /** File size in bytes, optional. */
  size?: number
  /** Pre-signed thumbnail URL for image previews, optional. */
  previewUrl?: string
  /** Backend artifact id; required for click-through to work. */
  artifactId?: string
  /**
   * Lifecycle state captured at message-build time. Defaults to `analyzed`
   * for the happy path. Set to `analysis_failed` to render a red chip on a
   * successfully-integrated message, or to a pre-integrate state on a
   * message whose integrate call failed.
   */
  status?: AttachmentStatus
}

/**
 * A checkpoint that anchors a chat position to a hypocaust task execution.
 * Clicking a checkpoint rewinds the artifact view (and the tree's active leaf)
 * to the project state at that execution. New tasks sent from this position
 * use the checkpoint's `taskExecutionId` as their predecessor.
 */
export interface CheckpointNode extends NodeTopology {
  kind: 'checkpoint'
  /** ID of the hypocaust task execution this checkpoint anchors to. */
  taskExecutionId: string
  /** Human-readable label, ≤ 50 chars, supplied by hypocaust. */
  name: string
  /**
   * What kind of project mutation produced this checkpoint.
   * - `task`: a Claude-driven task execution
   * - `submit`: a merge of a working branch into the project head
   * - `rename`: a manual artifact rename via the artifacts panel (planned)
   * - `init`: the project head at session start (seeded into new chats)
   * - `ingest`: a batch of user uploads committed to the project tree
   */
  executionKind: 'task' | 'submit' | 'rename' | 'init' | 'ingest'
  /** Terminal status reported by hypocaust. */
  status: 'completed' | 'failed' | 'cancelled'
}

/**
 * Discriminated union of every chat-tree node kind.
 *
 * Extend by adding a new `interface FooNode extends NodeTopology { kind: 'foo' ... }`
 * and joining it here. Every algorithm in `./tree.ts` will keep working without
 * change because it operates on `NodeTopology`, not on this union.
 */
export type ChatNode = MessageNode | CheckpointNode

// ───────────────────────────────────────────────────────────────
//  Tree
// ───────────────────────────────────────────────────────────────

/**
 * A branching conversation tree.
 *
 * The path the user is currently viewing runs from a root through descendants
 * until it reaches `activeLeafId`. `lastLeafId` records the deepest leaf the
 * user has reached on the previously-active path; when `activeLeafId` is an
 * ancestor of `lastLeafId`, the nodes between them are the "greyed future"
 * (the timeline the user rewound away from but can still jump back into).
 */
export interface ConversationTree<T extends NodeTopology = ChatNode> {
  nodes: Record<string, TreeNode<T>>
  rootIds: string[]
  /** Leaf the user is currently viewing. Active path = root → here. */
  activeLeafId: string | null
  /**
   * Deepest leaf the user reached on the previously-active path. Equal to
   * `activeLeafId` whenever no rewind is in effect; cleared/reset by branch
   * switches and new node insertions.
   */
  lastLeafId: string | null
}

// ───────────────────────────────────────────────────────────────
//  Attachments
// ───────────────────────────────────────────────────────────────

/**
 * Attachment lifecycle, mirroring the per-file backend state machine:
 * upload → analyze, with separate failure modes for each phase.
 */
export type AttachmentStatus =
    | 'pending'
    | 'uploading'
    | 'uploaded'
    | 'analyzing'
    | 'analyzed'
    | 'upload_failed'
    | 'analysis_failed'

export interface Attachment {
  /**
   * Unique identifier for the attachment
   */
  id: string
  /**
   * The File object
   */
  file: File
  /**
   * Blob URL for image previews
   */
  previewUrl?: string
  /**
   * Current upload status
   */
  status: AttachmentStatus
  /**
   * Error message if status is an error variant
   */
  error?: string
  /**
   * Upload progress (0-100)
   */
  progress?: number
  /**
   * Backend artifact id, set once the batch is integrated. Drives chip
   * click-through to the artifact-card modal in the host app.
   */
  artifactId?: string
}

/**
 * Helper to check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Helper to create a preview URL for an image file
 */
export function createPreviewUrl(file: File): string | undefined {
  if (isImageFile(file)) {
    return URL.createObjectURL(file)
  }
  return undefined
}

/**
 * Helper to revoke a preview URL when no longer needed
 */
export function revokePreviewUrl(url: string | undefined): void {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
