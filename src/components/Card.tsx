import React from 'react'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'featured'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({variant = 'default', interactive = false, className, ...rest}, ref) => {
      // Base card styles
      const base = 'rounded-none p-6'

      // Variant styles
      const variantClasses = {
        default: 'bg-charcoal shadow-sm border border-gold/30',
        elevated: 'bg-charcoal shadow-lg border-0',
        outlined: 'bg-charcoal shadow-none border border-ash',
        ghost: 'bg-transparent shadow-none border-0',
        featured: 'bg-charcoal border border-gold shadow-[0_0_10px_rgba(201,162,39,0.2)]',
      }

      // Interactive styles
      const interactiveClass = interactive
          ? 'transition-all duration-normal hover:border-gold hover:shadow-glow cursor-pointer'
          : ''

      const variantClass = variantClasses[variant]

      return (
          <div
              ref={ref}
              className={cx(base, variantClass, interactiveClass, className)}
              {...rest}
          />
      )
    }
)

Card.displayName = 'Card'

export default Card
