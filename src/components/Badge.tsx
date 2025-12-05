import React from 'react'

export type BadgeVariant = 'default' | 'gold' | 'success' | 'error' | 'warning' | 'info'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, ...rest }, ref) => {
    // Base badge styles
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border'

    // Variant styles
    const variantClasses = {
      default: 'bg-slate text-silver border-slate',
      gold: 'bg-gold/20 text-gold border-gold/30',
      success: 'bg-success/20 text-success border-success/30',
      error: 'bg-error/20 text-error border-error/30',
      warning: 'bg-warning/20 text-warning border-warning/30',
      info: 'bg-info/20 text-info border-info/30',
    }

    const variantClass = variantClasses[variant]

    return <span ref={ref} className={cx(base, variantClass, className)} {...rest} />
  }
)

Badge.displayName = 'Badge'

export default Badge
