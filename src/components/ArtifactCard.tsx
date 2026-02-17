import React from 'react'
import {Artifact} from './chat'
import {ImageCard} from './ImageCard'
import {VideoCard} from './VideoCard'
import {AudioCard} from './AudioCard'
import {PdfCard} from './PdfCard'
import {ScriptCard} from './ScriptCard'
import {TextCard} from './TextCard'
import {ExpandIcon} from './icons'
import {cx} from '../utils'

export interface ArtifactCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The artifact object to display
   */
  artifact: Artifact
  /**
   * Callback when the artifact should be expanded/opened
   */
  onExpand?: (artifact: Artifact) => void
  /**
   * Whether the artifact is still loading
   */
  isLoading?: boolean
}

/**
 * A dispatcher component that renders the appropriate specialist card
 * based on the artifact type.
 */
export const ArtifactCard = React.forwardRef<HTMLDivElement, ArtifactCardProps>(
    ({artifact, onExpand, isLoading, className, ...props}, ref) => {
      const commonProps = {
        title: artifact.title,
        subtitle: artifact.subtitle,
        isLoading: isLoading || artifact.isPending,
        className: 'w-full',
      }

      const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onExpand) {
          onExpand(artifact)
        }
      }

      const renderContent = () => {
        switch (artifact.type) {
          case 'IMAGE':
            return (
                <ImageCard
                    {...commonProps}
                    src={artifact.url}
                    alt={artifact.alt}
                    aspectRatio="landscape"
                />
            )
          case 'VIDEO':
            return (
                <VideoCard
                    {...commonProps}
                    src={artifact.url}
                    aspectRatio="video"
                    controls
                />
            )
          case 'AUDIO':
            return (
                <AudioCard
                    {...commonProps}
                    src={artifact.url}
                    controls
                />
            )
          case 'PDF':
            return (
                <PdfCard
                    {...commonProps}
                    src={artifact.url}
                />
            )
          case 'SCRIPT':
            return (
                <ScriptCard
                    {...commonProps}
                    elements={artifact.scriptElements || []}
                    maxHeight="16rem"
                />
            )
          case 'TEXT':
            return (
                <TextCard
                    {...commonProps}
                    content={artifact.inlineContent || ''}
                    isMarkdown={artifact.mimeType !== 'text/plain'}
                    contentClassName={cx(
                        artifact.mimeType === 'text/plain' && "whitespace-pre-wrap"
                    )}
                />
            )
          default:
            return null
        }
      }

      // Determine if the card itself should be clickable to expand
      // Video and Audio have their own controls, so we only expand via the button
      const isCardExpandable = !!onExpand && (
          artifact.type === 'IMAGE' ||
          artifact.type === 'PDF' ||
          artifact.type === 'SCRIPT' ||
          artifact.type === 'TEXT'
      )

      return (
          <div
              ref={ref}
              className={cx(
                  'relative group',
                  isCardExpandable && 'cursor-pointer',
                  artifact.fullWidth && 'col-span-full',
                  className
              )}
              onClick={isCardExpandable ? handleExpand : undefined}
              {...props}
          >
            {onExpand && (
                <button
                    onClick={handleExpand}
                    className={cx(
                        'absolute top-2 right-2 z-10 p-1.5',
                        'bg-obsidian/80 text-silver hover:text-white hover:bg-obsidian',
                        'opacity-0 group-hover:opacity-100 transition-opacity'
                    )}
                    aria-label="Expand artifact"
                >
                  <ExpandIcon className="w-4 h-4"/>
                </button>
            )}
            {renderContent()}
          </div>
      )
    }
)

ArtifactCard.displayName = 'ArtifactCard'

export default ArtifactCard
