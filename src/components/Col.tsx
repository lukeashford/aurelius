import React from 'react'
import { cx } from '../utils/cx'

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full'
export type ColOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type ColOrder = 'first' | 'last' | 'none' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span (1-12), 'auto' for content-based width, or 'full' for full row width */
  span?: ColSpan
  /** Column offset (0-11) - shifts column to the right */
  offset?: ColOffset
  /** Column order for reordering */
  order?: ColOrder

  /** Column span at xs breakpoint (default/mobile) */
  xs?: ColSpan
  /** Column span at sm breakpoint (640px+) */
  sm?: ColSpan
  /** Column span at md breakpoint (768px+) */
  md?: ColSpan
  /** Column span at lg breakpoint (1024px+) */
  lg?: ColSpan
  /** Column span at xl breakpoint (1280px+) */
  xl?: ColSpan
  /** Column span at xxl breakpoint (1536px+) */
  xxl?: ColSpan

  /** Column offset at xs breakpoint */
  xsOffset?: ColOffset
  /** Column offset at sm breakpoint */
  smOffset?: ColOffset
  /** Column offset at md breakpoint */
  mdOffset?: ColOffset
  /** Column offset at lg breakpoint */
  lgOffset?: ColOffset
  /** Column offset at xl breakpoint */
  xlOffset?: ColOffset
  /** Column offset at xxl breakpoint */
  xxlOffset?: ColOffset

  /** Column order at xs breakpoint */
  xsOrder?: ColOrder
  /** Column order at sm breakpoint */
  smOrder?: ColOrder
  /** Column order at md breakpoint */
  mdOrder?: ColOrder
  /** Column order at lg breakpoint */
  lgOrder?: ColOrder
  /** Column order at xl breakpoint */
  xlOrder?: ColOrder
  /** Column order at xxl breakpoint */
  xxlOrder?: ColOrder
}

// Static class maps to ensure Tailwind can see all class strings at build time
const SPAN_CLASSES: Record<ColSpan, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
  auto: 'col-auto',
  full: 'col-span-full',
}

const SM_SPAN_CLASSES: Record<ColSpan, string> = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
  7: 'sm:col-span-7',
  8: 'sm:col-span-8',
  9: 'sm:col-span-9',
  10: 'sm:col-span-10',
  11: 'sm:col-span-11',
  12: 'sm:col-span-12',
  auto: 'sm:col-auto',
  full: 'sm:col-span-full',
}

const MD_SPAN_CLASSES: Record<ColSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
  auto: 'md:col-auto',
  full: 'md:col-span-full',
}

const LG_SPAN_CLASSES: Record<ColSpan, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
  auto: 'lg:col-auto',
  full: 'lg:col-span-full',
}

const XL_SPAN_CLASSES: Record<ColSpan, string> = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6',
  7: 'xl:col-span-7',
  8: 'xl:col-span-8',
  9: 'xl:col-span-9',
  10: 'xl:col-span-10',
  11: 'xl:col-span-11',
  12: 'xl:col-span-12',
  auto: 'xl:col-auto',
  full: 'xl:col-span-full',
}

const XXL_SPAN_CLASSES: Record<ColSpan, string> = {
  1: '2xl:col-span-1',
  2: '2xl:col-span-2',
  3: '2xl:col-span-3',
  4: '2xl:col-span-4',
  5: '2xl:col-span-5',
  6: '2xl:col-span-6',
  7: '2xl:col-span-7',
  8: '2xl:col-span-8',
  9: '2xl:col-span-9',
  10: '2xl:col-span-10',
  11: '2xl:col-span-11',
  12: '2xl:col-span-12',
  auto: '2xl:col-auto',
  full: '2xl:col-span-full',
}

// Offset classes use col-start-* (col-start-2 means offset of 1, etc.)
const OFFSET_CLASSES: Record<ColOffset, string> = {
  0: '',
  1: 'col-start-2',
  2: 'col-start-3',
  3: 'col-start-4',
  4: 'col-start-5',
  5: 'col-start-6',
  6: 'col-start-7',
  7: 'col-start-8',
  8: 'col-start-9',
  9: 'col-start-10',
  10: 'col-start-11',
  11: 'col-start-12',
}

