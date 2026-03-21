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

// Fixed offset for each layer behind the front card (in px via Tailwind)
const LAYER_OFFSET = '4px'
const LAYER_OFFSET_2X = '8px'

/**
 * Renders a GROUP node as a stacked card — the first child is shown on top,
 * with two offset layers behind it to indicate depth (always shown as a
 * visual symbol for "group"). A square count badge shows the total items.
 * Title appears above the stack.
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
            {/* Title */}
            <div className="mb-2">
              <span className="text-sm font-medium text-white truncate">{node.label}</span>
            </div>

            {/* Outer wrapper that includes the stack offset area in layout flow */}
            <div style={{paddingRight: LAYER_OFFSET_2X, paddingBottom: LAYER_OFFSET_2X}}>
              {/* Stack area — positioned relative for the layers */}
              <div className="relative">
                {/* Back layer */}
                <div
                    className="absolute inset-0 bg-charcoal border border-ash/30 pointer-events-none"
                    style={{transform: `translate(${LAYER_OFFSET_2X}, ${LAYER_OFFSET_2X})`}}
                    aria-hidden="true"
                />

                {/* Middle layer */}
                <div
                    className="absolute inset-0 bg-charcoal border border-ash/40 pointer-events-none"
                    style={{transform: `translate(${LAYER_OFFSET}, ${LAYER_OFFSET})`}}
                    aria-hidden="true"
                />

                {/* Front card */}
                <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
                  {renderFrontContent()}
                </div>

                {/* Count badge — square */}
                <div
                    className="absolute -top-2 -right-2 z-10 min-w-6 h-6 px-1.5 flex items-center justify-center bg-gold text-obsidian text-xs font-bold"
                >
                  {count}
                </div>
              </div>
            </div>
          </div>
      )
    }
)

ArtifactGroup.displayName = 'ArtifactGroup'

export default ArtifactGroup
