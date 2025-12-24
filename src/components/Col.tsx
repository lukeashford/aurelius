import React from 'react'
import { cx } from '../utils/cx'

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full'
export type ColOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type ColOrder = 'first' | 'last' | 'none' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/** Responsive prop object for breakpoint-specific values */
export interface ResponsiveValue<T> {
  /** Base value (mobile-first) */
  base?: T
  /** Value at sm breakpoint (640px+) */
  sm?: T
  /** Value at md breakpoint (768px+) */
  md?: T
  /** Value at lg breakpoint (1024px+) */
  lg?: T
  /** Value at xl breakpoint (1280px+) */
  xl?: T
  /** Value at 2xl breakpoint (1536px+) */
  '2xl'?: T
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column span (1-12), 'auto' for content-based width, or 'full' for full row width.
   * Can be a single value or responsive object: { base: 12, md: 6, lg: 4 }
   */
  span?: ColSpan | ResponsiveValue<ColSpan>
  /**
   * Column offset (0-11) - shifts column to the right.
   * Can be a single value or responsive object.
   */
  offset?: ColOffset | ResponsiveValue<ColOffset>
  /**
   * Column order for reordering.
   * Can be a single value or responsive object.
   */
  order?: ColOrder | ResponsiveValue<ColOrder>
}

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const BREAKPOINT_PREFIXES: Record<Breakpoint, string> = {
  base: '',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
}

function getSpanClass(value: ColSpan, prefix: string): string {
  if (value === 'auto') return `${prefix}col-auto`
  if (value === 'full') return `${prefix}col-span-full`
  return `${prefix}col-span-${value}`
}

function getOffsetClass(value: ColOffset, prefix: string): string {
  if (value === 0) return ''
  return `${prefix}col-start-${value + 1}`
}

function getOrderClass(value: ColOrder, prefix: string): string {
  if (value === 'first') return `${prefix}order-first`
  if (value === 'last') return `${prefix}order-last`
  if (value === 'none') return `${prefix}order-none`
  return `${prefix}order-${value}`
}

function isResponsiveValue<T>(value: T | ResponsiveValue<T>): value is ResponsiveValue<T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function buildResponsiveClasses<T>(
  value: T | ResponsiveValue<T> | undefined,
  getClass: (val: T, prefix: string) => string
): string[] {
  if (value === undefined) return []

  if (!isResponsiveValue(value)) {
    const cls = getClass(value, '')
    return cls ? [cls] : []
  }

  const classes: string[] = []
  for (const [breakpoint, val] of Object.entries(value) as [Breakpoint, T][]) {
    if (val !== undefined) {
      const prefix = BREAKPOINT_PREFIXES[breakpoint] ?? ''
      const cls = getClass(val, prefix)
      if (cls) classes.push(cls)
    }
  }
  return classes
}

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({ span, offset, order, className, children, ...props }, ref) => {
    const spanClasses = buildResponsiveClasses(span, getSpanClass)
    const offsetClasses = buildResponsiveClasses(offset, getOffsetClass)
    const orderClasses = buildResponsiveClasses(order, getOrderClass)

    // Default to full width if no span specified
    const hasSpan = span !== undefined
    const defaultSpan = hasSpan ? '' : 'col-span-12'

    return (
      <div
        ref={ref}
        className={cx(
          defaultSpan,
          ...spanClasses,
          ...offsetClasses,
          ...orderClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Col.displayName = 'Col'
