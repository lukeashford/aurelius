import React from 'react'
import {Check} from 'lucide-react'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'featured'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean
  selected?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({variant = 'default', interactive = false, selected = false, className, children, ...rest},
        ref) => {
      // Base card styles
      const base = 'rounded-none p-6 relative'

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
          ? 'transition-all duration-200 hover:border-gold hover:shadow-glow cursor-pointer'
          : ''

      // Selected styles
      const selectedClass = selected
          ? 'border-gold shadow-[0_0_15px_rgba(201,162,39,0.3)]'
          : ''

      const variantClass = variantClasses[variant]

      return (
          <div
              ref={ref}
              className={cx(base, variantClass, interactiveClass, selectedClass, className)}
              {...rest}
          >
            {children}
            {selected && (
                <div
                    className="absolute top-3 right-3 flex items-center justify-center h-6 w-6 rounded-full bg-gold text-obsidian">
                  <Check className="h-4 w-4"/>
                </div>
            )}
          </div>
      )
    }
)

Card.displayName = 'Card'

export default Card