const SM_OFFSET_CLASSES: Record<ColOffset, string> = {
  0: '',
  1: 'sm:col-start-2',
  2: 'sm:col-start-3',
  3: 'sm:col-start-4',
  4: 'sm:col-start-5',
  5: 'sm:col-start-6',
  6: 'sm:col-start-7',
  7: 'sm:col-start-8',
  8: 'sm:col-start-9',
  9: 'sm:col-start-10',
  10: 'sm:col-start-11',
  11: 'sm:col-start-12',
}

const MD_OFFSET_CLASSES: Record<ColOffset, string> = {
  0: '',
  1: 'md:col-start-2',
  2: 'md:col-start-3',
  3: 'md:col-start-4',
  4: 'md:col-start-5',
  5: 'md:col-start-6',
  6: 'md:col-start-7',
  7: 'md:col-start-8',
  8: 'md:col-start-9',
  9: 'md:col-start-10',
  10: 'md:col-start-11',
  11: 'md:col-start-12',
}

const LG_OFFSET_CLASSES: Record<ColOffset, string> = {
  0: '',
  1: 'lg:col-start-2',
  2: 'lg:col-start-3',
  3: 'lg:col-start-4',
  4: 'lg:col-start-5',
  5: 'lg:col-start-6',
  6: 'lg:col-start-7',
  7: 'lg:col-start-8',
  8: 'lg:col-start-9',
  9: 'lg:col-start-10',
  10: 'lg:col-start-11',
  11: 'lg:col-start-12',
}

const XL_OFFSET_CLASSES: Record<ColOffset, string> = {
  0: '',
  1: 'xl:col-start-2',
  2: 'xl:col-start-3',
  3: 'xl:col-start-4',
  4: 'xl:col-start-5',
  5: 'xl:col-start-6',
  6: 'xl:col-start-7',
  7: 'xl:col-start-8',
  8: 'xl:col-start-9',
  9: 'xl:col-start-10',
  10: 'xl:col-start-11',
  11: 'xl:col-start-12',
}

const XXL_OFFSET_CLASSES: Record<ColOffset, string> = {
  0: '',
  1: '2xl:col-start-2',
  2: '2xl:col-start-3',
  3: '2xl:col-start-4',
  4: '2xl:col-start-5',
  5: '2xl:col-start-6',
  6: '2xl:col-start-7',
  7: '2xl:col-start-8',
  8: '2xl:col-start-9',
  9: '2xl:col-start-10',
  10: '2xl:col-start-11',
  11: '2xl:col-start-12',
}

const ORDER_CLASSES: Record<ColOrder, string> = {
  first: 'order-first',
  last: 'order-last',
  none: 'order-none',
  1: 'order-1',
  2: 'order-2',
  3: 'order-3',
  4: 'order-4',
  5: 'order-5',
  6: 'order-6',
  7: 'order-7',
  8: 'order-8',
  9: 'order-9',
  10: 'order-10',
  11: 'order-11',
  12: 'order-12',
}

const SM_ORDER_CLASSES: Record<ColOrder, string> = {
  first: 'sm:order-first',
  last: 'sm:order-last',
  none: 'sm:order-none',
  1: 'sm:order-1',
  2: 'sm:order-2',
  3: 'sm:order-3',
  4: 'sm:order-4',
  5: 'sm:order-5',
  6: 'sm:order-6',
  7: 'sm:order-7',
  8: 'sm:order-8',
  9: 'sm:order-9',
  10: 'sm:order-10',
  11: 'sm:order-11',
  12: 'sm:order-12',
}

const MD_ORDER_CLASSES: Record<ColOrder, string> = {
  first: 'md:order-first',
  last: 'md:order-last',
  none: 'md:order-none',
  1: 'md:order-1',
  2: 'md:order-2',
  3: 'md:order-3',
  4: 'md:order-4',
  5: 'md:order-5',
  6: 'md:order-6',
  7: 'md:order-7',
  8: 'md:order-8',
  9: 'md:order-9',
  10: 'md:order-10',
  11: 'md:order-11',
  12: 'md:order-12',
}

