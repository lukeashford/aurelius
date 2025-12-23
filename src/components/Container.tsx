import React from 'react'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'responsive'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Container size variant */
  size?: ContainerSize
}

const SIZE_CLASSES: Record<ContainerSize, string> = {
  sm: 'container-sm',
  md: 'container-md',
  lg: 'container-lg',
  xl: 'container-xl',
  fluid: 'container-fluid',
  responsive: 'container',
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({size = 'responsive', className, children, ...props}, ref) => {
    return (
      <div ref={ref} className={cx(SIZE_CLASSES[size], className)} {...props}>
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'
