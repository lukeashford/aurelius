import React from 'react'
import { cx } from '../utils/cx'

export interface ColorSwatchProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  label?: string
}

export const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
    ({color, label, className, ...rest}, ref) => {
      return (
          <div
              ref={ref}
              className={cx('flex flex-col items-center gap-2', className)}
              {...rest}
          >
            <div
                className="h-16 w-16 border-2 border-ash rounded-none shadow-sm"
                style={{backgroundColor: color}}
                aria-label={label || color}
            />
            {label && (
                <span className="text-xs text-silver font-medium">{label}</span>
            )}
          </div>
      )
    }
)

ColorSwatch.displayName = 'ColorSwatch'

export default ColorSwatch
