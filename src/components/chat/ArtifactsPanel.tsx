import React, {useCallback, useEffect, useState} from 'react'
import {cx} from '../../utils'
import {ArtifactCard} from '../ArtifactCard'
import {AudioCard} from '../AudioCard'
import {PdfCard} from '../PdfCard'
import {ScriptCard} from '../ScriptCard'
import {VideoCard} from '../VideoCard'
import {MarkdownContent} from '../MarkdownContent'
import {ChevronRightIcon, CloseIcon, LayersIcon,} from '../icons'
import type {Artifact} from './hooks'

export interface ArtifactsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of artifacts to display
   */
  artifacts: Artifact[]
  /**
   * Whether the panel is visible
   */
  isOpen?: boolean
  /**
   * Callback to close/collapse the panel
   */
  onClose?: () => void
  /**
   * Whether artifacts are still loading (show skeletons)
   */
  isLoading?: boolean
  /**
   * Current width of the panel as CSS value (e.g., "50vw", "400px").
   */
  width?: string
  /**
   * Width as percentage of viewport (0-100) for column calculations.
   */
  widthPercent?: number
  /**
   * Callback to start resizing
   */
  onResizeStart?: (e: React.MouseEvent) => void
}

/**
 * Artifact modal for full-screen viewing
 */
function ArtifactModal({
  artifact,
  onClose,
}: {
  artifact: Artifact
  onClose: () => void
}) {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Handle click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
      <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-sm animate-fade-in"
          onClick={handleBackdropClick}
      >
        <div
            className="relative w-11/12 h-5/6 max-w-6xl bg-charcoal border border-ash/40 flex flex-col overflow-hidden">
          {/* Modal header */}
          <div
              className="flex items-center justify-between p-4 border-b border-ash/40 shrink-0">
            <div>
              {artifact.title && (
                  <h3 className="text-sm font-semibold text-white">{artifact.title}</h3>
              )}
              {artifact.subtitle && (
                  <p className="text-xs text-silver">{artifact.subtitle}</p>
              )}
            </div>
            <button
                onClick={onClose}
                className="p-2 text-silver hover:text-white hover:bg-ash/20 transition-colors"
                aria-label="Close modal"
            >
              <CloseIcon className="w-5 h-5"/>
            </button>
          </div>

          {/* Modal content */}
          <div className="flex-1 overflow-auto p-4">
            {artifact.type === 'IMAGE' && (
                <img
                    src={artifact.url}
                    alt={artifact.alt || 'Artifact image'}
                    className="max-w-full max-h-full object-contain mx-auto"
                />
            )}
            {artifact.type === 'VIDEO' && (
                <VideoCard
                    src={artifact.url || ''}
                    aspectRatio="video"
                    controls
                    className="max-w-full max-h-full mx-auto"
                />
            )}
            {artifact.type === 'AUDIO' && (
                <AudioCard
                    src={artifact.url || ''}
                    controls
                    className="max-w-xl mx-auto"
                />
            )}
            {artifact.type === 'PDF' && (
                <PdfCard
                    src={artifact.url || ''}
                    className="h-full border-0"
                />
            )}
            {artifact.type === 'TEXT' && (
                <MarkdownContent
                    content={artifact.inlineContent || ''}
                    isMarkdown={artifact.mimeType !== 'text/plain'}
                    className={cx(
                        "prose prose-invert max-w-none",
                        artifact.mimeType === 'text/plain' && "whitespace-pre-wrap"
                    )}
                />
            )}
            {artifact.type === 'SCRIPT' && artifact.scriptElements && (
                <ScriptCard
                    elements={artifact.scriptElements}
                    maxHeight="100%"
                    className="max-w-3xl mx-auto border-0"
                />
            )}
          </div>
        </div>
      </div>
  )
}

/**
 * Render an individual artifact based on its type
 */
function ArtifactRenderer({
  artifact,
  isLoading,
  onExpand,
}: {
  artifact: Artifact
  isLoading?: boolean
  onExpand?: () => void
}) {
  return (
      <ArtifactCard
          artifact={artifact}
          isLoading={isLoading}
          onExpand={onExpand}
      />
  )
}

/**
 * ArtifactsPanel displays rich content artifacts in a slide-in panel.
 *
 * When collapsed, shows a thin strip with layers icon at top.
 * When expanded, shows chevron at top-right to collapse.
 * Click on artifacts to expand them to full screen modal.
 *
 * Supports fullWidth artifacts that span all columns in the grid.
 */
