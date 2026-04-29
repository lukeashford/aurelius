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
   */
  executionKind: 'task' | 'submit' | 'rename' | 'init'
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
 * Attachment types for file uploads
 */
export type AttachmentStatus = 'pending' | 'uploading' | 'complete' | 'error'

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
   * Error message if status is 'error'
   */
  error?: string
  /**
   * Upload progress (0-100)
   */
  progress?: number
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
