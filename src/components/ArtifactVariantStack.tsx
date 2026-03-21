import React, {useState} from 'react'
import {cx} from '../utils'
import {type Artifact} from './ArtifactCard'
import {type ArtifactNode} from './ArtifactNode'
import {ArtifactCard} from './ArtifactCard'
import {ArtifactGroup} from './ArtifactGroup'
import {CheckSquareIcon} from './icons/CheckSquareIcon'
import {EmptySquareIcon} from './icons/EmptySquareIcon'
import {SquareLoaderIcon} from './icons/SquareLoaderIcon'

export interface ArtifactVariantStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The VARIANT_SET node to display
   */
  node: ArtifactNode
  /**
   * Called when a variant is chosen (the square checkbox). Returns a promise;
   * the spinner shows until the promise resolves.
   */
  onChoose?: (child: ArtifactNode) => Promise<void>
  /**
   * Passed through to ArtifactCard children for expand/open behavior
   */
  onExpandArtifact?: (artifact: Artifact) => void
  /**
   * Passed through to ArtifactGroup children for navigation
   */
  onGroupClick?: (node: ArtifactNode) => void
}

/**
 * Renders a VARIANT_SET node as a horizontal row of children inside a
 * framing container. Each child has a square checkbox for choosing it as
 * the selected variant. If a chosen variant is set, it is highlighted
 * while unchosen variants are dimmed. When no variant is chosen, all
 * children are shown equally. Children handle their own click behavior
 * (expand for artifacts, navigate for groups).
 */
export const ArtifactVariantStack = React.forwardRef<HTMLDivElement, ArtifactVariantStackProps>(
    ({node, onChoose, onExpandArtifact, onGroupClick, className, ...props}, ref) => {
      const children = node.children
      const chosenId = node.chosenVariantId
      const [loadingId, setLoadingId] = useState<string | null>(null)

      const handleChoose = async (child: ArtifactNode, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!onChoose || loadingId) return
        setLoadingId(child.id)
        try {
          await onChoose(child)
        } finally {
          setLoadingId(null)
        }
      }

      const renderChooseButton = (child: ArtifactNode) => {
        const isChosen = chosenId === child.id
        const isLoading = loadingId === child.id

        return (
            <button
                className="absolute top-2 left-2 z-10 cursor-pointer"
                onClick={(e) => handleChoose(child, e)}
                aria-label={isChosen ? `${child.label} (chosen)` : `Choose ${child.label}`}
                disabled={loadingId !== null}
            >
              {isLoading ? (
                  <SquareLoaderIcon/>
              ) : isChosen ? (
                  <CheckSquareIcon/>
              ) : (
                  <EmptySquareIcon/>
              )}
            </button>
        )
      }

      const renderChild = (child: ArtifactNode) => {
        const isChosen = chosenId === child.id
        const isDimmed = chosenId != null && !isChosen

        if (child.type === 'ARTIFACT' && child.artifact) {
          return (
              <div
                  key={child.id}
                  className={cx(
                      'relative flex-1 min-w-0 transition-opacity duration-200',
                      isDimmed && 'opacity-50',
                      isChosen && 'ring-1 ring-gold'
                  )}
              >
                {onChoose && renderChooseButton(child)}
                <ArtifactCard
                    artifact={child.artifact}
                    onExpand={onExpandArtifact}
                    className="w-full"
                />
                <div className="mt-1 text-xs text-silver truncate">{child.label}</div>
              </div>
          )
        }

        if (child.type === 'GROUP') {
          return (
              <div
                  key={child.id}
                  className={cx(
                      'relative flex-1 min-w-0 transition-opacity duration-200',
                      isDimmed && 'opacity-50',
                      isChosen && 'ring-1 ring-gold'
                  )}
              >
                {onChoose && renderChooseButton(child)}
                <ArtifactGroup node={child} onClick={onGroupClick}/>
              </div>
          )
        }

        // Nested variant set placeholder
        return (
            <div
                key={child.id}
                className={cx(
                    'relative flex-1 min-w-0 transition-opacity duration-200',
                    isDimmed && 'opacity-50',
                    isChosen && 'ring-1 ring-gold'
                )}
            >
              {onChoose && renderChooseButton(child)}
              <div
                  className="aspect-video bg-graphite border border-gold/30 flex flex-col items-center justify-center gap-2 p-4">
                <span className="text-xs text-silver uppercase tracking-wider">Variants</span>
                <span className="text-sm text-white font-semibold truncate max-w-full">
                  {child.label}
                </span>
              </div>
              <div className="mt-1 text-xs text-silver truncate">{child.label}</div>
            </div>
        )
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'border border-ash/40 bg-charcoal/30 p-3',
                  className
              )}
              {...props}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-white truncate">{node.label}</span>
              <span className="text-xs text-silver">{children.length} variants</span>
            </div>

            {/* Horizontal row of children */}
            <div className="flex gap-3">
              {children.map(renderChild)}
            </div>
          </div>
      )
    }
)

ArtifactVariantStack.displayName = 'ArtifactVariantStack'

export default ArtifactVariantStack
