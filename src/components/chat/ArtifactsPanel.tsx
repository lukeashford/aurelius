import React, {useCallback, useEffect, useState} from 'react'
import {cx} from '../../utils'
import {ImageCard} from '../ImageCard'
import {VideoCard} from '../VideoCard'
import {AudioCard} from '../AudioCard'
import {ScriptCard} from '../ScriptCard'
import {MarkdownContent} from '../MarkdownContent'
import {Skeleton} from '../Skeleton'
import {ChevronRightIcon, CloseIcon, ExpandIcon, LayersIcon,} from '../icons'
import type {Artifact} from './hooks'
import {PdfCard} from "../PdfCard";

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
 * Render a skeleton placeholder for an artifact
 */
function ArtifactSkeleton({type, fullWidth}: { type: Artifact['type']; fullWidth?: boolean }) {
  const wrapperClass = fullWidth ? 'col-span-full' : ''

  if (type === 'IMAGE') {
    return (
        <div className={cx('overflow-hidden', wrapperClass)}>
          <Skeleton className="w-full h-48"/>
          <div className="p-4 bg-charcoal border border-ash/40 border-t-0">
            <Skeleton className="h-5 w-3/4 mb-2"/>
            <Skeleton className="h-4 w-1/2"/>
          </div>
        </div>
    )
  }

  if (type === 'VIDEO') {
    return (
        <div className={cx('overflow-hidden', wrapperClass)}>
          <Skeleton className="w-full aspect-video"/>
          <div className="p-4 bg-charcoal border border-ash/40 border-t-0">
            <Skeleton className="h-5 w-3/4 mb-2"/>
            <Skeleton className="h-4 w-1/2"/>
          </div>
        </div>
    )
  }

  if (type === 'AUDIO' || type === 'PDF') {
    return (
        <div className={cx('overflow-hidden', wrapperClass)}>
          <Skeleton className="w-full h-32"/>
          <div className="p-4 bg-charcoal border border-ash/40 border-t-0">
            <Skeleton className="h-5 w-3/4 mb-2"/>
            <Skeleton className="h-4 w-1/2"/>
          </div>
        </div>
    )
  }

  if (type === 'SCRIPT') {
    return (
        <div className={cx('p-4 bg-charcoal border border-ash/40 space-y-2', wrapperClass)}>
          <Skeleton className="h-5 w-1/3 mb-4"/>
          <Skeleton className="h-3 w-2/3"/>
          <Skeleton className="h-3 w-full"/>
          <Skeleton className="h-3 w-3/4"/>
          <Skeleton className="h-3 w-full"/>
          <Skeleton className="h-3 w-1/2"/>
        </div>
    )
  }

  // Text artifact skeleton
  return (
      <div className={cx('p-4 bg-charcoal border border-ash/40 space-y-2', wrapperClass)}>
        <Skeleton className="h-5 w-1/2"/>
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-3/4"/>
      </div>
  )
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
                    url={artifact.url || ''}
                    className="h-full border-0"
                />
            )}
            {artifact.type === 'TEXT' && (
                <MarkdownContent
                    content={artifact.inlineContent || ''}
                    isMarkdown={artifact.mimeType === 'text/markdown'}
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [minDelayPassed, setMinDelayPassed] = useState(false)

  // Reset states when artifact changes and start minimum delay timer
  useEffect(() => {
    setImageLoaded(false)
    setMinDelayPassed(false)

    // Minimum skeleton display time (800ms) before revealing image
    const timer = setTimeout(() => {
      setMinDelayPassed(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [artifact.url, artifact.id])

  // Full-width class for grid layout
  const fullWidthClass = artifact.fullWidth ? 'col-span-full' : ''

  // Show skeleton for pending artifacts or when loading
  if (isLoading || artifact.isPending) {
    return <ArtifactSkeleton type={artifact.type} fullWidth={artifact.fullWidth}/>
  }

  // Only show the actual content when both image is loaded AND minimum delay has passed
  const showContent = artifact.type !== 'IMAGE' || (imageLoaded && minDelayPassed)

  const expandButton = onExpand && (
      <button
          onClick={(e) => {
            e.stopPropagation()
            onExpand()
          }}
          className={cx(
              'absolute top-2 right-2 z-10 p-1.5',
              'bg-obsidian/80 text-silver hover:text-white hover:bg-obsidian',
              'opacity-0 group-hover:opacity-100 transition-opacity'
          )}
          aria-label="Expand artifact"
      >
        <ExpandIcon className="w-4 h-4"/>
      </button>
  )

  switch (artifact.type) {
    case 'IMAGE':
      return (
          <div
              className={cx('relative group cursor-pointer', fullWidthClass)}
              onClick={onExpand}
          >
            {!showContent && <ArtifactSkeleton type="IMAGE"/>}
            {expandButton}
            <ImageCard
                src={artifact.url || ''}
                alt={artifact.alt || 'Artifact image'}
                title={artifact.title}
                subtitle={artifact.subtitle}
                aspectRatio="landscape"
                className={cx(
                    'w-full transition-opacity duration-300',
                    showContent ? 'opacity-100' : 'opacity-0 absolute inset-0'
                )}
                onLoad={() => setImageLoaded(true)}
            />
          </div>
      )

    case 'VIDEO':
      return (
          <div className={cx('relative group', fullWidthClass)}>
            {expandButton}
            <VideoCard
                src={artifact.url || ''}
                title={artifact.title}
                subtitle={artifact.subtitle}
                aspectRatio="video"
                controls
                className="w-full"
            />
          </div>
      )

    case 'AUDIO':
      return (
          <div className={cx('relative group', fullWidthClass)}>
            {expandButton}
            <AudioCard
                src={artifact.url || ''}
                title={artifact.title}
                subtitle={artifact.subtitle}
                controls
                className="w-full"
            />
          </div>
      )

    case 'PDF':
      return (
          <div
              className={cx('relative group cursor-pointer', fullWidthClass)}
              onClick={onExpand}
          >
            {expandButton}
            <PdfCard
                url={artifact.url || ''}
                title={artifact.title}
                subtitle={artifact.subtitle}
                className="w-full"
            />
          </div>
      )

    case 'SCRIPT':
      return (
          <div
              className={cx('relative group cursor-pointer', fullWidthClass)}
              onClick={onExpand}
          >
            {expandButton}
            <ScriptCard
                title={artifact.title}
                subtitle={artifact.subtitle}
                elements={artifact.scriptElements || []}
                maxHeight="16rem"
                className="w-full"
            />
          </div>
      )

    case 'TEXT':
      return (
          <div
              className={cx(
                  'relative group cursor-pointer p-4 bg-charcoal border border-ash/40',
                  fullWidthClass
              )}
              onClick={onExpand}
          >
            {expandButton}
            {artifact.title && (
                <h4 className="text-sm font-semibold text-white mb-2">{artifact.title}</h4>
            )}
            <MarkdownContent
                content={artifact.inlineContent || ''}
                isMarkdown={artifact.mimeType === 'text/markdown'}
                className={cx(
                    "prose-sm prose-invert max-h-48 overflow-y-auto",
                    artifact.mimeType === 'text/plain' && "whitespace-pre-wrap"
                )}
            />
          </div>
      )

    default:
      return null
  }
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