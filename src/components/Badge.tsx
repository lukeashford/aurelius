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
    const variantClass =
      variant === 'gold'
        ? 'aurelius-badge--gold'
        : variant === 'success'
        ? 'aurelius-badge--success'
        : variant === 'error'
        ? 'aurelius-badge--error'
        : variant === 'warning'
        ? 'bg-warning/20 text-warning border-warning/30'
        : variant === 'info'
        ? 'bg-info/20 text-info border-info/30'
        : 'aurelius-badge--default'

    return <span ref={ref} className={cx('aurelius-badge', variantClass, className)} {...rest} />
  }
)

Badge.displayName = 'Badge'

export default Badge
