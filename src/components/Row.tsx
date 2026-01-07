import React from 'react'
import {cx} from '../utils'

export type RowGutter = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gutter?: RowGutter
  gutterX?: RowGutter
  gutterY?: RowGutter
  justify?: RowJustify
  align?: RowAlign
}

const JUSTIFY_MAP: Record<RowJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const ALIGN_MAP: Record<RowAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const GAP_MAP: Record<RowGutter, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

const GAP_X_MAP: Record<RowGutter, string> = {
  0: 'gap-x-0',
  1: 'gap-x-1',
  2: 'gap-x-2',
  3: 'gap-x-3',
  4: 'gap-x-4',
  5: 'gap-x-5',
  6: 'gap-x-6',
  8: 'gap-x-8',
  10: 'gap-x-10',
  12: 'gap-x-12',
}

const GAP_Y_MAP: Record<RowGutter, string> = {
  0: 'gap-y-0',
  1: 'gap-y-1',
  2: 'gap-y-2',
  3: 'gap-y-3',
  4: 'gap-y-4',
  5: 'gap-y-5',
  6: 'gap-y-6',
  8: 'gap-y-8',
  10: 'gap-y-10',
  12: 'gap-y-12',
}

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
    ({gutter = 4, gutterX, gutterY, justify, align, className, children, ...props}, ref) => {
      // Directional gutters take precedence over uniform gutter
      const gapClass = gutterX === undefined && gutterY === undefined ? GAP_MAP[gutter] : ''
      const gapXClass = gutterX !== undefined ? GAP_X_MAP[gutterX] : ''
      const gapYClass = gutterY !== undefined ? GAP_Y_MAP[gutterY] : ''

      return (
          <div
              ref={ref}
              className={cx(
                  'row',
                  gapClass,
                  gapXClass,
                  gapYClass,
                  justify && JUSTIFY_MAP[justify],
                  align && ALIGN_MAP[align],
                  className
              )}
              {...props}
          >
            {children}
          </div>
      )
    }
)

Row.displayName = 'Row'
