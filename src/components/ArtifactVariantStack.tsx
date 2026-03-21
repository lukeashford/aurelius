import React from 'react'
import {cx} from '../utils'
import {type Artifact} from './ArtifactCard'
import {type ArtifactNode} from './ArtifactNode'
import {ArtifactCard} from './ArtifactCard'
import {ArtifactGroup} from './ArtifactGroup'
import {Card} from './Card'

export interface ArtifactVariantStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The VARIANT_SET node to display
   */
  node: ArtifactNode
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
 * Renders a VARIANT_SET node as a Card with the set label as title.
 * Children are displayed in a horizontal row inside the card body.
 * Children handle their own click behavior (expand for artifacts,
 * navigate for groups).
 */
export const ArtifactVariantStack = React.forwardRef<HTMLDivElement, ArtifactVariantStackProps>(
    ({node, onExpandArtifact, onGroupClick, className, ...props}, ref) => {
      const children = node.children

      const renderChild = (child: ArtifactNode) => {
        if (child.type === 'ARTIFACT' && child.artifact) {
          return (
              <div key={child.id} className="flex-1 min-w-0">
                <ArtifactCard
                    artifact={child.artifact}
                    onExpand={onExpandArtifact}
                    className="w-full"
                />
              </div>
          )
        }

        if (child.type === 'GROUP') {
          return (
              <div key={child.id} className="flex-1 min-w-0">
                <ArtifactGroup node={child} onClick={onGroupClick}/>
              </div>
          )
        }

        // Nested variant set placeholder
        return (
            <div key={child.id} className="flex-1 min-w-0">
              <div
                  className="aspect-video bg-graphite border border-gold/30 flex flex-col items-center justify-center gap-2 p-4">
                <span className="text-xs text-silver uppercase tracking-wider">Variants</span>
                <span className="text-sm text-white font-semibold truncate max-w-full">
                  {child.label}
                </span>
              </div>
            </div>
        )
      }

      return (
          <Card
              ref={ref}
              noPadding
              className={cx('w-full', className)}
              {...props}
          >
            <Card.Header title={node.label} className="border-b-0"/>
            <Card.Body>
              <div className="flex gap-3">
                {children.map(renderChild)}
              </div>
            </Card.Body>
          </Card>
      )
    }
)

ArtifactVariantStack.displayName = 'ArtifactVariantStack'

export default ArtifactVariantStack
