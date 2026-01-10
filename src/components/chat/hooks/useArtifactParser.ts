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
}

export interface UseArtifactParserReturn {
  /**
   * Content with artifact blocks stripped out
   */
  cleanContent: string
  /**
   * Parsed artifacts array
   */
  artifacts: Artifact[]
}

/**
 * Regex to match artifact blocks in markdown content.
 * Matches: :::artifact{type="image" src="..." alt="..." title="..." subtitle="..."}:::
 * Also matches multi-line for text content:
 * :::artifact{type="text" title="..."}
 * content here
 * :::
 */
const ARTIFACT_REGEX = /:::artifact\{([^}]+)\}(?:([^:]*?))?:::/gs

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

let artifactIdCounter = 0

function generateArtifactId(): string {
  return `artifact-${++artifactIdCounter}`
}

/**
 * Hook to parse :::artifact{...}::: blocks from streaming content.
 *
 * Returns clean content (with artifacts stripped) and an array of parsed artifacts.
 *
 * Supported artifact types:
 * - text: Rendered with MarkdownContent (content attribute)
 * - image: Rendered with ImageCard (src, alt, title, subtitle)
 * - video: Rendered with VideoCard (src, title, subtitle)
 */
export function useArtifactParser(content: string): UseArtifactParserReturn {
  return useMemo(() => {
    if (!content) {
      return {cleanContent: '', artifacts: []}
    }

    const artifacts: Artifact[] = []

    // Replace artifact blocks with empty string and collect artifacts
    const cleanContent = content.replace(ARTIFACT_REGEX, (_, attrString, innerContent) => {
      const attrs = parseAttributes(attrString)
      const type = (attrs.type || 'text') as ArtifactType

      const artifact: Artifact = {
        id: generateArtifactId(),
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
    }).trim()

    return {cleanContent, artifacts}
  }, [content])
}

export default useArtifactParser
