/**
 * Conversation tree algorithms.
 *
 * Every function here operates on `NodeTopology` only — the tree never branches
 * on a node's `kind`. Domain questions ("where's the nearest checkpoint?",
 * "which message did I edit?") become predicates passed to `findAncestor`.
 *
 * The tree is the single source of truth for navigation. `activeLeafId` is the
 * leaf the user is viewing; `lastLeafId` is the deepest leaf they reached on
 * the previously-active path. The greyed-future region is derived from the
 * pair, not stored.
 */

import {ReactNode} from 'react'
import type {
  ChatNode,
  ConversationTree,
  MessageNode,
  NodeTopology,
  TreeNode,
} from './types'

// ───────────────────────────────────────────────────────────────
//  Construction
// ───────────────────────────────────────────────────────────────

export function createEmptyTree<T extends NodeTopology = ChatNode>(): ConversationTree<T> {
  return {nodes: {}, rootIds: [], activeLeafId: null, lastLeafId: null}
}

/**
 * Options for {@link addNodeToTree}.
 */
export interface AddNodeOptions {
  /**
   * Whether the new node should become the active leaf. Defaults to `true`,
   * matching the historical "create-and-focus" behaviour: a freshly added
   * node almost always represents the latest user-visible state.
   *
   * Pass `false` when focus is decided by a separate signal — e.g. an SSE
   * stream that emits `active_leaf_set` only when the new node *should*
   * pull focus (the previous active leaf was its parent), and otherwise
   * leaves the user wherever they navigated to.
   *
   * `lastLeafId` follows the same rule: it only advances to the new node
   * when the node is activated, since "deepest leaf the user has reached"
   * does not include nodes the system added off-screen.
   *
   * @default true
   */
  activate?: boolean
}

/**
 * Append a node under `parentId` (or as a root when null). By default the new
 * node also becomes the active leaf — sending a message, retrying, editing,
 * and submitting all rely on that. Pass `{activate: false}` to insert without
 * pulling focus, e.g. for off-branch updates from a stream.
 */
export function addNodeToTree<T extends NodeTopology>(
    tree: ConversationTree<T>,
    node: T,
    parentId: string | null = null,
    options: AddNodeOptions = {},
): ConversationTree<T> {
  const activate = options.activate ?? true
  const newNodes: Record<string, TreeNode<T>> = {...tree.nodes}
  const newRootIds = [...tree.rootIds]

  const branchIndex = parentId
      ? newNodes[parentId]?.children.length ?? 0
      : newRootIds.length

  newNodes[node.id] = {
    ...node,
    parentId,
    children: [],
    branchIndex,
    createdAt: node.createdAt ?? Date.now(),
  } as TreeNode<T>

  if (parentId && newNodes[parentId]) {
    newNodes[parentId] = {
      ...newNodes[parentId],
      children: [...newNodes[parentId].children, node.id],
    }
  } else {
    newRootIds.push(node.id)
  }

  return {
    nodes: newNodes,
    rootIds: newRootIds,
    activeLeafId: activate ? node.id : tree.activeLeafId,
    lastLeafId: activate ? node.id : tree.lastLeafId,
  }
}

// ───────────────────────────────────────────────────────────────
//  Traversal — generic over node kind
// ───────────────────────────────────────────────────────────────

/**
 * Walk root → activeLeaf, returning the nodes on the active path in order.
 */
export function getActivePath<T extends NodeTopology>(
    tree: ConversationTree<T>,
): TreeNode<T>[] {
  return walkUp(tree, tree.activeLeafId).reverse()
}

/**
 * Walk from `fromId` upward and return the first ancestor (inclusive) that
 * matches the predicate. Domain helpers compose on top — e.g. finding the
 * closest checkpoint is `findAncestor(t, id, n => n.kind === 'checkpoint')`.
 */
export function findAncestor<T extends NodeTopology>(
    tree: ConversationTree<T>,
    fromId: string | null,
    predicate: (node: TreeNode<T>) => boolean,
): TreeNode<T> | null {
  let id: string | null = fromId
  while (id) {
    const node = tree.nodes[id]
    if (!node) return null
    if (predicate(node)) return node
    id = node.parentId
  }
  return null
}

export function getSiblingInfo<T extends NodeTopology>(
    tree: ConversationTree<T>,
    nodeId: string,
): { total: number; current: number } {
  const siblings = siblingsOf(tree, nodeId)
  const index = siblings.indexOf(nodeId)
  if (index < 0) return {total: 1, current: 1}
  return {total: siblings.length, current: index + 1}
}

export function isBranchPoint<T extends NodeTopology>(
    tree: ConversationTree<T>,
    nodeId: string,
): boolean {
  return (tree.nodes[nodeId]?.children.length ?? 0) > 1
}

// ───────────────────────────────────────────────────────────────
//  Navigation — moving the active leaf
// ───────────────────────────────────────────────────────────────

/**
 * Switch to a sibling branch at `nodeId` and follow first-children down to a
 * leaf. Used by the BranchNavigator chevrons. Resets `lastLeafId` to the new
 * leaf because the previous greyed-future, if any, lives on a different branch.
 */
export function switchBranch<T extends NodeTopology>(
    tree: ConversationTree<T>,
    nodeId: string,
    direction: 'prev' | 'next',
): ConversationTree<T> {
  const siblings = siblingsOf(tree, nodeId)
  if (siblings.length <= 1) return tree

  const currentIndex = siblings.indexOf(nodeId)
  const newIndex = direction === 'next'
      ? (currentIndex + 1) % siblings.length
      : (currentIndex - 1 + siblings.length) % siblings.length

  const leafId = deepestLeafOf(tree, siblings[newIndex])
  return {...tree, activeLeafId: leafId, lastLeafId: leafId}
}

