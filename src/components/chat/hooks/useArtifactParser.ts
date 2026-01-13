import {useMemo} from 'react'

export type ArtifactType = 'text' | 'image' | 'video'

export interface Artifact {
  id: string
  type: ArtifactType
  // For text artifacts
  content?: string
  // For image artifacts
  src?: string
  alt?: string
  // For video artifacts (also uses src)
  // Common metadata
  title?: string
  subtitle?: string
  // Whether this artifact is still being parsed (incomplete)
  isPending?: boolean
}

export interface UseArtifactParserReturn {
  /**
   * Content with artifact blocks stripped out (including incomplete ones)
   */
  cleanContent: string
  /**
   * Parsed artifacts array
   */
  artifacts: Artifact[]
  /**
   * Whether there's an incomplete artifact currently being streamed
   */
  hasPendingArtifact: boolean
}

/**
 * Regex to match complete artifact blocks.
 * Matches: :::artifact{type="image" src="..." alt="..." title="..." subtitle="..."}:::
 */
const COMPLETE_ARTIFACT_REGEX = /:::artifact\{([^}]+)\}(?:([^:]*?))?:::/gs

/**
 * Regex to detect start of an artifact block (even if incomplete)
 */
const ARTIFACT_START_REGEX = /:::artifact\{/

/**
 * Parse attribute string like: type="image" src="https://..." alt="Chart"
 */
function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const regex = /(\w+)="([^"]*)"/g
  let match

  while ((match = regex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2]
  }

  return attrs
}

/**
 * Generate a stable ID for an artifact based on its content.
 * This ensures React can properly reconcile artifacts during streaming
 * without constantly remounting components.
 */
function generateStableArtifactId(type: string, identifier: string): string {
  const str = `${type}:${identifier}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `artifact-${Math.abs(hash).toString(36)}`
}

/**
 * Hook to parse :::artifact{...}::: blocks from streaming content.
 *
 * Key streaming behavior:
 * - As soon as :::artifact{ is detected, everything from that point is stripped
 * - This prevents artifact syntax from showing in the message during streaming
 * - Complete artifacts are parsed and returned
 * - Incomplete artifacts trigger hasPendingArtifact flag for loading states
 *
 * Supported artifact types:
 * - text: Rendered with MarkdownContent (content attribute)
 * - image: Rendered with ImageCard (src, alt, title, subtitle)
 * - video: Rendered with VideoCard (src, title, subtitle)
 */
export function useArtifactParser(content: string): UseArtifactParserReturn {
  return useMemo(() => {
    if (!content) {
      return {cleanContent: '', artifacts: [], hasPendingArtifact: false}
    }

    const artifacts: Artifact[] = []
    let workingContent = content

    // First, extract all complete artifacts
    let artifactIndex = 0
    workingContent = workingContent.replace(COMPLETE_ARTIFACT_REGEX,
        (_, attrString, innerContent) => {
          const attrs = parseAttributes(attrString)
          const type = (attrs.type || 'text') as ArtifactType

          // Generate stable ID based on content (src for media, content for text)
          const identifier = attrs.src || attrs.content || innerContent || `idx-${artifactIndex++}`
          const id = generateStableArtifactId(type, identifier)

          const artifact: Artifact = {
            id,
            type,
            title: attrs.title,
            subtitle: attrs.subtitle,
          }

          if (type === 'text') {
            artifact.content = innerContent?.trim() || attrs.content
          } else if (type === 'image') {
            artifact.src = attrs.src
            artifact.alt = attrs.alt || 'Image'
          } else if (type === 'video') {
            artifact.src = attrs.src
          }

          artifacts.push(artifact)
          return ''
        })

    // Check for incomplete artifact at the end (still streaming)
    const startMatch = workingContent.match(ARTIFACT_START_REGEX)
    let hasPendingArtifact = false

    if (startMatch && startMatch.index !== undefined) {
      // Strip from the start of the incomplete artifact to the end
      workingContent = workingContent.substring(0, startMatch.index)
      hasPendingArtifact = true

      // Add a pending artifact placeholder with stable ID
      // (there can only be one pending artifact at a time)
      artifacts.push({
        id: 'artifact-pending',
        type: 'image', // Default to image for skeleton
        isPending: true,
      })
    }

    return {
      cleanContent: workingContent.trim(),
      artifacts,
      hasPendingArtifact,
    }
  }, [content])
}

export default useArtifactParser
