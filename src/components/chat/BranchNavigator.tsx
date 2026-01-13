import React from 'react'
import {cx} from '../../utils/cx'
import {ChevronLeft, ChevronRight, GitBranch} from 'lucide-react'

export interface BranchNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current branch index (1-based for display)
   */
  current: number
  /**
   * Total number of sibling branches
   */
  total: number
  /**
   * Called when navigating to previous branch
   */
  onPrevious?: () => void
  /**
   * Called when navigating to next branch
   */
  onNext?: () => void
  /**
   * Size variant
   */
  size?: 'sm' | 'md'
  /**
   * Whether to show the branch icon
   */
  showIcon?: boolean
}

export const BranchNavigator = React.forwardRef<HTMLDivElement, BranchNavigatorProps>(
    (
        {
          current,
          total,
          onPrevious,
          onNext,
          size = 'sm',
          showIcon = true,
          className,
          ...rest
        },
        ref
    ) => {
      // Don't render if there's only one branch
      if (total <= 1) {
        return null
      }

      const isFirst = current <= 1
      const isLast = current >= total

      const buttonSize = size === 'sm' ? 'p-0.5' : 'p-1'
      const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
      const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

      return (
          <div
              ref={ref}
              className={cx(
                  'inline-flex items-center gap-0.5 text-silver/70',
                  className
              )}
              role="navigation"
              aria-label="Branch navigation"
              {...rest}
          >
            {/* Branch icon */}
            {showIcon && (
                <GitBranch className={cx(iconSize, 'mr-0.5 text-silver/50')} aria-hidden="true"/>
            )}

            {/* Previous button */}
            <button
                type="button"
                onClick={onPrevious}
                disabled={isFirst}
                className={cx(
                    buttonSize,
                    'hover:text-white hover:bg-white/10  transition-colors',
                    'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70'
                )}
                aria-label="Previous branch"
            >
              <ChevronLeft className={iconSize}/>
            </button>

            {/* Counter */}
            <span className={cx(textSize, 'tabular-nums min-w-6 text-center')}>
          {current}/{total}
        </span>

            {/* Next button */}
            <button
                type="button"
                onClick={onNext}
                disabled={isLast}
                className={cx(
                    buttonSize,
                    'hover:text-white hover:bg-white/10  transition-colors',
                    'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70'
                )}
                aria-label="Next branch"
            >
              <ChevronRight className={iconSize}/>
            </button>
          </div>
      )
    }
)

BranchNavigator.displayName = 'BranchNavigator'

export default BranchNavigator
