import React from 'react'
import { cx } from '../utils/cx'

export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: ProgressSize
  variant?: ProgressVariant
  showValue?: boolean
  formatValue?: (value: number, max: number) => string
  indeterminate?: boolean
}

const SIZE_MAP: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const VARIANT_MAP: Record<ProgressVariant, string> = {
  default: 'bg-gold',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      showValue = false,
      formatValue,
      indeterminate = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    const displayValue = formatValue
      ? formatValue(value, max)
      : `${Math.round(percentage)}%`

    return (
      <div ref={ref} className={cx('w-full', className)} {...props}>
        {showValue && (
          <div className="flex justify-between mb-1">
            <span className="text-sm text-silver">Progress</span>
            <span className="text-sm text-white font-medium">{displayValue}</span>
          </div>
        )}
        <div
          className={cx(
            'w-full bg-charcoal border border-ash overflow-hidden rounded-none',
            SIZE_MAP[size]
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cx(
              'h-full transition-all duration-300 ease-out',
              VARIANT_MAP[variant],
              indeterminate && 'animate-pulse'
            )}
            style={{
              width: indeterminate ? '100%' : `${percentage}%`,
            }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'
