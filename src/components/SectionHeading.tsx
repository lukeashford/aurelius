import React from 'react'

export type SectionHeadingLevel = 'h2' | 'h3'

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: SectionHeadingLevel
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const levelStyles = {
  h2: 'text-2xl mb-4',
  h3: 'text-xl mb-3',
}

export const SectionHeading = React.forwardRef<HTMLHeadingElement, SectionHeadingProps>(
    ({level = 'h2', children, className, ...rest}, ref) => {
      const Component = level

      return (
          <Component
              ref={ref as any}
              className={cx(
                  'text-gold font-semibold tracking-tight',
                  levelStyles[level],
                  className
              )}
              {...rest}
          >
            {children}
          </Component>
      )
    }
)

SectionHeading.displayName = 'SectionHeading'

export default SectionHeading
