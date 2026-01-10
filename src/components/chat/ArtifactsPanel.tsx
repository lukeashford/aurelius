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

  // Reset image loaded state when artifact changes
  useEffect(() => {
    setImageLoaded(false)
  }, [artifact.src])

  // Show skeleton for pending artifacts or when loading
  if (isLoading || artifact.isPending) {
    return <ArtifactSkeleton type={artifact.type} />
  }

  switch (artifact.type) {
    case 'image':
      return (
        <div className="relative">
          {!imageLoaded && <ArtifactSkeleton type="image" />}
          <ImageCard
            src={artifact.src || ''}
            alt={artifact.alt || 'Artifact image'}
            title={artifact.title}
            subtitle={artifact.subtitle}
            aspectRatio="landscape"
            className={cx(
              'w-full transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
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
 * Behaviors:
 * - Hidden by default (zero width)
 * - Slides in from right when artifacts are present
 * - Shows skeleton placeholders while loading
 * - Stacks multiple artifacts vertically with scroll
 */
export const ArtifactsPanel = React.forwardRef<HTMLDivElement, ArtifactsPanelProps>(
  ({artifacts, isOpen = false, onClose, isLoading = false, className, ...rest}, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'h-full bg-charcoal/50 border-l border-ash/40 flex flex-col',
          'transition-all duration-300 ease-out',
          isOpen ? 'w-96' : 'w-0 overflow-hidden',
          className
        )}
        {...rest}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ash/40 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">Artifacts</h3>
          <button
            onClick={onClose}
            className="p-1 text-silver hover:text-white hover:bg-ash/20 transition-colors duration-150"
            aria-label="Close artifacts panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
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
        className
      )}
      aria-label="Expand artifacts panel"
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM5 6a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h5a1 1 0 100-2H6z"
          clipRule="evenodd"
        />
      </svg>
      {artifactCount > 0 && (
        <span className="text-xs font-medium text-gold">{artifactCount}</span>
      )}
    </button>
  )
})

ArtifactsPanelToggle.displayName = 'ArtifactsPanelToggle'

export default ArtifactsPanel
