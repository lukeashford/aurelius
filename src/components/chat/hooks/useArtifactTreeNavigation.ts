import {useCallback, useMemo, useState} from 'react'
import type {ArtifactNode} from '../../ArtifactNode'

/**
 * A breadcrumb entry representing one level of navigation depth.
 */
export interface BreadcrumbEntry {
  /** Display label for this level */
  label: string
  /** The group node at this level (null for root) */
  node: ArtifactNode | null
}

/**
 * Return type for the useArtifactTreeNavigation hook.
 */
export interface UseArtifactTreeNavigationReturn {
  /** Nodes to display at the current navigation level */
  currentNodes: ArtifactNode[]
  /** Breadcrumb trail from root to current level */
  breadcrumbs: BreadcrumbEntry[]
  /** Whether the user is at the root level */
  isAtRoot: boolean
  /** Navigate into a group node, pushing it onto the stack */
  navigateInto: (node: ArtifactNode) => void
  /** Navigate to a specific breadcrumb level by index */
  navigateTo: (index: number) => void
  /** Navigate back one level */
  navigateBack: () => void
}

/**
 * Manages navigation state for an artifact tree panel.
 * Maintains a stack of group nodes the user has navigated into,
 * deriving children from the node references themselves.
 */
export function useArtifactTreeNavigation(rootNodes: ArtifactNode[]): UseArtifactTreeNavigationReturn {
  // Stack of group nodes the user has drilled into (empty = at root)
  const [stack, setStack] = useState<ArtifactNode[]>([])

  const currentNodes = useMemo(() => {
    if (stack.length === 0) return rootNodes
    return stack[stack.length - 1].children
  }, [rootNodes, stack])

  const breadcrumbs = useMemo<BreadcrumbEntry[]>(() => {
    const entries: BreadcrumbEntry[] = [{label: 'Project', node: null}]
    for (const node of stack) {
      entries.push({label: node.label, node})
    }
    return entries
  }, [stack])

  const isAtRoot = stack.length === 0

  const navigateInto = useCallback((node: ArtifactNode) => {
    setStack(prev => [...prev, node])
  }, [])

  const navigateTo = useCallback((index: number) => {
    // index 0 = root, so slice to 0 clears the stack
    setStack(prev => prev.slice(0, index))
  }, [])

  const navigateBack = useCallback(() => {
    setStack(prev => prev.slice(0, -1))
  }, [])

  return {
    currentNodes,
    breadcrumbs,
    isAtRoot,
    navigateInto,
    navigateTo,
    navigateBack,
  }
}
