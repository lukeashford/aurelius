/**
 * Conversation Tree Types
 *
 * These types support branching conversations where users can:
 * - Edit their messages (creating a new branch)
 * - Retry assistant responses (creating a new branch)
 * - Navigate between different conversation branches
 */

import {ReactNode} from 'react'

/**
 * A node in the conversation tree
 */
export interface MessageNode {
  /**
   * Unique identifier for this message
   */
  id: string
  /**
   * The role of the message author
   */
  role: 'user' | 'assistant'
  /**
   * The message content (may include HTML/markdown or React components)
   */
  content: ReactNode
  /**
   * ID of the parent message (null for root messages)
   */
  parentId: string | null
  /**
   * IDs of child messages (branches/continuations)
   */
  children: string[]
  /**
   * Which sibling branch this message is (0, 1, 2...)
   * Used for UI display like "1/3"
   */
  branchIndex?: number
  /**
   * Whether this message is currently being streamed
   */
  isStreaming?: boolean
  /**
   * Timestamp when the message was created
   */
  createdAt?: number
}

/**
 * The full conversation tree structure
 */
export interface ConversationTree {
  /**
   * All nodes indexed by their ID
   */
  nodes: Record<string, MessageNode>
  /**
   * IDs of root-level messages (messages with no parent)
   */
  rootIds: string[]
  /**
   * The current "head" of the viewed branch
   * This is the leaf node that determines which path we're viewing
   */
  activeLeafId: string | null
}

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
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create an empty conversation tree
 */
export function createEmptyTree(): ConversationTree {
  return {
    nodes: {},
    rootIds: [],
    activeLeafId: null,
  }
}

/**
 * Add a message to the tree
 */
export function addMessageToTree(
    tree: ConversationTree,
    message: Omit<MessageNode, 'children' | 'branchIndex'>,
    parentId: string | null = null
): ConversationTree {
  const newNodes = {...tree.nodes}
  const newRootIds = [...tree.rootIds]

  // Determine branch index among siblings
  let branchIndex = 0
  if (parentId && newNodes[parentId]) {
    branchIndex = newNodes[parentId].children.length
  } else if (!parentId) {
    branchIndex = newRootIds.length
  }

  // Create the new node
  newNodes[message.id] = {
    ...message,
    parentId,
    children: [],
    branchIndex,
    createdAt: message.createdAt ?? Date.now(),
  }

  // Update parent's children array
  if (parentId && newNodes[parentId]) {
    newNodes[parentId] = {
      ...newNodes[parentId],
      children: [...newNodes[parentId].children, message.id],
    }
  } else {
    newRootIds.push(message.id)
  }

  return {
    nodes: newNodes,
    rootIds: newRootIds,
    activeLeafId: message.id,
  }
}

/**
 * Get the linear path from root to the active leaf
 */
export function getActivePathMessages(tree: ConversationTree): MessageNode[] {
  if (!tree.activeLeafId) {
    return []
  }

  const path: MessageNode[] = []
  let currentId: string | null = tree.activeLeafId

  // Walk up to the root
  while (currentId) {
    const node: MessageNode | undefined = tree.nodes[currentId]
    if (!node) {
      break
    }
    path.unshift(node)
    currentId = node.parentId
  }

  return path
}

/**
 * Get sibling count and current index for a node
 */
export function getSiblingInfo(tree: ConversationTree, nodeId: string): {
  total: number;
  current: number
} {
  const node = tree.nodes[nodeId]
  if (!node) {
    return {total: 1, current: 1}
  }

  if (node.parentId) {
    const parent = tree.nodes[node.parentId]
    if (parent) {
      const index = parent.children.indexOf(nodeId)
      return {
        total: parent.children.length,
        current: index + 1,
      }
    }
  } else {
    // Root level node
    const index = tree.rootIds.indexOf(nodeId)
    return {
      total: tree.rootIds.length,
      current: index + 1,
    }
  }

  return {total: 1, current: 1}
}

/**
 * Switch to a different branch at a given node
 */
export function switchBranch(
    tree: ConversationTree,
    nodeId: string,
    direction: 'prev' | 'next'
): ConversationTree {
  const node = tree.nodes[nodeId]
  if (!node) {
    return tree
  }

  let siblings: string[]
  let currentIndex: number

  if (node.parentId) {
    const parent = tree.nodes[node.parentId]
    if (!parent) {
      return tree
    }
    siblings = parent.children
    currentIndex = siblings.indexOf(nodeId)
  } else {
    siblings = tree.rootIds
    currentIndex = siblings.indexOf(nodeId)
  }

  if (siblings.length <= 1) {
    return tree
  }

  // Calculate new index
  const newIndex = direction === 'next'
      ? (currentIndex + 1) % siblings.length
      : (currentIndex - 1 + siblings.length) % siblings.length

  // Find the leaf of the new branch (follow first children down)
  let leafId = siblings[newIndex]
  let currentNode: MessageNode | undefined = tree.nodes[leafId]
  while (currentNode && currentNode.children.length > 0) {
    leafId = currentNode.children[0]
    currentNode = tree.nodes[leafId]
  }

  return {
    ...tree,
    activeLeafId: leafId,
  }
}

/**
 * Update a node's content (e.g., during streaming)
 */
export function updateNodeContent(
    tree: ConversationTree,
    nodeId: string,
    content: ReactNode,
    isStreaming?: boolean
): ConversationTree {
  const node = tree.nodes[nodeId]
  if (!node) {
    return tree
  }

  return {
    ...tree,
    nodes: {
      ...tree.nodes,
      [nodeId]: {
        ...node,
        content,
        isStreaming: isStreaming ?? node.isStreaming,
      },
    },
  }
}

/**
 * Convert a flat message array to a conversation tree
 */
export function messagesToTree(
    messages: Array<{
      id: string;
      role: 'user' | 'assistant';
      content: ReactNode;
      isStreaming?: boolean
    }>
): ConversationTree {
  let tree = createEmptyTree()

  for (const msg of messages) {
    const parentId = tree.activeLeafId
    tree = addMessageToTree(tree, {
      id: msg.id,
      role: msg.role,
      content: msg.content,
      parentId,
      isStreaming: msg.isStreaming,
    }, parentId)
  }

  return tree
}

/**
 * Check if a node has multiple children (is a branch point)
 */
export function isBranchPoint(tree: ConversationTree, nodeId: string): boolean {
  const node = tree.nodes[nodeId]
  return node ? node.children.length > 1 : false
}
