import React from 'react'
import {Check} from 'lucide-react'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'featured'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant
  /** Enables hover effects and cursor pointer */
  interactive?: boolean
  /** Shows selected state with checkmark */
  selected?: boolean
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: 'bg-charcoal shadow-sm border border-gold/30',
  elevated: 'bg-charcoal shadow-lg border-0',
  outlined: 'bg-charcoal shadow-none border border-ash',
  ghost: 'bg-transparent shadow-none border-0',
  featured: 'bg-charcoal border border-gold shadow-glow-sm',
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({variant = 'default', interactive = false, selected = false, className, children, ...props},
        ref) => {
      return (
          <div
              ref={ref}
              className={cx(
                  'rounded-none p-6 relative',
                  VARIANT_STYLES[variant],
                  interactive
                  && 'transition-all duration-200 hover:border-gold hover:shadow-glow cursor-pointer',
                  selected && 'border-gold shadow-glow-md',
                  className
              )}
              {...props}
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