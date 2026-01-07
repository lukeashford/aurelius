import React from 'react'
import {cx} from '../utils'

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full'
export type ColOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type ColOrder = 'first' | 'last' | 'none' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface ResponsiveValue<T> {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: ColSpan | ResponsiveValue<ColSpan>
  offset?: ColOffset | ResponsiveValue<ColOffset>
  order?: ColOrder | ResponsiveValue<ColOrder>
}

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const SPAN_CLASS_MAP: Record<Breakpoint, Record<ColSpan, string>> = {
  base: {
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
  },
  sm: {
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
  },
  md: {
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
  },
  lg: {
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
  },
  xl: {
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
  },
  '2xl': {
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
  },
}

const OFFSET_CLASS_MAP: Record<Breakpoint, Record<ColOffset, string>> = {
  base: {
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
  },
  sm: {
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
  },
  md: {
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
  },
  lg: {
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
  },
  xl: {
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
  },
  '2xl': {
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
  },
}

const ORDER_CLASS_MAP: Record<Breakpoint, Record<ColOrder, string>> = {
  base: {
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
  },
  sm: {
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
  },
  md: {
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
  },
  lg: {
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
  },
  xl: {
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
  },
  '2xl': {
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
  },
}

function isResponsiveValue<T>(value: T | ResponsiveValue<T>): value is ResponsiveValue<T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function buildResponsiveClasses<T extends string | number>(
    value: T | ResponsiveValue<T> | undefined,
    classMap: Record<Breakpoint, Record<T, string>>
): string[] {
  if (value === undefined) {
    return []
  }

  if (!isResponsiveValue(value)) {
    const cls = classMap.base[value]
    return cls ? [cls] : []
  }

  const classes: string[] = []
  for (const [breakpoint, val] of Object.entries(value) as [Breakpoint, T][]) {
    if (val !== undefined) {
      const cls = classMap[breakpoint]?.[val]
      if (cls) {
        classes.push(cls)
      }
    }
  }
  return classes
}

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
    ({span, offset, order, className, children, ...props}, ref) => {
      const spanClasses = buildResponsiveClasses(span, SPAN_CLASS_MAP)
      const offsetClasses = buildResponsiveClasses(offset, OFFSET_CLASS_MAP)
      const orderClasses = buildResponsiveClasses(order, ORDER_CLASS_MAP)

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
