import React from 'react'

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto'

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span (1-12) or 'auto' for flexible width */
  span?: ColSpan
  /** Column span at sm breakpoint (640px+) */
  sm?: ColSpan
  /** Column span at md breakpoint (768px+) */
  md?: ColSpan
  /** Column span at lg breakpoint (1024px+) */
  lg?: ColSpan
  /** Column span at xl breakpoint (1280px+) */
  xl?: ColSpan
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({span, sm, md, lg, xl, className, children, ...props}, ref) => {
    const classes = cx(
      span === 'auto' ? 'col' : span && `col-${span}`,
      sm === 'auto' ? 'sm:col' : sm && `sm:col-${sm}`,
      md === 'auto' ? 'md:col' : md && `md:col-${md}`,
      lg === 'auto' ? 'lg:col' : lg && `lg:col-${lg}`,
      xl === 'auto' ? 'xl:col' : xl && `xl:col-${xl}`,
      !span && !sm && !md && !lg && !xl && 'col',
      className
    )

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)

Col.displayName = 'Col'
