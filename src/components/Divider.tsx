import React from 'react'
import { cx } from '../utils/cx'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Orientation of the divider */
  orientation?: DividerOrientation
  /** Visual style variant */
  variant?: DividerVariant
  /** Optional label to show in the center */
  label?: React.ReactNode
  /** Color variant */
  color?: 'default' | 'gold' | 'muted'
}

const COLOR_MAP: Record<string, string> = {
  default: 'border-ash',
  gold: 'border-gold/50',
  muted: 'border-slate',
}

const VARIANT_MAP: Record<DividerVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      label,
      color = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === 'horizontal'

    if (label && isHorizontal) {
      return (
        <div
          className={cx('flex items-center gap-4', className)}
          role="separator"
          aria-orientation={orientation}
        >
          <div
            className={cx(
              'flex-1 border-t',
              VARIANT_MAP[variant],
              COLOR_MAP[color]
            )}
          />
          <span className="text-sm text-silver shrink-0">{label}</span>
          <div
            className={cx(
              'flex-1 border-t',
              VARIANT_MAP[variant],
              COLOR_MAP[color]
            )}
          />
        </div>
      )
    }

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx(
          isHorizontal ? 'border-t w-full' : 'border-l h-full',
          VARIANT_MAP[variant],
          COLOR_MAP[color],
          'border-0',
          isHorizontal ? 'border-t' : 'border-l',
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'
