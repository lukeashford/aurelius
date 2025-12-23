import React from 'react'

export type RowGutter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12'

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between columns (uses Aurelius spacing tokens) */
  gutter?: RowGutter
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({gutter = '4', className, children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className={cx('row', gutter !== '4' && `gap-${gutter}`, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Row.displayName = 'Row'
