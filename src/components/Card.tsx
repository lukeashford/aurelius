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
      const base = 'aurelius-card'
      const variantClass =
          variant === 'elevated'
              ? 'aurelius-card--elevated'
              : variant === 'outlined'
                  ? 'aurelius-card--outlined'
                  : variant === 'ghost'
                      ? 'bg-transparent shadow-none border-0'
                      : variant === 'featured'
                          ? 'aurelius-card--featured'
                          : ''

      // Use the design system's interactive class so hover styles match CSS
      const interactiveClass = interactive ? 'aurelius-card--interactive' : ''

      return <div ref={ref}
                  className={cx(base, variantClass, interactiveClass, className)} {...rest} />
    }
)

Card.displayName = 'Card'

export default Card
