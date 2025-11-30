import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

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
