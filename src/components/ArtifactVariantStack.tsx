import React from 'react'
import {cx} from '../utils'
import {type ArtifactNode} from './ArtifactNode'
import {ArtifactCard} from './ArtifactCard'

export interface ArtifactVariantStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The VARIANT_SET node to display
   */
  node: ArtifactNode
  /**
   * Called when a child is clicked (e.g. to select, expand, or navigate into it)
   */
  onChildClick?: (child: ArtifactNode) => void
}

/**
 * Renders a VARIANT_SET node as a horizontal row of children inside a
 * framing container. If a chosen variant is set, it is highlighted with a
 * gold ring and checkmark while unchosen variants are dimmed. When no
 * variant is chosen, all children are shown equally.
 */
export const ArtifactVariantStack = React.forwardRef<HTMLDivElement, ArtifactVariantStackProps>(
    ({node, onChildClick, className, ...props}, ref) => {
      const children = node.children
      const chosenId = node.chosenVariantId

      const renderChild = (child: ArtifactNode) => {
        const isChosen = chosenId === child.id
        const isDimmed = chosenId != null && !isChosen

        if (child.type === 'ARTIFACT' && child.artifact) {
          return (
              <div
                  key={child.id}
                  className={cx(
                      'relative flex-1 min-w-0 cursor-pointer transition-opacity duration-200',
                      isDimmed && 'opacity-50',
                      isChosen && 'ring-1 ring-gold'
                  )}
                  onClick={() => onChildClick?.(child)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onChildClick?.(child)
                    }
                  }}
                  aria-label={child.label}
                  aria-pressed={isChosen}
              >
                <ArtifactCard artifact={child.artifact} className="w-full"/>
                {isChosen && (
                    <div
                        className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center bg-gold text-obsidian rounded-full">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                )}
                <div className="mt-1 text-xs text-silver truncate">{child.label}</div>
              </div>
          )
        }

        // Nested group or variant set placeholder
        return (
            <div
                key={child.id}
                className={cx(
                    'relative flex-1 min-w-0 cursor-pointer transition-opacity duration-200',
                    isDimmed && 'opacity-50',
                    isChosen && 'ring-1 ring-gold'
                )}
                onClick={() => onChildClick?.(child)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChildClick?.(child)
                  }
                }}
                aria-label={child.label}
            >
              <div
                  className="aspect-video bg-graphite border border-gold/30 flex flex-col items-center justify-center gap-2 p-4">
                <span className="text-xs text-silver uppercase tracking-wider">
                  {child.type === 'GROUP' ? 'Group' : 'Variants'}
                </span>
                <span className="text-sm text-white font-semibold truncate max-w-full">
                  {child.label}
                </span>
                {child.type === 'GROUP' && (
                    <span className="text-xs text-silver">{child.children.length} items</span>
                )}
              </div>
              {isChosen && (
                  <div
                      className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center bg-gold text-obsidian rounded-full">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
              )}
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
