import React, {useState, useEffect} from 'react'
import {cx} from '../../utils/cx'
import {ImageCard} from '../ImageCard'
import {VideoCard} from '../VideoCard'
import {MarkdownContent} from '../MarkdownContent'
import {Skeleton} from '../Skeleton'
import type {Artifact} from './hooks/useArtifactParser'

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
}

/**
 * Layers/documents icon for expanding collapsed artifacts panel
 */
function LayersIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
      <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
      <path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
    </svg>
  )
}

/**
 * Chevron right icon for collapsing expanded artifacts panel
 */
function ChevronRightIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/**
 * Render a skeleton placeholder for an artifact
 */
function ArtifactSkeleton({type}: {type: Artifact['type']}) {
  if (type === 'image') {
    return (
      <div className="overflow-hidden">
        <Skeleton className="w-full h-48" />
        <div className="p-4 bg-charcoal border border-ash/40 border-t-0">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (type === 'video') {
    return (
      <div className="overflow-hidden">
        <Skeleton className="w-full aspect-video" />
        <div className="p-4 bg-charcoal border border-ash/40 border-t-0">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  // Text artifact skeleton
  return (
    <div className="p-4 bg-charcoal border border-ash/40 space-y-2">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

/**
 * Render an individual artifact based on its type
 */
function ArtifactRenderer({artifact, isLoading}: {artifact: Artifact; isLoading?: boolean}) {
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
  }, [artifact.src, artifact.id])

  // Show skeleton for pending artifacts or when loading
  if (isLoading || artifact.isPending) {
    return <ArtifactSkeleton type={artifact.type} />
  }

  // Only show the actual content when both image is loaded AND minimum delay has passed
  const showContent = imageLoaded && minDelayPassed

  switch (artifact.type) {
    case 'image':
      return (
        <div className="relative">
          {!showContent && <ArtifactSkeleton type="image" />}
          <ImageCard
            src={artifact.src || ''}
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

    case 'video':
      return (
        <VideoCard
          src={artifact.src || ''}
          title={artifact.title}
          subtitle={artifact.subtitle}
          aspectRatio="video"
          controls
          className="w-full"
        />
      )

    case 'text':
      return (
        <div className="p-4 bg-charcoal border border-ash/40">
          {artifact.title && (
            <h4 className="text-lg font-semibold text-white mb-2">{artifact.title}</h4>
          )}
          <MarkdownContent
            content={artifact.content || ''}
            className="prose-sm prose-invert"
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
 */
export const ArtifactsPanel = React.forwardRef<HTMLDivElement, ArtifactsPanelProps>(
  ({artifacts, isOpen = false, onClose, isLoading = false, className, ...rest}, ref) => {
    // Collapsed state: thin strip with layers icon at top
    if (!isOpen) {
      return (
        <div
          ref={ref}
          className={cx(
            'h-full bg-charcoal/80 border-l border-ash/40 flex flex-col items-center py-3',
            'w-12 flex-shrink-0',
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
            <LayersIcon className="w-5 h-5" />
            {artifacts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian text-xs font-medium flex items-center justify-center rounded-full">
                {artifacts.length}
              </span>
            )}
          </button>
        </div>
      )
    }

    // Expanded state: full panel with chevron collapse button
    return (
      <div
        ref={ref}
        className={cx(
          'h-full bg-charcoal/50 border-l border-ash/40 flex flex-col',
          'w-96 flex-shrink-0',
          className
        )}
        {...rest}
      >
        {/* Header with title and collapse chevron */}
        <div className="flex items-center justify-between p-4 border-b border-ash/40 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">Artifacts</h3>
          <button
            onClick={onClose}
            className={cx(
              'p-1.5',
              'text-silver hover:text-white hover:bg-ash/20',
              'transition-colors duration-150'
            )}
            aria-label="Collapse artifacts panel"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Artifacts list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {artifacts.length === 0 && !isLoading ? (
            <p className="text-sm text-silver/60 text-center py-8">
              No artifacts to display
            </p>
          ) : (
            artifacts.map((artifact) => (
              <ArtifactRenderer
                key={artifact.id}
                artifact={artifact}
                isLoading={isLoading}
              />
            ))
          )}
        </div>
      </div>
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
      <LayersIcon className="w-5 h-5" />
      {artifactCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian text-xs font-medium flex items-center justify-center rounded-full">
          {artifactCount}
        </span>
      )}
    </button>
  )
})

ArtifactsPanelToggle.displayName = 'ArtifactsPanelToggle'

export default ArtifactsPanel
