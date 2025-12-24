import React from 'react'
import { cx } from '../utils/cx'

export type RowGutter = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between columns (both directions). Use gutterX/gutterY for independent control. */
  gutter?: RowGutter
  /** Horizontal gap between columns */
  gutterX?: RowGutter
  /** Vertical gap between rows */
  gutterY?: RowGutter
  /** Horizontal alignment of columns */
  justify?: RowJustify
  /** Vertical alignment of columns */
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

function getGapClass(value: RowGutter): string {
  return `gap-${value}`
}

function getGapXClass(value: RowGutter): string {
  return `gap-x-${value}`
}

function getGapYClass(value: RowGutter): string {
  return `gap-y-${value}`
}

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ gutter = 4, gutterX, gutterY, justify, align, className, children, ...props }, ref) => {
    // Directional gutters take precedence over uniform gutter
    const gapClass = gutterX === undefined && gutterY === undefined ? getGapClass(gutter) : ''
    const gapXClass = gutterX !== undefined ? getGapXClass(gutterX) : ''
    const gapYClass = gutterY !== undefined ? getGapYClass(gutterY) : ''

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
