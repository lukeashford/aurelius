import React from 'react'

export interface StreamingCursorProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'block' | 'line' | 'underscore'
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const StreamingCursor = React.forwardRef<HTMLSpanElement, StreamingCursorProps>(
    ({className, variant = 'line', ...rest}, ref) => {
      const variantStyles = {
        block: 'w-2.5 h-cursor translate-y-cursor-offset',
        line: 'w-0.5 h-cursor translate-y-cursor-offset',
        underscore: 'w-2.5 h-0.5 self-end mb-0.5'
      }

      return (
          <span
              ref={ref}
              className={cx(
                  'inline-block bg-current animate-cursor-blink',
                  variantStyles[variant],
                  className
              )}
              aria-hidden="true"
              {...rest}
          />
      )
    }
)

StreamingCursor.displayName = 'StreamingCursor'

export default StreamingCursor
