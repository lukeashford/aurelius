import {type Artifact} from './ArtifactCard'

/**
 * Node types in the artifact tree
 */
export const NODE_TYPES = {
  ARTIFACT: 'ARTIFACT',
  GROUP: 'GROUP',
  VARIANT_SET: 'VARIANT_SET',
} as const

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES]

/**
 * A node in the artifact tree. Mirrors the backend ArtifactNode shape.
 * Groups and variant sets contain children; artifact nodes link to content.
 */
export interface ArtifactNode {
  /**
   * Unique identifier
   */
  id: string
  /**
   * The node type — ARTIFACT, GROUP, or VARIANT_SET
   */
  type: NodeType
  /**
   * Semantic name (e.g. "storyboard", "protagonist_warm")
   */
  name: string
  /**
   * Display label (e.g. "Storyboard", "Warm Analog")
   */
  label: string
  /**
   * For ARTIFACT nodes — the actual content. Null for GROUP and VARIANT_SET.
   */
  artifact?: Artifact
  /**
   * For VARIANT_SET — which child is the chosen variant
   */
  chosenVariantId?: string | null
  /**
   * Child nodes (populated for GROUP and VARIANT_SET)
   */
  children: ArtifactNode[]
}
