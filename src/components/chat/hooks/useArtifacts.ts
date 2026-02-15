import {useCallback, useState} from 'react'
import type {ScriptElement} from '../../ScriptCard'

export type ArtifactType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SCRIPT' | 'PDF'

export interface Artifact {
  id: string
  type: ArtifactType
  /**
   * For text artifacts - the content (markdown, HTML, or plain text)
   */
  inlineContent?: string
  /**
   * For artifacts that source from a URL (image, video, audio, pdf, file)
   */
  url?: string
  /**
   * The mime type of the content
   */
  mimeType?: string
  /**
   * For image artifacts - alt text
   */
  alt?: string
  /**
   * Display title shown below the artifact
   */
  title?: string
  /**
   * Display subtitle shown below the title
   */
  subtitle?: string
  /**
   * Whether this artifact is still loading (shows skeleton)
   */
  isPending?: boolean
  /**
   * Whether the artifact should span full width in the grid
   */
  fullWidth?: boolean
  /**
   * For html artifacts - structured script elements (used by ScriptCard)
   */
  scriptElements?: ScriptElement[]
}

export interface UseArtifactsReturn {
  /**
   * Current list of artifacts
   */
  artifacts: Artifact[]
  /**
   * Schedule a new artifact (adds to list with isPending=true, shows skeleton).
   */
  scheduleArtifact: (artifact: Omit<Artifact, 'isPending'>) => void
  /**
   * Show an artifact (updates existing or adds new with isPending=false).
   */
  showArtifact: (artifactId: string, artifact: Omit<Artifact, 'id' | 'isPending'>) => void
  /**
   * Remove an artifact from the list.
   */
  removeArtifact: (artifactId: string) => void
  /**
   * Clear all artifacts
   */
  clearArtifacts: () => void
}

/**
 * Hook for managing artifacts in the ChatInterface.
 *
 * Provides methods to control the artifacts panel programmatically,
 * designed for event-driven architectures like SSE streams.
 *
 * @example
 * ```tsx
 * const { artifacts, scheduleArtifact, showArtifact, removeArtifact } = useArtifacts()
 *
 * // When SSE operator.started event arrives
 * scheduleArtifact({ id: operatorId, type: 'IMAGE' })
 *
 * // When SSE artifact.created event arrives
 * showArtifact(artifactId, {
 *   type: 'IMAGE',
 *   src: 'https://example.com/image.png',
 *   title: 'Generated Image',
 * })
 *
 * // When SSE operator.failed event arrives
 * removeArtifact(operatorId)
 * ```
 */
export function useArtifacts(): UseArtifactsReturn {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])

  const scheduleArtifact = useCallback((artifact: Omit<Artifact, 'isPending'>) => {
    setArtifacts((prev) => [...prev, {...artifact, isPending: true}])
  }, [])

  const showArtifact = useCallback(
      (artifactId: string, updates: Omit<Artifact, 'id' | 'isPending'>) => {
        setArtifacts((prev) => {
          const existingIndex = prev.findIndex((a) => a.id === artifactId)
          if (existingIndex >= 0) {
            // Update existing artifact
            return prev.map((a) =>
                a.id === artifactId ? {...a, ...updates, isPending: false} : a
            )
          } else {
            // Add as new artifact
            return [...prev, {id: artifactId, ...updates, isPending: false}]
          }
        })
      },
      []
  )

  const removeArtifact = useCallback((artifactId: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== artifactId))
  }, [])

  const clearArtifacts = useCallback(() => {
    setArtifacts([])
  }, [])

  return {artifacts, scheduleArtifact, showArtifact, removeArtifact, clearArtifacts}
}

export default useArtifacts
