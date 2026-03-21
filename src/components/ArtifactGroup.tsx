import React from 'react'
import {cx} from '../utils'
import {type ArtifactNode} from './ArtifactNode'
import {ArtifactCard} from './ArtifactCard'

export interface ArtifactGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * The GROUP node to display
   */
  node: ArtifactNode
  /**
   * Called when the group is clicked (e.g. to navigate into it)
   */
  onClick?: (node: ArtifactNode) => void
}

/**
 * Renders a GROUP node as a stacked card — the first child is shown on top,
 * with up to two offset layers behind it to indicate depth. A count badge
 * shows the total number of items in the group.
 */
export const ArtifactGroup = React.forwardRef<HTMLDivElement, ArtifactGroupProps>(
    ({node, onClick, className, ...props}, ref) => {
      const children = node.children
      const count = children.length
      const frontChild = children[0]

      const handleClick = () => {
        if (onClick) {
          onClick(node)
        }
      }

      const renderFrontContent = () => {
        if (!frontChild) {
          return (
              <div className="w-full aspect-video bg-graphite border border-ash/40 flex items-center justify-center">
                <span className="text-silver text-sm">Empty group</span>
              </div>
          )
        }

        if (frontChild.type === 'ARTIFACT' && frontChild.artifact) {
          return <ArtifactCard artifact={frontChild.artifact} className="w-full"/>
        }

        // For nested groups or variant sets, show a label card
        return (
            <div
                className="w-full aspect-video bg-graphite border border-gold/30 flex flex-col items-center justify-center gap-2 p-4">
              <span className="text-sm text-silver uppercase tracking-wider">
                {frontChild.type === 'GROUP' ? 'Group' : 'Variants'}
              </span>
              <span className="text-white font-semibold">{frontChild.label}</span>
            </div>
        )
      }

      // Reserve extra space for the offset layers behind the front card
      const pad = count >= 3 ? 'pb-3 pr-3' : count >= 2 ? 'pb-1.5 pr-1.5' : ''

      return (
          <div
              ref={ref}
              className={cx(
                  'cursor-pointer group',
                  className
              )}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClick()
                }
              }}
              aria-label={`${node.label} — ${count} items`}
              {...props}
          >
            {/* Stack area — sized to fit front card + layer offsets */}
            <div className={cx('relative', pad)}>
              {/* Back layer (only when there are 3+ children) */}
              {count >= 3 && (
                  <div
                      className="absolute inset-0 translate-x-3 translate-y-3 bg-charcoal border border-ash/30 pointer-events-none"
                      aria-hidden="true"
                  />
              )}

              {/* Middle layer (only when there are 2+ children) */}
              {count >= 2 && (
                  <div
                      className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-charcoal border border-ash/40 pointer-events-none"
                      aria-hidden="true"
                  />
              )}

              {/* Front card */}
              <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
                {renderFrontContent()}
              </div>

              {/* Count badge */}
              {count > 1 && (
                  <div
                      className="absolute -top-2 -right-2 z-10 min-w-6 h-6 px-1.5 flex items-center justify-center bg-gold text-obsidian text-xs font-bold rounded-full"
                  >
                    {count}
                  </div>
              )}
            </div>

            {/* Label bar */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">{node.label}</span>
              <span className="text-xs text-silver">{count} items</span>
            </div>
          </div>
      )
    }
)

ArtifactGroup.displayName = 'ArtifactGroup'

export default ArtifactGroup