const LG_ORDER_CLASSES: Record<ColOrder, string> = {
  first: 'lg:order-first',
  last: 'lg:order-last',
  none: 'lg:order-none',
  1: 'lg:order-1',
  2: 'lg:order-2',
  3: 'lg:order-3',
  4: 'lg:order-4',
  5: 'lg:order-5',
  6: 'lg:order-6',
  7: 'lg:order-7',
  8: 'lg:order-8',
  9: 'lg:order-9',
  10: 'lg:order-10',
  11: 'lg:order-11',
  12: 'lg:order-12',
}

const XL_ORDER_CLASSES: Record<ColOrder, string> = {
  first: 'xl:order-first',
  last: 'xl:order-last',
  none: 'xl:order-none',
  1: 'xl:order-1',
  2: 'xl:order-2',
  3: 'xl:order-3',
  4: 'xl:order-4',
  5: 'xl:order-5',
  6: 'xl:order-6',
  7: 'xl:order-7',
  8: 'xl:order-8',
  9: 'xl:order-9',
  10: 'xl:order-10',
  11: 'xl:order-11',
  12: 'xl:order-12',
}

const XXL_ORDER_CLASSES: Record<ColOrder, string> = {
  first: '2xl:order-first',
  last: '2xl:order-last',
  none: '2xl:order-none',
  1: '2xl:order-1',
  2: '2xl:order-2',
  3: '2xl:order-3',
  4: '2xl:order-4',
  5: '2xl:order-5',
  6: '2xl:order-6',
  7: '2xl:order-7',
  8: '2xl:order-8',
  9: '2xl:order-9',
  10: '2xl:order-10',
  11: '2xl:order-11',
  12: '2xl:order-12',
}

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  (
    {
      span,
      offset,
      order,
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
      xsOffset,
      smOffset,
      mdOffset,
      lgOffset,
      xlOffset,
      xxlOffset,
      xsOrder,
      smOrder,
      mdOrder,
      lgOrder,
      xlOrder,
      xxlOrder,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // xs is treated as the base span (no breakpoint prefix)
    const baseSpan = span ?? xs

    const hasAnySpan = baseSpan !== undefined || sm !== undefined || md !== undefined ||
                       lg !== undefined || xl !== undefined || xxl !== undefined

    return (
      <div
        ref={ref}
        className={cx(
          // Span classes
          baseSpan !== undefined && SPAN_CLASSES[baseSpan],
          sm !== undefined && SM_SPAN_CLASSES[sm],
          md !== undefined && MD_SPAN_CLASSES[md],
          lg !== undefined && LG_SPAN_CLASSES[lg],
          xl !== undefined && XL_SPAN_CLASSES[xl],
          xxl !== undefined && XXL_SPAN_CLASSES[xxl],
          // Default to full width if no span specified
          !hasAnySpan && 'col-span-12',
          // Offset classes
          offset !== undefined && OFFSET_CLASSES[offset],
          xsOffset !== undefined && OFFSET_CLASSES[xsOffset],
          smOffset !== undefined && SM_OFFSET_CLASSES[smOffset],
          mdOffset !== undefined && MD_OFFSET_CLASSES[mdOffset],
          lgOffset !== undefined && LG_OFFSET_CLASSES[lgOffset],
          xlOffset !== undefined && XL_OFFSET_CLASSES[xlOffset],
          xxlOffset !== undefined && XXL_OFFSET_CLASSES[xxlOffset],
          // Order classes
          order !== undefined && ORDER_CLASSES[order],
          xsOrder !== undefined && ORDER_CLASSES[xsOrder],
          smOrder !== undefined && SM_ORDER_CLASSES[smOrder],
          mdOrder !== undefined && MD_ORDER_CLASSES[mdOrder],
          lgOrder !== undefined && LG_ORDER_CLASSES[lgOrder],
          xlOrder !== undefined && XL_ORDER_CLASSES[xlOrder],
          xxlOrder !== undefined && XXL_ORDER_CLASSES[xxlOrder],
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