/**
 * Set the active leaf without forking. Use for rewinds (clicking a checkpoint),
 * jumping forward into the greyed future, and "jump to latest".
 *
 * Preserves `lastLeafId` when the new leaf is an ancestor of it (i.e. the user
 * rewound, or moved within the rewound region). Otherwise resets `lastLeafId`
 * to the new leaf — the greyed future doesn't carry over to unrelated paths.
 *
 * `null` clears the active leaf (empty session). An id that doesn't exist in
 * the tree is treated as a no-op rather than written through — the previous
 * behaviour silently set `activeLeafId` to a non-existent id, which made
 * `getActivePath` walk from a missing node and return an empty path. That
 * presented as "the chat just cleared" for callers that accidentally passed
 * a foreign id (a hypocaust execution id, a stale optimistic temp id, etc.).
 * A no-op turns those caller bugs into visible "nothing happened" instead of
 * an invisible empty-render.
 */
export function setActiveLeaf<T extends NodeTopology>(
    tree: ConversationTree<T>,
    leafId: string | null,
): ConversationTree<T> {
  if (leafId === null) {
    return {...tree, activeLeafId: null, lastLeafId: null}
  }
  if (!tree.nodes[leafId]) {
    return tree
  }
  const lastLeafId = tree.lastLeafId && isAncestor(tree, leafId, tree.lastLeafId)
      ? tree.lastLeafId
      : leafId
  return {...tree, activeLeafId: leafId, lastLeafId}
}

/**
 * Nodes between `activeLeafId` (exclusive) and `lastLeafId` (inclusive) — the
 * timeline the user rewound away from. Empty whenever no rewind is in effect.
 */
export function getGreyedFuture<T extends NodeTopology>(
    tree: ConversationTree<T>,
): TreeNode<T>[] {
  const {activeLeafId, lastLeafId} = tree
  if (!activeLeafId || !lastLeafId || activeLeafId === lastLeafId) return []

  const path: TreeNode<T>[] = []
  let id: string | null = lastLeafId
  while (id && id !== activeLeafId) {
    const node: TreeNode<T> | undefined = tree.nodes[id]
    if (!node) return []
    path.unshift(node)
    id = node.parentId
  }
  return id === activeLeafId ? path : []
}

// ───────────────────────────────────────────────────────────────
//  Mutation
// ───────────────────────────────────────────────────────────────

/**
 * Convenience: build a strictly linear message-only tree from a flat array.
 * Useful for tests, fixtures, and consumers that don't care about branching.
 */
export function messagesToTree(
    messages: Array<Omit<MessageNode, 'kind' | 'parentId'>>,
): ConversationTree<MessageNode> {
  let tree = createEmptyTree<MessageNode>()
  for (const msg of messages) {
    const parentId = tree.activeLeafId
    tree = addNodeToTree(
        tree,
        {...msg, kind: 'message', parentId} as MessageNode,
        parentId,
    )
  }
  return tree
}

/**
 * Update a streaming message's content. Generic over the tree's node type so
 * the function works equally on message-only trees (`ConversationTree<MessageNode>`)
 * and mixed trees (`ConversationTree<ChatNode>`). At runtime it narrows to
 * `MessageNode` via the `kind` discriminator and silently no-ops on any other
 * kind. The single cast below is the cost of bridging a generic-T tree to the
 * concrete `MessageNode` shape it operates on.
 */
export function updateMessageContent<T extends NodeTopology>(
    tree: ConversationTree<T>,
    nodeId: string,
    content: ReactNode,
    isStreaming?: boolean,
): ConversationTree<T> {
  const node = tree.nodes[nodeId] as unknown as TreeNode<MessageNode> | undefined
  if (!node || node.kind !== 'message') return tree
  const updated: TreeNode<MessageNode> = {
    ...node,
    content,
    isStreaming: isStreaming ?? node.isStreaming,
  }
  return {
    ...tree,
    nodes: {
      ...tree.nodes,
      [nodeId]: updated as unknown as TreeNode<T>,
    },
  }
}

// ───────────────────────────────────────────────────────────────
//  Internal helpers
// ───────────────────────────────────────────────────────────────

function walkUp<T extends NodeTopology>(
    tree: ConversationTree<T>,
    fromId: string | null,
): TreeNode<T>[] {
  const out: TreeNode<T>[] = []
  let id: string | null = fromId
  while (id) {
    const node = tree.nodes[id]
    if (!node) break
    out.push(node)
    id = node.parentId
  }
  return out
}

function siblingsOf<T extends NodeTopology>(
    tree: ConversationTree<T>,
    nodeId: string,
): string[] {
  const node = tree.nodes[nodeId]
  if (!node) return []
  return node.parentId
      ? tree.nodes[node.parentId]?.children ?? []
      : tree.rootIds
}

function deepestLeafOf<T extends NodeTopology>(
    tree: ConversationTree<T>,
    nodeId: string,
): string {
  let id = nodeId
  let node = tree.nodes[id]
  while (node && node.children.length > 0) {
    id = node.children[node.children.length - 1]
    node = tree.nodes[id]
  }
  return id
}

function isAncestor<T extends NodeTopology>(
    tree: ConversationTree<T>,
    ancestorId: string,
    descendantId: string,
): boolean {
  let id: string | null = descendantId
  while (id) {
    if (id === ancestorId) return true
    id = tree.nodes[id]?.parentId ?? null
  }
  return false
}
