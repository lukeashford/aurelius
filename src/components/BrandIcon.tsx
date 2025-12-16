import React from 'react'

export type BrandIconSize = 'sm' | 'md' | 'lg'
export type BrandIconVariant = 'solid' | 'outline'

export interface BrandIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: BrandIconSize
  variant?: BrandIconVariant
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const sizeMap: Record<BrandIconSize, string> = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
}

export const BrandIcon = React.forwardRef<HTMLDivElement, BrandIconProps>(
    ({size = 'md', variant = 'solid', children, className, ...rest}, ref) => {
      const variantClasses =
          variant === 'solid'
              ? 'bg-gold text-obsidian border-2 border-gold'
              : 'bg-transparent text-gold border-2 border-gold'

      return (
          <div
              ref={ref}
              className={cx(
                  'inline-flex items-center justify-center rounded-none font-bold select-none overflow-hidden',
                  sizeMap[size],
                  variantClasses,
                  className
              )}
              {...rest}
          >
            {children}
          </div>
      )
    }
)

BrandIcon.displayName = 'BrandIcon'

export default BrandIcon
