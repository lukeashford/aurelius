import React from 'react'
import { cx } from '../utils/cx'

export type StackDirection = 'horizontal' | 'vertical'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stack direction */
  direction?: StackDirection
  /** Alignment of items on the cross axis */
  align?: StackAlign
  /** Justification of items on the main axis */
  justify?: StackJustify
  /** Gap between items */
  gap?: StackGap
  /** Whether items should wrap */
  wrap?: boolean
  /** Render as a different element */
  as?: 'div' | 'section' | 'article' | 'nav' | 'aside' | 'header' | 'footer' | 'main'
}

const ALIGN_MAP: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const JUSTIFY_MAP: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const GAP_MAP: Record<StackGap, string> = {
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

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'vertical',
      align,
      justify,
      gap = 4,
      wrap = false,
      as: Component = 'div',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cx(
          'flex',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          align && ALIGN_MAP[align],
          justify && JUSTIFY_MAP[justify],
          GAP_MAP[gap],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Stack.displayName = 'Stack'
