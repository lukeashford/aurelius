import React from 'react'
import { cx } from '../utils/cx'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cx('animate-pulse bg-ash rounded-sm', className)}
        {...rest}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
