import React from 'react'

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full'

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span (1-12), 'auto' for content-based width, or 'full' for full row width */
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
      span === 'auto' ? 'col-auto' : span === 'full' ? 'col-span-full' : span && `col-span-${span}`,
      sm === 'auto' ? 'sm:col-auto' : sm === 'full' ? 'sm:col-span-full' : sm && `sm:col-span-${sm}`,
      md === 'auto' ? 'md:col-auto' : md === 'full' ? 'md:col-span-full' : md && `md:col-span-${md}`,
      lg === 'auto' ? 'lg:col-auto' : lg === 'full' ? 'lg:col-span-full' : lg && `lg:col-span-${lg}`,
      xl === 'auto' ? 'xl:col-auto' : xl === 'full' ? 'xl:col-span-full' : xl && `xl:col-span-${xl}`,
      !span && !sm && !md && !lg && !xl && 'col-span-12',
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