export const ArtifactsPanel = React.forwardRef<HTMLDivElement, ArtifactsPanelProps>(
    ({
      artifacts,
      isOpen = false,
      onClose,
      isLoading = false,
      width,
      widthPercent,
      onResizeStart,
      className,
      ...rest
    }, ref) => {
      const [expandedArtifact, setExpandedArtifact] = useState<Artifact | null>(null)

      // Determine number of columns based on percentage of viewport
      // >55% viewport = 3 columns, >35% = 2 columns, else 1
      const columns = widthPercent && widthPercent > 55 ? 3 : widthPercent && widthPercent > 35 ? 2
          : 1

      // Collapsed state: thin strip with layers icon at top
      if (!isOpen) {
        return (
            <div
                ref={ref}
                className={cx(
                    'h-full bg-charcoal/80 border-l border-ash/40 flex flex-col items-center py-3',
                    'w-12 shrink-0',
                    className
                )}
                {...rest}
            >
              <button
                  onClick={onClose}
                  className={cx(
                      'p-2',
                      'text-silver hover:text-white hover:bg-ash/20',
                      'transition-colors duration-150',
                      'relative'
                  )}
                  aria-label="Expand artifacts panel"
              >
                <LayersIcon className="w-5 h-5"/>
                {artifacts.length > 0 && (
                    <span
                        className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian text-xs font-medium flex items-center justify-center rounded-full">
                {artifacts.length}
              </span>
                )}
              </button>
            </div>
        )
      }

      // Expanded state: full panel with chevron collapse button
      return (
          <>
            <div
                ref={ref}
                data-testid="artifacts-panel"
                className={cx(
                    'h-full bg-charcoal/50 border-l border-ash/40 flex flex-col relative',
                    !width && 'w-96',
                    'shrink-0',
                    className
                )}
                style={width ? {width} : undefined}
                {...rest}
            >
              {/* Resize handle */}
              <div
                  onMouseDown={onResizeStart}
                  data-testid="artifacts-resize-handle"
                  className={cx(
                      "absolute top-0 left-0 w-1 h-full cursor-col-resize z-50",
                      "hover:bg-gold/50 transition-colors",
                      "after:absolute after:inset-y-0 after:-left-1 after:w-2" // Larger hit area
                  )}
              />

              {/* Header with title and collapse chevron */}
              <div
                  className="flex items-center justify-between p-4 border-b border-ash/40 shrink-0">
                <h3 className="text-sm font-semibold text-white">Artifacts</h3>
                <button
                    onClick={onClose}
                    className={cx(
                        'p-1.5',
                        'text-silver hover:text-white hover:bg-ash/20',
                        'transition-colors duration-150'
                    )}
                    aria-label="Collapse artifacts panel"
                >
                  <ChevronRightIcon className="w-5 h-5"/>
                </button>
              </div>

              {/* Artifacts list */}
              <div
                  data-testid="artifacts-grid"
                  className={cx(
                      "flex-1 overflow-y-auto p-4",
                      columns === 1 ? "space-y-4" : "grid gap-4",
                      columns === 2 && "grid-cols-2",
                      columns === 3 && "grid-cols-3"
                  )}>
                {artifacts.length === 0 && !isLoading ? (
                    <p className="text-xs text-silver/60 text-center py-8">
                      No artifacts to display
                    </p>
                ) : (
                    artifacts.map((artifact) => (
                        <ArtifactRenderer
                            key={artifact.id}
                            artifact={artifact}
                            isLoading={isLoading}
                            onExpand={() => setExpandedArtifact(artifact)}
                        />
                    ))
                )}
              </div>
            </div>

            {/* Modal for expanded artifact */}
            {expandedArtifact && (
                <ArtifactModal
                    artifact={expandedArtifact}
                    onClose={() => setExpandedArtifact(null)}
                />
            )}
          </>
      )
    }
)

ArtifactsPanel.displayName = 'ArtifactsPanel'

/**
 * Toggle button to expand collapsed artifacts panel
 */
export interface ArtifactsPanelToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  artifactCount?: number
  onExpand?: () => void
}

export const ArtifactsPanelToggle = React.forwardRef<
    HTMLButtonElement,
    ArtifactsPanelToggleProps
>(({artifactCount = 0, onExpand, className, ...rest}, ref) => {
  return (
      <button
          ref={ref}
          onClick={onExpand}
          className={cx(
              'p-2',
              'bg-charcoal/80 border border-ash/40',
              'text-silver hover:text-white hover:bg-ash/20',
              'transition-colors duration-150',
              'flex items-center gap-2',
              'relative',
              className
          )}
          aria-label="Expand artifacts panel"
          {...rest}
      >
        <LayersIcon className="w-5 h-5"/>
        {artifactCount > 0 && (
            <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian text-xs font-medium flex items-center justify-center rounded-full">
          {artifactCount}
        </span>
        )}
      </button>
  )
})

ArtifactsPanelToggle.displayName = 'ArtifactsPanelToggle'